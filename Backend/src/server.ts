import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { connectDatabase, disconnectDatabase } from "./config/database";
import { env, isProduction } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";
import { apiRoutes } from "./routes";
import { healthRoutes } from "./routes/health.routes";

async function bootstrap(): Promise<void> {
  await connectDatabase();

  const app = express();

  app.set("trust proxy", 1);

  app.use(helmet());
  app.use(
    cors({
      origin:
        env.corsOrigins && env.corsOrigins.length > 0
          ? env.corsOrigins
          : true,
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan(isProduction ? "combined" : "dev"));

  const limiter = rateLimit({
    windowMs: env.rateLimitWindowMs,
    max: env.rateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.path === "/health" || req.path.endsWith("/health"),
  });
  app.use(limiter);

  app.use("/health", healthRoutes);
  app.use("/api", apiRoutes);

  app.use(notFound);
  app.use(errorHandler);

  const server = app.listen(env.port, () => {
    console.log(`Server listening on port ${env.port} (${env.nodeEnv})`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    console.log(`${signal} received, shutting down gracefully`);
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
    await disconnectDatabase();
    process.exit(0);
  };

  process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
  });
  process.on("SIGINT", () => {
    void shutdown("SIGINT");
  });
}

bootstrap().catch((err: unknown) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

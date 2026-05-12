import mongoose from "mongoose";
import { env, isProduction } from "./env";

export async function connectDatabase(): Promise<void> {
  mongoose.set("strictQuery", true);

  await mongoose.connect(env.mongoUri, {
    autoIndex: !isProduction,
  });
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}

import type { Request, Response } from "express";
import mongoose from "mongoose";
import { env } from "../config/env";

export function getHealth(_req: Request, res: Response): void {
  const dbState = mongoose.connection.readyState;
  const dbOk = dbState === 1;

  res.status(dbOk ? 200 : 503).json({
    success: dbOk,
    data: {
      status: dbOk ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: env.nodeEnv,
      database: {
        connected: dbOk,
        state: dbStateLabel(dbState),
      },
    },
  });
}

function dbStateLabel(state: number): string {
  switch (state) {
    case 0:
      return "disconnected";
    case 1:
      return "connected";
    case 2:
      return "connecting";
    case 3:
      return "disconnecting";
    default:
      return "unknown";
  }
}

import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { isProduction } from "../config/env";

export class AppError extends Error {
  readonly statusCode: number;
  readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      res.status(400).json({
        success: false,
        error: { message: "File too large; maximum size is 10MB" },
      });
      return;
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      res.status(400).json({
        success: false,
        error: { message: "Unexpected file field" },
      });
      return;
    }
    res.status(400).json({
      success: false,
      error: { message: err.message },
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        ...(isProduction ? {} : { stack: err.stack }),
      },
    });
    return;
  }

  const message = err instanceof Error ? err.message : "Internal Server Error";
  const stack = err instanceof Error ? err.stack : undefined;

  console.error(err);

  res.status(500).json({
    success: false,
    error: {
      message: isProduction ? "Internal Server Error" : message,
      ...(isProduction ? {} : { stack }),
    },
  });
}

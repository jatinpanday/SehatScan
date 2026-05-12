import type { NextFunction, Request, Response } from "express";
import { AppError } from "./errorHandler";
import { verifyAccessToken } from "../utils/jwt";

/**
 * Requires `Authorization: Bearer <JWT>`. Attaches `userId` and `userEmail` to the request.
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    next(new AppError("Missing or invalid Authorization header", 401));
    return;
  }

  const token = header.slice("Bearer ".length).trim();
  if (!token) {
    next(new AppError("Missing token", 401));
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    req.userId = payload.sub;
    req.userEmail = payload.email;
    next();
  } catch {
    next(new AppError("Invalid or expired token", 401));
  }
}

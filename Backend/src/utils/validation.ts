import { AppError } from "../middleware/errorHandler";
import type { PreferredLanguage } from "../models/constants";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function assertEmail(email: string): string {
  const e = typeof email === "string" ? email.trim().toLowerCase() : "";
  if (!e || !EMAIL_RE.test(e)) {
    throw new AppError("Valid email is required", 400);
  }
  return e;
}

export function assertPassword(password: string): void {
  if (typeof password !== "string" || password.length < 8) {
    throw new AppError("Password must be at least 8 characters", 400);
  }
}

export function assertName(name: unknown): string {
  if (typeof name !== "string" || name.trim().length === 0) {
    throw new AppError("Name is required", 400);
  }
  const n = name.trim();
  if (n.length > 120) {
    throw new AppError("Name is too long", 400);
  }
  return n;
}

export function parsePreferredLanguage(raw: unknown): PreferredLanguage {
  if (raw === undefined || raw === null || raw === "") {
    return "en";
  }
  if (raw === "en" || raw === "hi") {
    return raw;
  }
  throw new AppError('preferredLanguage must be "en" or "hi"', 400);
}


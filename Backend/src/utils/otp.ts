import crypto from "crypto";
import { env } from "../config/env";

/** 6-digit numeric OTP for email verification */
export function generateOtp(): string {
  return crypto.randomInt(100_000, 1_000_000).toString();
}

/**
 * HMAC-SHA256 stores the OTP without keeping plaintext in the database.
 * Passwords use bcrypt (slow, salted); OTPs are short-lived so a fast HMAC is standard.
 */
export function hashOtp(code: string): string {
  return crypto.createHmac("sha256", env.otpPepper).update(code).digest("hex");
}

export function verifyOtpHash(code: string, storedHash: string): boolean {
  const computed = hashOtp(code);
  try {
    return crypto.timingSafeEqual(Buffer.from(computed, "hex"), Buffer.from(storedHash, "hex"));
  } catch {
    return false;
  }
}

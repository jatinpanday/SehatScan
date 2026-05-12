import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export interface AccessTokenPayload {
  sub: string;
  email: string;
}

export function signAccessToken(userId: string, email: string): string {
  const payload: AccessTokenPayload = { sub: userId, email };
  const options: SignOptions = {
    expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
    issuer: "health-ai-tracker-api",
    audience: "health-ai-tracker-clients",
  };
  return jwt.sign(payload, env.jwtSecret, options);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, env.jwtSecret, {
    issuer: "health-ai-tracker-api",
    audience: "health-ai-tracker-clients",
  });
  if (typeof decoded === "string" || !("sub" in decoded) || !("email" in decoded)) {
    throw new Error("Invalid token payload");
  }
  return decoded as AccessTokenPayload;
}

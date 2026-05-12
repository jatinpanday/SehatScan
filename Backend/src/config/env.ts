import dotenv from "dotenv";

dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optionalNumber(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  const n = Number(raw);
  if (Number.isNaN(n)) {
    throw new Error(`Environment variable ${name} must be a number, got: ${raw}`);
  }
  return n;
}

function optionalCsv(name: string): string[] | undefined {
  const raw = process.env[name];
  if (!raw || raw.trim() === "") return undefined;
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

const nodeEnv = process.env.NODE_ENV ?? "development";
export const isProduction = nodeEnv === "production";

function parseEmailTransport(): "smtp" | "console" {
  const raw = (process.env.EMAIL_TRANSPORT ?? "").toLowerCase();
  if (raw === "smtp") return "smtp";
  if (raw === "console") return "console";
  return isProduction ? "smtp" : "console";
}

const jwtSecret = required("JWT_SECRET");

export const env = {
  nodeEnv,
  port: optionalNumber("PORT", 4000),
  mongoUri: required("MONGODB_URI"),
  rateLimitWindowMs: optionalNumber("RATE_LIMIT_WINDOW_MS", 15 * 60 * 1000),
  rateLimitMax: optionalNumber("RATE_LIMIT_MAX", 100),
  corsOrigins: optionalCsv("CORS_ORIGIN"),

  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN?.trim() || "7d",
  otpExpiresMinutes: optionalNumber("OTP_EXPIRES_MINUTES", 10),
  /** HMAC key for OTP hashing; defaults to JWT_SECRET if unset */
  otpPepper: process.env.OTP_PEPPER?.trim() || jwtSecret,

  emailTransport: parseEmailTransport(),
  smtpHost: process.env.SMTP_HOST?.trim() ?? "",
  smtpPort: optionalNumber("SMTP_PORT", 587),
  smtpSecure: process.env.SMTP_SECURE === "true",
  smtpUser: process.env.SMTP_USER?.trim() ?? "",
  smtpPass: process.env.SMTP_PASS ?? "",
  emailFrom: process.env.EMAIL_FROM?.trim() ?? "",

  awsAccessKeyId: required("AWS_ACCESS_KEY_ID"),
  awsSecretAccessKey: required("AWS_SECRET_ACCESS_KEY"),
  awsRegion: required("AWS_REGION"),
  awsBucketName: required("AWS_BUCKET_NAME"),
  /** Presigned GET URL lifetime returned after upload (seconds) */
  presignedUrlTtlSeconds: optionalNumber("PRESIGNED_URL_TTL_SECONDS", 3600),
  /**
   * When true, sends `x-amz-server-side-encryption: AES256` on PutObject.
   * Leave false if uploads fail (some KMS-default buckets reject explicit AES256).
   */
  s3PutSseAes256: (process.env.S3_PUT_SSE_AES256 ?? "").toLowerCase() === "true",

  /**
   * Prefer `GOOGLE_APPLICATION_CREDENTIALS` (path to service account JSON).
   * Otherwise set all three inline vars (private key: use \\n for newlines in .env).
   */
  googleApplicationCredentials: process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim() ?? "",
  googleVisionProjectId: process.env.GOOGLE_VISION_PROJECT_ID?.trim() ?? "",
  googleVisionClientEmail: process.env.GOOGLE_VISION_CLIENT_EMAIL?.trim() ?? "",
  googleVisionPrivateKey: (process.env.GOOGLE_VISION_PRIVATE_KEY ?? "").replace(/\\n/g, "\n"),
} as const;

if (env.emailTransport === "smtp") {
  if (!env.smtpHost) {
    throw new Error("SMTP_HOST is required when EMAIL_TRANSPORT=smtp (default in production)");
  }
  if (!env.emailFrom) {
    throw new Error("EMAIL_FROM is required when EMAIL_TRANSPORT=smtp");
  }
}

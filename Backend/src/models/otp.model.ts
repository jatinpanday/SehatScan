import mongoose, { type HydratedDocument, type Model, Schema } from "mongoose";

/**
 * Email verification / login OTP record.
 *
 * The `otp` field stores an **HMAC-SHA256 hex digest** of the 6-digit code (not plaintext).
 * MongoDB removes documents automatically when `expiresAt` is reached (TTL index).
 */
export interface IOtp {
  email: string;
  /** HMAC-SHA256 hex digest of the OTP; never store plaintext codes. */
  otp: string;
  expiresAt: Date;
  createdAt: Date;
}

export type IOtpDocument = HydratedDocument<IOtp>;
export type IOtpModel = Model<IOtp>;

const OTP_DIGEST_HEX = /^[a-f0-9]{64}$/i;

const otpSchema = new Schema<IOtp, IOtpModel>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      index: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"],
    },
    otp: {
      type: String,
      required: [true, "OTP digest is required"],
      validate: {
        validator: (v: string) => OTP_DIGEST_HEX.test(v),
        message: "OTP must be a 64-character hexadecimal HMAC digest",
      },
    },
    expiresAt: {
      type: Date,
      required: [true, "expiresAt is required"],
    },
    createdAt: {
      type: Date,
      default: () => new Date(),
    },
  },
  {
    versionKey: false,
  },
);

/** Drop expired documents when `expiresAt` is in the past */
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

/** Speed up “latest valid OTP for email” lookups */
otpSchema.index({ email: 1, expiresAt: -1 });

export const Otp = mongoose.model<IOtp, IOtpModel>("Otp", otpSchema);

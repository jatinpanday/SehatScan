import { env } from "../config/env";
import { AppError } from "../middleware/errorHandler";
import { Otp } from "../models/otp.model";
import { User } from "../models/user.model";
import { sendOtpEmail } from "./email.service";
import { generateOtp, hashOtp } from "../utils/otp";
import { hashPassword, verifyPassword } from "../utils/password";
import { signAccessToken } from "../utils/jwt";
import {
  assertEmail,
  assertName,
  assertPassword,
  parsePreferredLanguage,
} from "../utils/validation";

function otpExpiryDate(): Date {
  return new Date(Date.now() + env.otpExpiresMinutes * 60 * 1000);
}

async function issueAndSendOtp(email: string): Promise<void> {
  const plain = generateOtp();
  await Otp.deleteMany({ email });
  await Otp.create({
    email,
    otp: hashOtp(plain),
    expiresAt: otpExpiryDate(),
  });
  await sendOtpEmail(email, plain);
}

export async function signup(
  nameRaw: unknown,
  emailRaw: string,
  password: string,
  preferredLanguageRaw?: unknown,
): Promise<void> {
  const name = assertName(nameRaw);
  const email = assertEmail(emailRaw);
  assertPassword(password);
  const preferredLanguage = parsePreferredLanguage(preferredLanguageRaw);

  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError("An account with this email already exists", 409);
  }

  const passwordHash = await hashPassword(password);

  await User.create({
    name,
    email,
    password: passwordHash,
    isVerified: false,
    preferredLanguage,
    refreshToken: null,
  });

  await issueAndSendOtp(email);
}

/**
 * Resends OTP for an unverified account. Returns without error if the email is unknown
 * so callers cannot probe which addresses are registered.
 */
export async function sendOtp(emailRaw: string): Promise<void> {
  const email = assertEmail(emailRaw);

  const user = await User.findOne({ email });
  if (!user || user.isVerified) {
    return;
  }

  await issueAndSendOtp(email);
}

export async function verifyOtp(emailRaw: string, code: string): Promise<void> {
  const email = assertEmail(emailRaw);
  if (typeof code !== "string" || !/^\d{6}$/.test(code)) {
    throw new AppError("OTP must be a 6-digit code", 400);
  }

  const record = await Otp.findOne({
    email,
    otp: hashOtp(code),
    expiresAt: { $gt: new Date() },
  });

  if (!record) {
    throw new AppError("Invalid or expired OTP; request a new code", 400);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("No account found for this email", 404);
  }
  if (user.isVerified) {
    await Otp.deleteMany({ email });
    throw new AppError("Email is already verified", 400);
  }

  user.isVerified = true;
  await user.save();
  await Otp.deleteMany({ email });
}

export async function login(
  emailRaw: string,
  password: string,
): Promise<{
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    isVerified: boolean;
    preferredLanguage: string;
  };
}> {
  const email = assertEmail(emailRaw);
  assertPassword(password);

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const ok = await verifyPassword(password, user.password);
  if (!ok) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!user.isVerified) {
    throw new AppError("Verify your email with the OTP before logging in", 403);
  }

  const token = signAccessToken(String(user._id), user.email);
  return {
    token,
    user: {
      id: String(user._id),
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      preferredLanguage: user.preferredLanguage,
    },
  };
}

export async function getUserById(userId: string): Promise<{
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  preferredLanguage: string;
}> {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    isVerified: user.isVerified,
    preferredLanguage: user.preferredLanguage,
  };
}

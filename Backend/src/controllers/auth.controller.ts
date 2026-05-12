import type { Request, Response } from "express";
import * as authService from "../services/auth.service";

export async function signup(req: Request, res: Response): Promise<void> {
  const { name, email, password, preferredLanguage } = req.body as {
    name?: unknown;
    email?: string;
    password?: string;
    preferredLanguage?: unknown;
  };
  await authService.signup(name, email ?? "", password ?? "", preferredLanguage);
  res.status(201).json({
    success: true,
    message: "Account created. Check your email for the verification code.",
  });
}

export async function sendOtp(req: Request, res: Response): Promise<void> {
  const { email } = req.body as { email?: string };
  await authService.sendOtp(email ?? "");
  res.json({
    success: true,
    message:
      "If an unverified account exists for this email, a new verification code was sent.",
  });
}

export async function verifyOtp(req: Request, res: Response): Promise<void> {
  const { email, otp } = req.body as { email?: string; otp?: string };
  await authService.verifyOtp(email ?? "", otp ?? "");
  res.json({
    success: true,
    message: "Email verified. You can log in now.",
  });
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as { email?: string; password?: string };
  const result = await authService.login(email ?? "", password ?? "");
  res.json({
    success: true,
    data: result,
  });
}

export async function me(req: Request, res: Response): Promise<void> {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ success: false, error: { message: "Unauthorized" } });
    return;
  }
  const user = await authService.getUserById(userId);
  res.json({ success: true, data: { user } });
}

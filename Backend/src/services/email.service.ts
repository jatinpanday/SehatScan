import nodemailer from "nodemailer";
import { env, isProduction } from "../config/env";

function createSmtpTransport(): nodemailer.Transporter {
  return nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
  });
}

/**
 * Sends the OTP email. In development with EMAIL_TRANSPORT=console, logs instead of SMTP.
 */
export async function sendOtpEmail(to: string, otp: string): Promise<void> {
  const subject = "Your verification code";
  const text = `Your verification code is ${otp}. It expires in ${env.otpExpiresMinutes} minutes. If you did not request this, ignore this email.`;

  if (env.emailTransport === "console") {
    console.info("\n--- OTP email (console transport) ---");
    console.info(`To: ${to}`);
    console.info(`Subject: ${subject}`);
    console.info(text);
    console.info("-------------------------------------\n");
    return;
  }

  const transport = createSmtpTransport();
  await transport.sendMail({
    from: env.emailFrom,
    to,
    subject,
    text,
  });

  if (!isProduction) {
    console.info(`OTP email sent via SMTP to ${to}`);
  }
}

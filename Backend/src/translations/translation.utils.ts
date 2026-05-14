import OpenAI from "openai";
import {
  TRANSLATION_BASE_DELAY_MS,
  TRANSLATION_MAX_DELAY_MS,
  TRANSLATION_MAX_RETRIES,
} from "./translation.constants";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function translationLog(
  level: "info" | "warn" | "error",
  message: string,
  meta?: Record<string, unknown>,
): void {
  const payload = meta ? `${message} ${JSON.stringify(meta)}` : message;
  if (level === "error") console.error(`[translation] ${payload}`);
  else if (level === "warn") console.warn(`[translation] ${payload}`);
  else console.info(`[translation] ${payload}`);
}

export function sanitizeText(value: unknown, maxLen = 8000): string {
  if (typeof value !== "string") return "";
  return value.replace(/\u0000/g, "").trim().slice(0, maxLen);
}

export function sanitizeStringArray(value: unknown, maxItems = 60): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => typeof item === "string")
    .map((item) => sanitizeText(item, 2000))
    .filter((item) => item.length > 0)
    .slice(0, maxItems);
}

export async function withOpenAiTranslationRetry<T>(
  fn: (attempt: number) => Promise<T>,
): Promise<T> {
  let lastErr: unknown;

  for (let attempt = 1; attempt <= TRANSLATION_MAX_RETRIES; attempt += 1) {
    try {
      return await fn(attempt);
    } catch (err) {
      lastErr = err;
      if (!isRetryableOpenAiError(err) || attempt === TRANSLATION_MAX_RETRIES) {
        throw err;
      }

      const delay = Math.min(
        TRANSLATION_MAX_DELAY_MS,
        TRANSLATION_BASE_DELAY_MS * 2 ** (attempt - 1) +
          Math.floor(Math.random() * 250),
      );

      translationLog("warn", "Retrying OpenAI translation request", {
        attempt,
        delayMs: delay,
        message: err instanceof Error ? err.message : String(err),
      });

      await sleep(delay);
    }
  }

  throw lastErr;
}

function isRetryableOpenAiError(err: unknown): boolean {
  if (err instanceof OpenAI.APIError) {
    const status = err.status;
    return (
      status === 429 ||
      status === 408 ||
      status === 409 ||
      (status !== undefined && status >= 500 && status < 600)
    );
  }

  const e = err as { status?: number; code?: string; message?: string };
  if (typeof e?.status === "number") {
    return e.status === 429 || e.status === 408 || e.status === 409 || e.status >= 500;
  }

  const message = (e?.message ?? "").toLowerCase();
  return (
    e?.code === "ETIMEDOUT" ||
    e?.code === "ECONNRESET" ||
    message.includes("timeout") ||
    message.includes("timed out") ||
    message.includes("econnreset")
  );
}

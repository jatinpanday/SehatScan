import { AppError } from "../middleware/errorHandler";
import type { AbnormalSeverity } from "../models/constants";
import { ABNORMAL_SEVERITIES } from "../models/constants";
import OpenAI from "openai";
import type { MedicalAnalysisAiJson } from "./ai.types";

const MAX_ARRAY_ITEMS = 24;
const MAX_STRING_LEN = 8000;
const MAX_ITEM_LEN = 2000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function aiLog(level: "info" | "warn" | "error", message: string, meta?: Record<string, unknown>): void {
  const payload = meta ? `${message} ${JSON.stringify(meta)}` : message;
  if (level === "error") console.error(`[ai] ${payload}`);
  else if (level === "warn") console.warn(`[ai] ${payload}`);
  else console.info(`[ai] ${payload}`);
}

export function truncateForTokens(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  return `${text.slice(0, maxChars)}\n\n[... text truncated for processing ...]`;
}

function sanitizeString(s: unknown, maxLen: number): string {
  if (typeof s !== "string") return "";
  return s.replace(/\u0000/g, "").trim().slice(0, maxLen);
}

function sanitizeStringArray(arr: unknown, maxItems: number): string[] {
  if (!Array.isArray(arr)) return [];
  return arr
    .filter((x) => typeof x === "string")
    .map((x) => sanitizeString(x, MAX_ITEM_LEN))
    .filter((x) => x.length > 0)
    .slice(0, maxItems);
}

function parseSeverity(raw: unknown): AbnormalSeverity {
  if (typeof raw !== "string") return "unknown";
  const v = raw.toLowerCase().trim();
  if ((ABNORMAL_SEVERITIES as readonly string[]).includes(v)) {
    return v as AbnormalSeverity;
  }
  return "unknown";
}

export function normalizeAbnormalInput(
  items: unknown,
): Array<{
  markerName?: string;
  observedValue?: string;
  unit?: string;
  referenceRange?: string;
  severity: AbnormalSeverity;
}> {
  if (!Array.isArray(items)) return [];
  const out: Array<{
    markerName?: string;
    observedValue?: string;
    unit?: string;
    referenceRange?: string;
    severity: AbnormalSeverity;
  }> = [];

  for (const item of items.slice(0, MAX_ARRAY_ITEMS)) {
    if (typeof item === "string") {
      const line = sanitizeString(item, MAX_ITEM_LEN);
      if (line) {
        out.push({ markerName: line, severity: "unknown" });
      }
      continue;
    }
    if (item && typeof item === "object" && !Array.isArray(item)) {
      const o = item as Record<string, unknown>;
      const markerName = sanitizeString(o.markerName, 200) || undefined;
      const observedValue = sanitizeString(o.observedValue, 200) || undefined;
      const unit = sanitizeString(o.unit, 64) || undefined;
      const referenceRange = sanitizeString(o.referenceRange, 256) || undefined;
      const note = sanitizeString(o.note, 500) || undefined;
      const severity = parseSeverity(o.severity);
      const mergedName = [markerName, note].filter(Boolean).join(" — ") || undefined;
      if (mergedName || observedValue || unit || referenceRange) {
        out.push({
          markerName: mergedName,
          observedValue,
          unit,
          referenceRange,
          severity,
        });
      }
    }
  }
  return out;
}

/** Strip optional markdown code fences from model output. */
export function extractJsonObjectString(raw: string): string {
  let s = raw.trim();
  const fence = /^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/im;
  const m = s.match(fence);
  if (m?.[1]) {
    s = m[1].trim();
  }
  return s;
}

export function parseMedicalAnalysisJson(raw: string): MedicalAnalysisAiJson {
  const jsonStr = extractJsonObjectString(raw);
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonStr) as unknown;
  } catch {
    throw new AppError("AI returned invalid JSON", 502);
  }
  if (!parsed || typeof parsed !== "object") {
    throw new AppError("AI response was not a JSON object", 502);
  }
  const o = parsed as Record<string, unknown>;

  const summary = sanitizeString(o.summary, MAX_STRING_LEN);
  if (summary.length < 10) {
    throw new AppError("AI summary was too short or empty", 502);
  }

  const disclaimer = sanitizeString(o.disclaimer, MAX_STRING_LEN);
  if (disclaimer.length < 20) {
    throw new AppError("AI disclaimer missing or too short", 502);
  }

  const result: Omit<MedicalAnalysisAiJson, "abnormalValues"> & { abnormalValues: unknown } = {
    summary,
    keyFindings: sanitizeStringArray(o.keyFindings, MAX_ARRAY_ITEMS),
    abnormalValues: o.abnormalValues,
    possibleConcerns: sanitizeStringArray(o.possibleConcerns, MAX_ARRAY_ITEMS),
    lifestyleSuggestions: sanitizeStringArray(o.lifestyleSuggestions, MAX_ARRAY_ITEMS),
    precautions: sanitizeStringArray(o.precautions, MAX_ARRAY_ITEMS),
    questionsForDoctor: sanitizeStringArray(o.questionsForDoctor, MAX_ARRAY_ITEMS),
    disclaimer,
  };

  return {
    ...result,
    abnormalValues: normalizeAbnormalInput(result.abnormalValues),
  };
}

export interface RetryOptions {
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
}

const DEFAULT_RETRY: RetryOptions = {
  maxAttempts: 3,
  baseDelayMs: 800,
  maxDelayMs: 8000,
};

export async function withRetry<T>(
  fn: (attempt: number) => Promise<T>,
  options: Partial<RetryOptions> = {},
): Promise<T> {
  const opts = { ...DEFAULT_RETRY, ...options };
  let lastErr: unknown;
  for (let attempt = 1; attempt <= opts.maxAttempts; attempt += 1) {
    try {
      return await fn(attempt);
    } catch (err) {
      lastErr = err;
      const retryable = isRetryableOpenAiError(err);
      if (!retryable || attempt === opts.maxAttempts) {
        throw err;
      }
      const delay = Math.min(
        opts.maxDelayMs,
        opts.baseDelayMs * 2 ** (attempt - 1) + Math.floor(Math.random() * 200),
      );
      aiLog("warn", `OpenAI request failed (attempt ${attempt}), retrying`, {
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
    const s = err.status;
    if (s === 429) return true;
    if (s === 408 || s === 409) return true;
    if (s !== undefined && s >= 500 && s < 600) return true;
    return false;
  }
  if (err === null || err === undefined) return false;
  const e = err as { status?: number; code?: string; message?: string };
  const status = typeof e.status === "number" ? e.status : undefined;
  if (status === 429) return true;
  if (status === 408 || status === 409) return true;
  if (status !== undefined && status >= 500 && status < 600) return true;
  const msg = (e.message ?? "").toLowerCase();
  if (msg.includes("timeout") || msg.includes("timed out") || msg.includes("econnreset")) {
    return true;
  }
  if (e.code === "ETIMEDOUT" || e.code === "ECONNRESET") return true;
  return false;
}

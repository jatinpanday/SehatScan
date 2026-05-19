import { AppError } from "../middleware/errorHandler";

export function extractTranslationJson(raw: string): unknown {
  const json = stripOptionalJsonFence(raw);
  try {
    return JSON.parse(json) as unknown;
  } catch {
    throw new AppError("Translation AI returned invalid JSON", 502);
  }
}

function stripOptionalJsonFence(raw: string): string {
  let value = raw.trim();
  const fence = /^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/im;
  const match = value.match(fence);
  if (match?.[1]) {
    value = match[1].trim();
  }
  return value;
}

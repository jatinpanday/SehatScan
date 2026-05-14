import { AppError } from "../middleware/errorHandler";
import {
  SUPPORTED_TRANSLATION_LANGUAGES,
  TRANSLATION_KEYS,
  type SupportedTranslationLanguage,
} from "./translation.constants";
import type { AnalysisTranslationContent, TranslationAbnormalValue } from "./translation.types";
import { sanitizeStringArray, sanitizeText } from "./translation.utils";

export function assertTranslationLanguage(raw: unknown): SupportedTranslationLanguage {
  if (typeof raw !== "string") {
    throw new AppError('language must be "en" or "hi"', 400);
  }

  const language = raw.trim().toLowerCase();
  if ((SUPPORTED_TRANSLATION_LANGUAGES as readonly string[]).includes(language)) {
    return language as SupportedTranslationLanguage;
  }

  throw new AppError('language must be "en" or "hi"', 400);
}

export function validateTranslationResponse(raw: unknown): AnalysisTranslationContent {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    throw new AppError("Translation response must be a JSON object", 502);
  }

  const obj = raw as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  const expected = [...TRANSLATION_KEYS].sort();
  if (keys.length !== expected.length || keys.some((key, idx) => key !== expected[idx])) {
    throw new AppError("Translation response did not preserve the required JSON keys", 502);
  }

  const summary = sanitizeText(obj.summary);
  const disclaimer = sanitizeText(obj.disclaimer);
  if (summary.length < 5) {
    throw new AppError("Translated summary is missing or too short", 502);
  }
  if (disclaimer.length < 10) {
    throw new AppError("Translated disclaimer is missing or too short", 502);
  }

  if (!Array.isArray(obj.abnormalValues)) {
    throw new AppError("Translated abnormalValues must be an array", 502);
  }

  return {
    summary,
    keyFindings: sanitizeStringArray(obj.keyFindings),
    abnormalValues: validateAbnormalValues(obj.abnormalValues),
    possibleConcerns: sanitizeStringArray(obj.possibleConcerns),
    lifestyleSuggestions: sanitizeStringArray(obj.lifestyleSuggestions),
    precautions: sanitizeStringArray(obj.precautions),
    questionsForDoctor: sanitizeStringArray(obj.questionsForDoctor, 100),
    disclaimer,
  };
}

function validateAbnormalValues(raw: unknown[]): TranslationAbnormalValue[] {
  return raw
    .filter((item) => item && typeof item === "object" && !Array.isArray(item))
    .map((item) => {
      const o = item as Record<string, unknown>;
      const value: TranslationAbnormalValue = {
        severity: sanitizeText(o.severity, 64) || "unknown",
      };

      const markerName = sanitizeText(o.markerName, 200);
      const observedValue = sanitizeText(o.observedValue, 200);
      const unit = sanitizeText(o.unit, 64);
      const referenceRange = sanitizeText(o.referenceRange, 256);

      if (markerName) value.markerName = markerName;
      if (observedValue) value.observedValue = observedValue;
      if (unit) value.unit = unit;
      if (referenceRange) value.referenceRange = referenceRange;

      return value;
    })
    .slice(0, 500);
}

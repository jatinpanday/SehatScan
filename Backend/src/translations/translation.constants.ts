export const SUPPORTED_TRANSLATION_LANGUAGES = ["en", "hi"] as const;

export type SupportedTranslationLanguage =
  (typeof SUPPORTED_TRANSLATION_LANGUAGES)[number];

export const TRANSLATION_STATUSES = ["pending", "completed", "failed"] as const;

export type TranslationStatus = (typeof TRANSLATION_STATUSES)[number];

export const TRANSLATION_MODEL = "gpt-4.1";

export const TRANSLATION_TEMPERATURE = 0.2;

export const TRANSLATION_MAX_TOKENS = 2200;

export const TRANSLATION_MAX_RETRIES = 3;

export const TRANSLATION_BASE_DELAY_MS = 1200;

export const TRANSLATION_MAX_DELAY_MS = 9000;

export const TRANSLATION_KEYS = [
  "summary",
  "keyFindings",
  "abnormalValues",
  "possibleConcerns",
  "lifestyleSuggestions",
  "precautions",
  "questionsForDoctor",
  "disclaimer",
] as const;

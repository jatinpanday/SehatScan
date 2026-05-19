import type { SupportedTranslationLanguage } from "./translation.constants";
import type { AnalysisTranslationContent } from "./translation.types";

export const TRANSLATION_SYSTEM_PROMPT = `You are an expert medical translator for a health report analysis product.

Rules:
- Return one valid JSON object only. No markdown, no comments, no extra text.
- Preserve the exact JSON keys and nesting from the input.
- Preserve arrays as arrays.
- Preserve medical values, numbers, units, ranges, symbols, and comparison signs exactly.
- Do not invent, remove, diagnose, or soften medical facts.
- Keep the tone calm, beginner-friendly, and educational.
- Keep medical terms in English when translating them would become confusing.
- Never add treatment instructions or medication advice.`;

export function buildTranslationUserPrompt(
  analysis: AnalysisTranslationContent,
  language: SupportedTranslationLanguage,
): string {
  const languageRules =
    language === "hi"
      ? `Target language: Hindi (hi).
Hindi localization rules:
- Use simple, conversational Hindi that a beginner can understand.
- Avoid difficult Hindi medical words.
- Keep terms like Hemoglobin, Cholesterol, Blood Sugar, HDL, LDL, TSH, Vitamin D, mg/dL, g/dL, and mmol/L in English when useful.
- Preserve all lab values, units, ranges, marker names, severity labels, and symbols exactly.`
      : `Target language: English (en).
English localization rules:
- Use clear, simple English.
- Keep the original meaning and medical facts unchanged.
- Preserve all lab values, units, ranges, marker names, severity labels, and symbols exactly.`;

  return `${languageRules}

Translate only user-facing text values in this JSON.
Preserve this exact structure:
{
  "summary": "",
  "keyFindings": [],
  "abnormalValues": [],
  "possibleConcerns": [],
  "lifestyleSuggestions": [],
  "precautions": [],
  "questionsForDoctor": [],
  "disclaimer": ""
}

Input JSON:
${JSON.stringify(analysis)}`;
}

import OpenAI from "openai";
import { Types } from "mongoose";
import { env, isProduction } from "../config/env";
import { AppError } from "../middleware/errorHandler";
import { Analysis } from "../models/analysis.model";
import { Report } from "../models/report.model";
import {
  TRANSLATION_MAX_TOKENS,
  TRANSLATION_MODEL,
  TRANSLATION_TEMPERATURE,
} from "./translation.constants";
import { buildTranslationUserPrompt, TRANSLATION_SYSTEM_PROMPT } from "./translation.prompts";
import { extractTranslationJson } from "./translation.parser";
import type {
  AnalysisTranslationContent,
  GenerateTranslationParams,
  TranslateAnalysisParams,
  TranslationApiResponse,
} from "./translation.types";
import { translationLog, withOpenAiTranslationRetry } from "./translation.utils";
import { validateTranslationResponse as validateResponseShape } from "./translation.validator";

function getClient(): OpenAI {
  if (!env.openaiApiKey) {
    throw new AppError(
      "OpenAI is not configured. Set OPENAI_API_KEY in the environment.",
      503,
    );
  }

  return new OpenAI({
    apiKey: env.openaiApiKey,
    timeout: env.openaiTimeoutMs,
    maxRetries: 0,
  });
}

export async function translateAnalysis(
  params: TranslateAnalysisParams,
): Promise<TranslationApiResponse> {
  if (!Types.ObjectId.isValid(params.reportId)) {
    throw new AppError("Invalid report id", 400);
  }

  const report = await Report.findOne({
    _id: new Types.ObjectId(params.reportId),
    userId: new Types.ObjectId(params.userId),
  }).exec();

  if (!report) {
    throw new AppError("Report not found", 404);
  }

  if (!report.analysis) {
    throw new AppError("AI analysis not found for this report", 404);
  }

  const analysisDoc = await Analysis.findOne({
    _id: report.analysis,
    reportId: report._id,
  }).exec();

  if (!analysisDoc) {
    throw new AppError("AI analysis not found for this report", 404);
  }

  if (analysisDoc.analysisStatus !== "completed") {
    throw new AppError("AI analysis must be completed before translation", 400);
  }

  const cached = getCachedTranslation(analysisDoc.translatedContent, params.language);
  if (cached) {
    return {
      reportId: String(report._id),
      language: params.language,
      translationStatus: "completed",
      cached: true,
      translatedContent: cached,
    };
  }

  analysisDoc.translationStatus = "pending";
  analysisDoc.translatedLanguage = params.language;
  await analysisDoc.save();

  try {
    const source = sanitizeTranslation({
      summary: analysisDoc.summary,
      keyFindings: analysisDoc.keyFindings,
      abnormalValues: analysisDoc.abnormalValues.map((item) => ({
        markerName: item.markerName,
        observedValue: item.observedValue,
        unit: item.unit,
        referenceRange: item.referenceRange,
        severity: item.severity,
      })),
      possibleConcerns: analysisDoc.possibleConcerns,
      lifestyleSuggestions: analysisDoc.lifestyleSuggestions,
      precautions: analysisDoc.precautions,
      questionsForDoctor: analysisDoc.questionsForDoctor,
      disclaimer: analysisDoc.disclaimer,
    });

    const translated = await generateTranslation({
      analysis: source,
      language: params.language,
    });

    await saveTranslation(String(analysisDoc._id), params.language, translated);

    return {
      reportId: String(report._id),
      language: params.language,
      translationStatus: "completed",
      cached: false,
      translatedContent: translated,
    };
  } catch (err) {
    translationLog("error", "Translation failed", {
      reportId: params.reportId,
      language: params.language,
      message: err instanceof Error ? err.message : String(err),
    });

    analysisDoc.translationStatus = "failed";
    analysisDoc.translatedLanguage = params.language;
    await analysisDoc.save().catch(() => undefined);

    if (err instanceof AppError) {
      throw err;
    }

    const message = err instanceof Error ? err.message : String(err);
    if (!isProduction) {
      throw new AppError(`Translation failed: ${message}`, 502);
    }
    throw new AppError("Translation failed", 502);
  }
}

export async function generateTranslation(
  params: GenerateTranslationParams,
): Promise<AnalysisTranslationContent> {
  const client = getClient();
  const prompt = buildTranslationUserPrompt(params.analysis, params.language);

  const completion = await withOpenAiTranslationRetry(() =>
    client.chat.completions.create({
      model: TRANSLATION_MODEL,
      messages: [
        { role: "system", content: TRANSLATION_SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: TRANSLATION_TEMPERATURE,
      max_tokens: TRANSLATION_MAX_TOKENS,
    }),
  );

  const content = completion.choices?.[0]?.message?.content;
  if (!content) {
    throw new AppError("Translation AI returned empty response", 502);
  }

  return validateTranslationResponse(extractTranslationJson(content));
}

export function validateTranslationResponse(raw: unknown): AnalysisTranslationContent {
  return validateResponseShape(raw);
}

export function getCachedTranslation(
  translatedContent: unknown,
  language: TranslateAnalysisParams["language"],
): AnalysisTranslationContent | null {
  if (!translatedContent || typeof translatedContent !== "object") {
    return null;
  }

  const cache = translatedContent as Record<string, unknown>;
  const value = cache[language];
  if (!value) {
    return null;
  }

  return validateTranslationResponse(value);
}

export async function saveTranslation(
  analysisId: string,
  language: TranslateAnalysisParams["language"],
  translatedContent: AnalysisTranslationContent,
): Promise<void> {
  await Analysis.findByIdAndUpdate(analysisId, {
    $set: {
      [`translatedContent.${language}`]: translatedContent,
      translatedLanguage: language,
      translationStatus: "completed",
    },
  }).exec();
}

export function sanitizeTranslation(
  raw: AnalysisTranslationContent,
): AnalysisTranslationContent {
  return validateTranslationResponse(raw);
}

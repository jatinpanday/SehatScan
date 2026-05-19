import OpenAI from "openai";
import { env, isProduction } from "../config/env";
import { AppError } from "../middleware/errorHandler";
import type { PreferredLanguage } from "../models/constants";
import {
  MEDICAL_ANALYSIS_SYSTEM_PROMPT,
  buildMedicalAnalysisUserPrompt,
} from "./ai.prompts";

import type { MedicalAnalysisAiJson } from "./ai.types";

import {
  aiLog,
  parseMedicalAnalysisJson,
  truncateForTokens,
} from "./ai.utils";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

export async function analyzeMedicalReportOcrText(params: {
  ocrText: string;
  language: PreferredLanguage;
}): Promise<MedicalAnalysisAiJson> {

  // Prevent huge OCR payloads
  const truncated = truncateForTokens(
    params.ocrText
      .replace(/\s+/g, " ")
      .trim(),
    env.openaiMaxInputChars || 12000,
  );

  const userContent = buildMedicalAnalysisUserPrompt(
    truncated,
    params.language,
  );

  const client = getClient();

  const MAX_RETRIES = 3;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {

      const completion = await client.chat.completions.create({
        model: env.openaiModel || "gpt-4.1-mini",

        messages: [
          {
            role: "system",
            content: MEDICAL_ANALYSIS_SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: userContent,
          },
        ],

        response_format: {
          type: "json_object",
        },

        temperature: 0.2,

        // IMPORTANT
        // Reduce from 4096
        max_tokens: 1800,
      });

      const content =
        completion.choices?.[0]?.message?.content;

      if (!content) {
        throw new AppError(
          "OpenAI returned empty response",
          502,
        );
      }

      return parseMedicalAnalysisJson(content);

    } catch (err) {

      // OpenAI API errors
      if (err instanceof OpenAI.APIError) {

        aiLog("error", "OpenAI error", {
          status: err.status,
          message: err.message,
        });

        // RATE LIMIT
        if (err.status === 429) {

          // Final retry failed
          if (attempt === MAX_RETRIES - 1) {
            throw new AppError(
              "AI service is busy (rate limit). Please try again shortly.",
              429,
            );
          }

          // Exponential backoff
          const delay =
            Math.pow(2, attempt) * 2000;

          aiLog("warn", "Retrying OpenAI request", {
            attempt,
            delay,
          });

          await sleep(delay);

          continue;
        }

        throw new AppError(
          `OpenAI error: ${err.message}`,
          502,
        );
      }

      // Unknown errors
      const msg =
        err instanceof Error
          ? err.message
          : String(err);

      aiLog("error", "AI request failed", {
        message: msg,
      });

      if (!isProduction && err instanceof Error) {
        throw err;
      }

      throw new AppError(
        `AI request failed: ${msg}`,
        502,
      );
    }
  }

  throw new AppError(
    "AI analysis failed",
    500,
  );
}
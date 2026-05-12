import { ImageAnnotatorClient } from "@google-cloud/vision";
import { env } from "../config/env";
import { AppError } from "../middleware/errorHandler";
import type { GoogleVisionTextResult } from "./ocr.types";

let client: ImageAnnotatorClient | null = null;

function assertVisionConfigured(): void {
  const hasFile = env.googleApplicationCredentials.length > 0;
  const hasInline =
    env.googleVisionProjectId.length > 0 &&
    env.googleVisionClientEmail.length > 0 &&
    env.googleVisionPrivateKey.length > 0;
  if (!hasFile && !hasInline) {
    throw new AppError(
      "Google Vision is not configured. Set GOOGLE_APPLICATION_CREDENTIALS or GOOGLE_VISION_PROJECT_ID, GOOGLE_VISION_CLIENT_EMAIL, and GOOGLE_VISION_PRIVATE_KEY.",
      503,
    );
  }
}

export function getImageAnnotatorClient(): ImageAnnotatorClient {
  assertVisionConfigured();
  if (client) return client;

  if (env.googleApplicationCredentials.length > 0) {
    client = new ImageAnnotatorClient();
    return client;
  }

  client = new ImageAnnotatorClient({
    projectId: env.googleVisionProjectId,
    credentials: {
      client_email: env.googleVisionClientEmail,
      private_key: env.googleVisionPrivateKey,
    },
  });
  return client;
}

/**
 * Dense text extraction for photos / scans using Document Text Detection.
 * Vision synchronous API supports images only (not multi-page PDF).
 */
export async function documentTextDetectionFromBuffer(
  imageBuffer: Buffer,
): Promise<GoogleVisionTextResult> {
  const vision = getImageAnnotatorClient();

  try {
    const [result] = await vision.documentTextDetection({
      image: { content: imageBuffer },
    });

    if (result.error?.message) {
      throw new Error(result.error.message);
    }

    const text = result.fullTextAnnotation?.text?.trim() ?? "";
    let confidenceHint: number | undefined;
    const pages = result.fullTextAnnotation?.pages;
    if (pages?.length) {
      const confidences = pages
        .map((p) => p.confidence ?? 0)
        .filter((c) => c > 0);
      if (confidences.length > 0) {
        confidenceHint =
          confidences.reduce((a, b) => a + b, 0) / confidences.length;
      }
    }

    return { rawText: text, confidenceHint };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new AppError(`Google Vision request failed: ${msg}`, 502);
  }
}

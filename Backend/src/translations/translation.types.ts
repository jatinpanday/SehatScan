import type { SupportedTranslationLanguage, TranslationStatus } from "./translation.constants";

export interface TranslationAbnormalValue {
  markerName?: string;
  observedValue?: string;
  unit?: string;
  referenceRange?: string;
  severity: string;
}

export interface AnalysisTranslationContent {
  summary: string;
  keyFindings: string[];
  abnormalValues: TranslationAbnormalValue[];
  possibleConcerns: string[];
  lifestyleSuggestions: string[];
  precautions: string[];
  questionsForDoctor: string[];
  disclaimer: string;
}

export type TranslationCache = Partial<
  Record<SupportedTranslationLanguage, AnalysisTranslationContent>
>;

export interface TranslationRequestBody {
  language?: unknown;
}

export interface TranslateAnalysisParams {
  reportId: string;
  userId: string;
  language: SupportedTranslationLanguage;
}

export interface TranslationApiResponse {
  reportId: string;
  language: SupportedTranslationLanguage;
  translationStatus: TranslationStatus;
  cached: boolean;
  translatedContent: AnalysisTranslationContent;
}

export interface GenerateTranslationParams {
  analysis: AnalysisTranslationContent;
  language: SupportedTranslationLanguage;
}

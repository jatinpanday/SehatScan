import type { AbnormalSeverity } from "../models/constants";

/** Validated analysis shape after JSON parse + normalization. */
export interface MedicalAnalysisAiJson {
  summary: string;
  keyFindings: string[];
  abnormalValues: NormalizedAbnormalValue[];
  possibleConcerns: string[];
  lifestyleSuggestions: string[];
  precautions: string[];
  questionsForDoctor: string[];
  disclaimer: string;
}

/** Flexible abnormal entry from the model (object or plain string line). */
export type MedicalAnalysisAbnormalInput =
  | string
  | {
      markerName?: string;
      observedValue?: string;
      unit?: string;
      referenceRange?: string;
      severity?: string;
      note?: string;
    };

export interface NormalizedAbnormalValue {
  markerName?: string;
  observedValue?: string;
  unit?: string;
  referenceRange?: string;
  severity: AbnormalSeverity;
}

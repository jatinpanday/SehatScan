import mongoose, { type HydratedDocument, type Model, Schema, type Types } from "mongoose";
import type { HealthReportType, OcrStatus, ReportStatus } from "./constants";
import { HEALTH_REPORT_TYPES, OCR_STATUSES, REPORT_STATUSES } from "./constants";

export interface IReport {
  userId: Types.ObjectId;
  originalFileName: string;
  fileUrl: string;
  fileType: string;
  reportType: HealthReportType;
  extractedText: string;
  ocrStatus: OcrStatus;
  processedAt: Date | null;
  /** Optional pointer to structured analysis document (1:1 in typical flow) */
  analysis: Types.ObjectId | null;
  language: string;
  status: ReportStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type IReportDocument = HydratedDocument<IReport>;
export type IReportModel = Model<IReport>;

const reportSchema = new Schema<IReport, IReportModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId is required"],
      index: true,
    },
    originalFileName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 512,
    },
    fileUrl: {
      type: String,
      required: true,
      trim: true,
      maxlength: 4096,
    },
    fileType: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 128,
      index: true,
    },
    reportType: {
      type: String,
      enum: {
        values: HEALTH_REPORT_TYPES,
        message: "{VALUE} is not a valid report type",
      },
      required: true,
      index: true,
    },
    extractedText: {
      type: String,
      default: "",
    },
    ocrStatus: {
      type: String,
      enum: {
        values: OCR_STATUSES,
        message: "{VALUE} is not a valid OCR status",
      },
      default: "pending",
      index: true,
    },
    processedAt: {
      type: Date,
      default: null,
    },
    analysis: {
      type: Schema.Types.ObjectId,
      ref: "Analysis",
      default: null,
      index: true,
    },
    language: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 16,
      default: "en",
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: REPORT_STATUSES,
        message: "{VALUE} is not a valid status",
      },
      default: "uploaded",
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

reportSchema.index({ userId: 1, createdAt: -1 });
reportSchema.index({ userId: 1, status: 1 });
reportSchema.index({ status: 1, createdAt: -1 });
reportSchema.index({ userId: 1, ocrStatus: 1 });

export const Report = mongoose.model<IReport, IReportModel>("Report", reportSchema);

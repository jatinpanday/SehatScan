import mongoose, { type HydratedDocument, type Model, Schema } from "mongoose";
import type { PreferredLanguage } from "./constants";
import { PREFERRED_LANGUAGES } from "./constants";

/**
 * Application user. `password` stores a bcrypt hash; it is never returned unless
 * explicitly selected with `.select("+password")`.
 */
export interface IUser {
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  preferredLanguage: PreferredLanguage;
  /** Opaque refresh token (e.g. hashed); optional until login implements refresh flow */
  refreshToken: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type IUserDocument = HydratedDocument<IUser>;
export type IUserModel = Model<IUser>;

const userSchema = new Schema<IUser, IUserModel>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [1, "Name cannot be empty"],
      maxlength: [120, "Name is too long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    preferredLanguage: {
      type: String,
      enum: {
        values: PREFERRED_LANGUAGES,
        message: "{VALUE} is not a supported language",
      },
      default: "en",
    },
    refreshToken: {
      type: String,
      default: null,
      select: false,
      sparse: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index({ createdAt: -1 });

export const User = mongoose.model<IUser, IUserModel>("User", userSchema);

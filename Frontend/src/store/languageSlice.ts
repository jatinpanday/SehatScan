import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PreferredLanguage } from "@/types/auth";

const LANGUAGE_KEY = "health_ai_language";

export interface LanguageState {
  currentLanguage: PreferredLanguage;
}

const initialState: LanguageState = {
  currentLanguage: (localStorage.getItem(LANGUAGE_KEY) as PreferredLanguage | null) ?? "en",
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<PreferredLanguage>) {
      state.currentLanguage = action.payload;
      localStorage.setItem(LANGUAGE_KEY, action.payload);
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export const languageReducer = languageSlice.reducer;

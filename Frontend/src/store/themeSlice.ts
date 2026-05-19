import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ThemeMode = "light" | "dark";
const THEME_KEY = "health_ai_theme";

export interface ThemeState {
  mode: ThemeMode;
}

const initialState: ThemeState = {
  mode: (localStorage.getItem(THEME_KEY) as ThemeMode | null) ?? "light",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.mode = action.payload;
      localStorage.setItem(THEME_KEY, action.payload);
    },
    toggleTheme(state) {
      state.mode = state.mode === "light" ? "dark" : "light";
      localStorage.setItem(THEME_KEY, state.mode);
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export const themeReducer = themeSlice.reducer;

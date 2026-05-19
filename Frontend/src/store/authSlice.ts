import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { tokenService } from "@/services/token.service";
import type { AuthState } from "@/types/auth";

const token = tokenService.getAccessToken();

const initialState: AuthState = {
  token,
  isAuthenticated: Boolean(token),
  bootstrapped: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ token: string }>) {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      tokenService.setAccessToken(action.payload.token);
    },
    logout(state) {
      state.token = null;
      state.isAuthenticated = false;
      tokenService.clear();
    },
    setBootstrapped(state, action: PayloadAction<boolean>) {
      state.bootstrapped = action.payload;
    },
  },
});

export const { setCredentials, logout, setBootstrapped } = authSlice.actions;
export const authReducer = authSlice.reducer;

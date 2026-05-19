import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse } from "@/types/api";
import type { AuthResponse, LoginPayload, SignupPayload, User } from "@/types/auth";

export const authService = {
  async signup(payload: SignupPayload) {
    const { data } = await apiClient.post<{ success: true; message: string }>(
      API_ENDPOINTS.auth.signup,
      payload,
    );
    return data;
  },

  async login(payload: LoginPayload) {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.auth.login,
      payload,
    );
    return data.data;
  },

  async me() {
    const { data } = await apiClient.get<ApiResponse<{ user: User }>>(API_ENDPOINTS.auth.me, {
      headers: { "x-silent-error": "true" },
    });
    return data.data.user;
  },

  async sendOtp(email: string) {
    const { data } = await apiClient.post<{ success: true; message: string }>(
      API_ENDPOINTS.auth.sendOtp,
      { email },
    );
    return data;
  },

  async verifyOtp(email: string, otp: string) {
    const { data } = await apiClient.post<{ success: true; message: string }>(
      API_ENDPOINTS.auth.verifyOtp,
      { email, otp },
    );
    return data;
  },
};

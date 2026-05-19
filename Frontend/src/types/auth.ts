export type PreferredLanguage = "en" | "hi";

export interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  preferredLanguage: PreferredLanguage;
}

export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  bootstrapped: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload extends LoginPayload {
  name: string;
  preferredLanguage: PreferredLanguage;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const API_ENDPOINTS = {
  auth: {
    signup: "/auth/signup",
    login: "/auth/login",
    me: "/auth/me",
    sendOtp: "/auth/send-otp",
    verifyOtp: "/auth/verify-otp",
  },
  reports: {
    upload: "/reports/upload",
    history: "/reports",
    detail: (reportId: string) => `/reports/${reportId}`,
  },
  ocr: {
    extract: (reportId: string) => `/ocr/extract/${reportId}`,
  },
  ai: {
    analyze: (reportId: string) => `/ai/analyze/${reportId}`,
  },
} as const;

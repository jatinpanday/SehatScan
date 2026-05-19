export const ROUTES = {
  landing: "/",
  login: "/login",
  signup: "/signup",
  verifyOtp: "/verify-otp",
  dashboard: "/dashboard",
  uploadReport: "/reports/upload",
  reportHistory: "/reports/history",
  analysis: "/analysis/:reportId",
} as const;

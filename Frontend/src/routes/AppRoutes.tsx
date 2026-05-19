import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthLayout } from "@/layouts/AuthLayout";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { PublicRoute } from "@/routes/PublicRoute";
import { ROUTES } from "@/constants/routes";

const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const LandingPage = lazy(() => import("@/pages/landing"));
const SignupPage = lazy(() => import("@/pages/auth/SignupPage"));
const OtpVerificationPage = lazy(() => import("@/pages/auth/OtpVerificationPage"));
const DashboardPage = lazy(() => import("@/pages/dashboard/DashboardPage"));
const UploadReportPage = lazy(() => import("@/pages/reports/UploadReportPage"));
const ReportHistoryPage = lazy(() => import("@/pages/reports/ReportHistoryPage"));
const ReportAnalysisPage = lazy(() => import("@/pages/analysis/ReportAnalysisPage"));

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.login} element={<LoginPage />} />
          <Route path={ROUTES.signup} element={<SignupPage />} />
          <Route path={ROUTES.verifyOtp} element={<OtpVerificationPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path={ROUTES.dashboard} element={<DashboardPage />} />
          <Route path={ROUTES.uploadReport} element={<UploadReportPage />} />
          <Route path={ROUTES.reportHistory} element={<ReportHistoryPage />} />
          <Route path={ROUTES.analysis} element={<ReportAnalysisPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.dashboard} replace />} />
    </Routes>
  );
}

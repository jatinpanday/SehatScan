import { Navigate, Outlet, useLocation } from "react-router-dom";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ROUTES } from "@/constants/routes";
import { useAuthBootstrap } from "@/hooks/useAuthBootstrap";
import { useAppSelector } from "@/store/hooks";

export function ProtectedRoute() {
  useAuthBootstrap();
  const location = useLocation();
  const { isAuthenticated, bootstrapped } = useAppSelector((state) => state.auth);

  if (!bootstrapped) {
    return <LoadingSpinner fullPage />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />;
  }

  return <Outlet />;
}

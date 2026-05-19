import { Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AppRoutes } from "@/routes/AppRoutes";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { useAppSelector } from "@/store/hooks";

export default function App() {
  const { i18n } = useTranslation();
  const language = useAppSelector((state) => state.language.currentLanguage);
  const theme = useAppSelector((state) => state.theme.mode);

  useEffect(() => {
    void i18n.changeLanguage(language);
    document.documentElement.lang = language;
  }, [i18n, language]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner fullPage />}>
        <AppRoutes />
      </Suspense>
    </ErrorBoundary>
  );
}

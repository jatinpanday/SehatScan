import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Activity } from "lucide-react";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { ThemeToggle } from "@/components/common/ThemeToggle";

export function AuthLayout() {
  const { t } = useTranslation();

  return (
    <main className="grid min-h-screen lg:grid-cols-[1fr_520px]">
      <section className="hidden bg-secondary p-10 text-secondary-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-primary p-2 text-primary-foreground">
            <Activity className="h-5 w-5" />
          </div>
          <span className="font-semibold">{t("appName")}</span>
        </div>
        <div className="max-w-xl">
          <p className="text-4xl font-semibold leading-tight tracking-normal">{t("auth.welcome")}</p>
          <p className="mt-5 text-sm leading-6 text-secondary-foreground/75">
            Secure uploads, multilingual analysis, and a calm dashboard for patients and care teams.
          </p>
        </div>
      </section>
      <section className="flex min-h-screen flex-col">
        <div className="flex justify-end gap-2 p-4">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center px-4 py-10">
          <Outlet />
        </div>
      </section>
    </main>
  );
}

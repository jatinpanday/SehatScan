import { Activity, FileClock, LayoutDashboard, Upload } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ROUTES } from "@/constants/routes";
import { queryKeys } from "@/constants/queryKeys";
import { reportService } from "@/services/report.service";
import { useAppSelector } from "@/store/hooks";
import { cn } from "@/utils/cn";
import type { NavigationItem } from "@/types/navigation";

const items: NavigationItem[] = [
  { labelKey: "nav.dashboard", href: ROUTES.dashboard, icon: LayoutDashboard },
  { labelKey: "nav.upload", href: ROUTES.uploadReport, icon: Upload },
  { labelKey: "nav.history", href: ROUTES.reportHistory, icon: FileClock },
];

export function Sidebar() {
  const { t } = useTranslation();
  const userId = useAppSelector((state) => state.user.profile?.id);
  const reports = useQuery({
    queryKey: userId ? queryKeys.reports.list(userId) : queryKeys.reports.all,
    queryFn: reportService.getReports,
    enabled: Boolean(userId),
  });
  const recentReports = reports.data?.slice(0, 5) ?? [];

  return (
    <aside className="hidden w-72 shrink-0 border-r bg-card lg:block">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="rounded-md bg-primary p-2 text-primary-foreground">
          <Activity className="h-5 w-5" />
        </div>
        <span className="font-semibold">{t("appName")}</span>
      </div>
      <nav className="space-y-1 p-4">
        {items.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground",
                isActive && "bg-primary/10 text-primary",
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {t(item.labelKey)}
          </NavLink>
        ))}
      </nav>
      {recentReports.length ? (
        <div className="border-t p-4">
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Recent reports
          </p>
          <div className="space-y-1">
            {recentReports.map((report) => (
              <NavLink
                key={report.id}
                to={`/analysis/${report.id}`}
                className={({ isActive }) =>
                  cn(
                    "block truncate rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground",
                    isActive && "bg-primary/10 text-primary",
                  )
                }
                title={report.originalFileName}
              >
                {report.originalFileName}
              </NavLink>
            ))}
          </div>
        </div>
      ) : null}
    </aside>
  );
}

import { Activity, LogOut, Menu } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { queryClient } from "@/api/queryClient";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { ROUTES } from "@/constants/routes";
import { logout } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser } from "@/store/userSlice";

export function Navbar() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user.profile);

  const handleLogout = () => {
    queryClient.clear();
    dispatch(logout());
    dispatch(setUser(null));
    navigate(ROUTES.landing, { replace: true });
  };

  return (
    <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
        <Link to={ROUTES.dashboard} className="flex items-center gap-2 lg:hidden">
          <Activity className="h-5 w-5 text-primary" />
          <span className="font-semibold">{t("appName")}</span>
        </Link>
        <div className="hidden items-center gap-2 md:flex lg:hidden">
          <NavLink className="text-sm text-muted-foreground hover:text-foreground" to={ROUTES.dashboard}>
            {t("nav.dashboard")}
          </NavLink>
          <NavLink className="text-sm text-muted-foreground hover:text-foreground" to={ROUTES.uploadReport}>
            {t("nav.upload")}
          </NavLink>
        </div>
        <Button className="lg:hidden" variant="ghost" size="icon" aria-label="Open navigation">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium">{user?.name ?? "User"}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <Button variant="outline" size="icon" onClick={handleLogout} aria-label={t("auth.logout")}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}

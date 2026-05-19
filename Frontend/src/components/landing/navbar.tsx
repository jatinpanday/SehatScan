import { useState } from "react";
import { Link } from "react-router-dom";
import { Activity, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { navItems } from "@/components/landing/landing-data";
import { cn } from "@/utils/cn";

export function LandingNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80">
      <div className="container flex h-16 items-center justify-between">
        <a href="#" className="flex items-center gap-2 font-semibold text-slate-950 dark:text-white">
          <span className="rounded-md bg-primary p-2 text-primary-foreground shadow-sm">
            <Activity className="h-5 w-5" />
          </span>
          SehatScan
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition hover:text-primary dark:text-slate-300"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button asChild variant="ghost">
            <Link to={ROUTES.login}>Login</Link>
          </Button>
          <Button asChild>
            <Link to={ROUTES.signup}>Create Free Account</Link>
          </Button>
        </div>

        <Button
          className="md:hidden"
          variant="outline"
          size="icon"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <motion.div
        initial={false}
        animate={open ? "open" : "closed"}
        variants={{
          open: { height: "auto", opacity: 1 },
          closed: { height: 0, opacity: 0 },
        }}
        className={cn("overflow-hidden border-t bg-white md:hidden dark:bg-slate-950", !open && "border-transparent")}
      >
        <div className="container space-y-3 py-4">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block rounded-md px-2 py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <div className="grid gap-2 pt-2">
            <Button asChild variant="outline">
              <Link to={ROUTES.login}>Login</Link>
            </Button>
            <Button asChild>
              <Link to={ROUTES.signup}>Create Free Account</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </header>
  );
}

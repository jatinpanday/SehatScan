import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleTheme } from "@/store/themeSlice";

export function ThemeToggle() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);

  return (
    <Button variant="outline" size="icon" onClick={() => dispatch(toggleTheme())} aria-label="Toggle theme">
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}

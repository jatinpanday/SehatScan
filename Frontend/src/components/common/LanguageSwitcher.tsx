import { Languages } from "lucide-react";
import { Select } from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setLanguage } from "@/store/languageSlice";
import type { PreferredLanguage } from "@/types/auth";

export function LanguageSwitcher() {
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.language.currentLanguage);

  return (
    <label className="flex items-center gap-2 text-sm text-muted-foreground">
      <Languages className="h-4 w-4" />
      <Select
        aria-label="Language"
        className="h-9 w-[118px]"
        value={language}
        onChange={(event) => dispatch(setLanguage(event.target.value as PreferredLanguage))}
      >
        <option value="en">English</option>
        <option value="hi">हिन्दी</option>
      </Select>
    </label>
  );
}

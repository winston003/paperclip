import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Languages } from "lucide-react";

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();

  const languages = [
    { code: "en", label: t("language.en") },
    { code: "zh", label: t("language.zh") },
  ];

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  return (
    <div className="flex items-center gap-2 px-3 py-2">
      <Languages className="h-4 w-4 text-muted-foreground shrink-0" />
      <Select value={i18n.language} onValueChange={handleLanguageChange}>
        <SelectTrigger className="h-8 text-xs">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent align="start">
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

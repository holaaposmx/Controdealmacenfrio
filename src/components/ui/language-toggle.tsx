import React from "react";
import { Button } from "./button";
import { Globe } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface LanguageToggleProps {
  variant?: "icon" | "button";
}

export function LanguageToggle({ variant = "icon" }: LanguageToggleProps) {
  const { language, changeLanguage, t } = useI18n();

  const toggleLanguage = () => {
    changeLanguage(language === "en" ? "es" : "en");
  };

  if (variant === "button") {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant={language === "en" ? "default" : "outline"}
          size="sm"
          onClick={() => changeLanguage("en")}
          className="w-24"
        >
          {t("language.english")}
        </Button>
        <Button
          variant={language === "es" ? "default" : "outline"}
          size="sm"
          onClick={() => changeLanguage("es")}
          className="w-24"
        >
          {t("language.spanish")}
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      title={t("language.change")}
    >
      <Globe className="h-5 w-5 text-gray-600" />
      <span className="sr-only">{t("language.change")}</span>
    </Button>
  );
}

import React from "react";
import { Button } from "./button";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { useI18n } from "@/lib/i18n";

interface LanguageToggleProps {
  variant?: "icon" | "button";
}

export function LanguageToggle({ variant = "icon" }: LanguageToggleProps) {
  const { language, changeLanguage, t } = useI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {variant === "icon" ? (
          <Button variant="ghost" size="icon" className="relative">
            <Globe className="h-5 w-5 text-gray-600" />
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Globe className="h-4 w-4" />
            <span>{language === "es" ? "ES" : "EN"}</span>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => changeLanguage("es")}
          className={language === "es" ? "bg-muted" : ""}
        >
          🇪🇸 {t("language.spanish")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => changeLanguage("en")}
          className={language === "en" ? "bg-muted" : ""}
        >
          🇬🇧 {t("language.english")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Locale, LOCALE_COOKIE } from "./config";

export * from "./config";
export * from "./dictionaries";

export function useLanguage(): { lang: Locale } {
  const [lang, setLang] = useState<Locale>("en");

  useEffect(() => {
    if (typeof document !== "undefined") {
      const match = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]*)`));
      if (match && (match[1] === "bn" || match[1] === "en")) {
        setLang(match[1] as Locale);
      }
    }
  }, []);

  return { lang };
}

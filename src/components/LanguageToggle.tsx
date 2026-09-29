"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LOCALE_COOKIE, NUMERAL_COOKIE, type Locale } from "@/lib/i18n/config";

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=31536000; samesite=lax`;
}

export function LanguageToggle({ locale, bnNumerals }: { locale: Locale; bnNumerals: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const change = (next: Locale) => {
    if (next === locale) return;
    setCookie(LOCALE_COOKIE, next);
    if (next === "bn") setCookie(NUMERAL_COOKIE, bnNumerals ? "bn" : "en");
    startTransition(() => router.refresh());
  };

  const toggleNumerals = () => {
    setCookie(NUMERAL_COOKIE, bnNumerals ? "en" : "bn");
    startTransition(() => router.refresh());
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex items-center rounded-full bg-ink-100 p-0.5 text-[12px] font-semibold ${pending ? "opacity-60" : ""}`}
        role="group"
        aria-label="Language"
      >
        <button
          onClick={() => change("en")}
          className={`rounded-full px-2.5 py-1 transition-colors ${
            locale === "en" ? "bg-white text-ink-900 shadow-sm" : "text-ink-500 hover:text-ink-800"
          }`}
          aria-pressed={locale === "en"}
        >
          EN
        </button>
        <button
          onClick={() => change("bn")}
          className={`rounded-full px-2.5 py-1 transition-colors ${
            locale === "bn" ? "bg-white text-ink-900 shadow-sm" : "text-ink-500 hover:text-ink-800"
          }`}
          aria-pressed={locale === "bn"}
        >
          বাংলা
        </button>
      </div>
      {locale === "bn" && (
        <button
          onClick={toggleNumerals}
          title="Bengali numerals"
          className={`rounded-full px-2 py-1 text-[12px] font-semibold ring-1 ring-inset transition-colors ${
            bnNumerals
              ? "bg-brand-600 text-white ring-brand-600"
              : "bg-white text-ink-500 ring-ink-200 hover:text-ink-800"
          }`}
          aria-pressed={bnNumerals}
        >
          ১২৩
        </button>
      )}
    </div>
  );
}

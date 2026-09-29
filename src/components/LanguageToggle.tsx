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
    <div className="flex items-center gap-1.5">
      <div
        className={`flex items-center rounded-full border border-slate-200/80 bg-slate-100/70 p-0.5 text-[11.5px] font-bold ${
          pending ? "opacity-60" : ""
        }`}
        role="group"
        aria-label="Language selection"
      >
        <button
          onClick={() => change("en")}
          className={`rounded-full px-2.5 py-1 transition-all duration-150 ${
            locale === "en"
              ? "bg-white text-slate-900 shadow-2xs font-bold"
              : "text-slate-500 hover:text-slate-900"
          }`}
          aria-pressed={locale === "en"}
        >
          EN
        </button>
        <button
          onClick={() => change("bn")}
          className={`rounded-full px-2.5 py-1 transition-all duration-150 ${
            locale === "bn"
              ? "bg-white text-emerald-800 shadow-2xs font-bold"
              : "text-slate-500 hover:text-slate-900"
          }`}
          aria-pressed={locale === "bn"}
        >
          বাংলা
        </button>
      </div>
      {locale === "bn" && (
        <button
          onClick={toggleNumerals}
          title="বাংলা সংখ্যা টগল করুন"
          className={`rounded-full px-2 py-1 text-[11px] font-bold ring-1 ring-inset transition-colors ${
            bnNumerals
              ? "bg-emerald-600 text-white ring-emerald-600 shadow-2xs"
              : "bg-white text-slate-600 ring-slate-200 hover:text-slate-900"
          }`}
          aria-pressed={bnNumerals}
        >
          ১২৩
        </button>
      )}
    </div>
  );
}

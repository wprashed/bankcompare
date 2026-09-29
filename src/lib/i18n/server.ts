import { cookies } from "next/headers";
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, NUMERAL_COOKIE, type Locale } from "./config";
import { getDictionary, type Dictionary } from "./dictionaries";

/**
 * Locale is stored in a cookie so every page stays fully server-rendered
 * (good for SEO) while the EN/BN toggle still works instantly.
 */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export async function getBnNumerals(): Promise<boolean> {
  const store = await cookies();
  return store.get(NUMERAL_COOKIE)?.value === "bn";
}

export type I18n = {
  locale: Locale;
  t: Dictionary;
  bnNumerals: boolean;
  /** Pick the right language field from a record ({ name, nameBn }) */
  pick: <T extends Record<string, unknown>>(obj: T, key: string) => string;
};

export async function getI18n(): Promise<I18n> {
  const locale = await getLocale();
  const bnNumerals = locale === "bn" ? await getBnNumerals() : false;
  return {
    locale,
    t: getDictionary(locale),
    bnNumerals,
    pick: (obj, key) => {
      const bnKey = `${key}Bn`;
      if (locale === "bn" && typeof obj[bnKey] === "string" && obj[bnKey]) return obj[bnKey] as string;
      return (obj[key] as string) ?? "";
    },
  };
}

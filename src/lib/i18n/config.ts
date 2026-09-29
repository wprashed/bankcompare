export const LOCALES = ["en", "bn"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "bcbd_locale";
/** When true, Bengali UI also renders numerals as ০১২৩৪৫৬৭৮৯ */
export const NUMERAL_COOKIE = "bcbd_numerals";

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

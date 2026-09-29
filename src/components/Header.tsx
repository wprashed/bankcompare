"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown, Calculator, PiggyBank, Landmark, LineChart, CreditCard, Banknote } from "lucide-react";
import { LanguageToggle } from "./LanguageToggle";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function Header({
  locale,
  bnNumerals,
  t,
}: {
  locale: Locale;
  bnNumerals: boolean;
  t: Pick<Dictionary, "nav" | "brand">;
}) {
  const [open, setOpen] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
    setCalcOpen(false);
  }, [pathname]);

  const links = [
    { href: "/savings", label: t.nav.savings, icon: PiggyBank },
    { href: "/fdr", label: t.nav.fdr, icon: LineChart },
    { href: "/cards", label: t.nav.cards, icon: CreditCard },
    { href: "/loans", label: t.nav.loans, icon: Banknote },
    { href: "/banks", label: t.nav.banks, icon: Landmark },
  ];
  const calcLinks = [
    { href: "/calculators/fdr", label: t.nav.fdrCalculator },
    { href: "/calculators/emi", label: t.nav.emiCalculator },
    { href: "/calculators/credit-card", label: t.nav.creditCalculator },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="no-print sticky top-0 z-50 border-b border-ink-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label={t.brand.name}>
          <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-brand-600">
            <span className="h-3.5 w-3.5 rounded-full bg-flag-500" />
          </span>
          <span className="text-[17px] font-extrabold tracking-tight text-ink-900">
            {t.brand.name}
            <span className="text-brand-600">{t.brand.suffix}</span>
          </span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
                isActive(l.href) ? "bg-brand-50 text-brand-700" : "text-ink-600 hover:bg-ink-50 hover:text-ink-900"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <div className="relative" onMouseLeave={() => setCalcOpen(false)}>
            <button
              onClick={() => setCalcOpen((v) => !v)}
              onMouseEnter={() => setCalcOpen(true)}
              className={`flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
                isActive("/calculators") ? "bg-brand-50 text-brand-700" : "text-ink-600 hover:bg-ink-50 hover:text-ink-900"
              }`}
              aria-expanded={calcOpen}
            >
              {t.nav.calculators}
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${calcOpen ? "rotate-180" : ""}`} />
            </button>
            {calcOpen && (
              <div className="absolute left-0 top-full w-60 pt-2">
                <div className="card overflow-hidden p-1.5 shadow-lg">
                  {calcLinks.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-brand-50 hover:text-brand-700"
                    >
                      <Calculator className="h-4 w-4 text-brand-600" />
                      {c.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <LanguageToggle locale={locale} bnNumerals={bnNumerals} />
          <Link
            href="/fdr"
            className="hidden rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 sm:inline-flex"
          >
            {t.nav.compare}
          </Link>
          <button
            className="grid h-9 w-9 place-items-center rounded-lg text-ink-700 hover:bg-ink-100 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={t.nav.menu}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-ink-200 bg-white md:hidden">
          <nav className="mx-auto grid max-w-6xl gap-1 px-4 py-3 sm:px-6">
            {[...links, ...calcLinks.map((c) => ({ ...c, icon: Calculator }))].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-semibold ${
                  isActive(l.href) ? "bg-brand-50 text-brand-700" : "text-ink-700 hover:bg-ink-50"
                }`}
              >
                <l.icon className="h-4.5 w-4.5 text-brand-600" />
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

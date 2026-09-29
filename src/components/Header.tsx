"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Menu,
  X,
  ChevronDown,
  PiggyBank,
  Landmark,
  LineChart,
  CreditCard,
  Banknote,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Hash,
  Layers,
} from "lucide-react";
import { LanguageToggle } from "./LanguageToggle";
import { Logo } from "./Logo";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

interface DropdownItem {
  href: string;
  label: string;
  desc: string;
  icon: React.ElementType;
  badge?: string;
}

function NavDropdown({
  label,
  items,
  isActive,
}: {
  label: string;
  items: DropdownItem[];
  isActive: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref} onMouseLeave={() => setOpen(false)}>
      <button
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-[13px] transition-all duration-200 whitespace-nowrap ${
          isActive
            ? "font-bold text-emerald-800 bg-emerald-500/10 ring-1 ring-emerald-600/20"
            : "font-medium text-slate-600 hover:text-slate-950 hover:bg-slate-100/70"
        }`}
        aria-expanded={open}
      >
        <span>{label}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
            open ? "rotate-180 text-emerald-600" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full w-72 pt-2 animate-in fade-in zoom-in-95 duration-150 z-50">
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/98 p-2 shadow-2xl backdrop-blur-xl">
            <div className="mt-1 space-y-0.5">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-emerald-50/70"
                  onClick={() => setOpen(false)}
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-100/80 text-emerald-700 transition-transform group-hover:scale-105">
                    <item.icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-[13px] font-bold text-slate-800 group-hover:text-emerald-800">
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="inline-flex items-center rounded bg-emerald-500/20 px-1 py-0.5 text-[9px] font-black text-emerald-800 uppercase leading-none">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="line-clamp-1 text-[11px] text-slate-400">{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isBn = locale === "bn";

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const isActiveAny = (hrefs: string[]) => hrefs.some((h) => isActive(h));

  // ── Grouped dropdown: Deposits ──────────────────────────────────────────────
  const depositItems: DropdownItem[] = [
    {
      href: "/savings",
      label: t.nav.savings,
      desc: isBn ? "সেরা সুদ হারের সঞ্চয়ী হিসাব" : "Top interest savings accounts",
      icon: PiggyBank,
    },
    {
      href: "/fdr",
      label: t.nav.fdr,
      desc: isBn ? "মেয়াদী আমানতে সর্বোচ্চ মুনাফা" : "Best fixed deposit rates",
      icon: LineChart,
    },
  ];

  // ── Grouped dropdown: Tools ─────────────────────────────────────────────────
  const toolItems: DropdownItem[] = [
    {
      href: "/calculators/fdr",
      label: t.nav.fdrCalculator,
      desc: isBn ? "উৎসে কর বাদে সঠিক মুনাফা" : "Post-tax term deposit returns",
      icon: LineChart,
    },
    {
      href: "/calculators/dps",
      label: isBn ? "ডিপিএস ক্যালকুলেটর" : "DPS Calculator",
      desc: isBn ? "মাসিক জমার পর ম্যাচিউরিটি হিসাব" : "Monthly deposit payout estimator",
      icon: PiggyBank,
    },
    {
      href: "/calculators/emi",
      label: t.nav.emiCalculator,
      desc: isBn ? "ক্রমহ্রাসমান ব্যালেন্সে ঋণ কিস্তি" : "Reducing-balance loan amortisation",
      icon: TrendingUp,
    },
    {
      href: "/calculators/credit-card",
      label: t.nav.creditCalculator,
      desc: isBn ? "স্মার্ট ঋণ পরিশোধ হিসাব" : "Payoff timeline & minimum fees",
      icon: CreditCard,
    },
    {
      href: "/cards/matcher",
      label: isBn ? "কার্ড ম্যাচ কুইজ" : "Card Matcher Quiz",
      desc: isBn ? "আপনার উপযুক্ত কার্ড খুঁজুন" : "Find best card in 60 seconds",
      icon: Sparkles,
      badge: "NEW",
    },
    {
      href: "/routing-numbers",
      label: isBn ? "রাউটিং নম্বর" : "Routing Numbers",
      desc: isBn ? "সব শাখা ও সুইফট কোড" : "Find 9-digit EFT & BEFTN routing",
      icon: Hash,
    },
  ];

  // ── Direct nav links (no dropdown) ─────────────────────────────────────────
  const directLinks = [
    { href: "/cards", label: t.nav.cards, icon: CreditCard },
    {
      href: "/deals",
      label: isBn ? "ডিলস ও অফার" : "Deals & Offers",
      icon: Sparkles,
      badge: "B1G1",
    },
    { href: "/loans", label: t.nav.loans, icon: Banknote },
    { href: "/banks", label: t.nav.banks, icon: Landmark },
  ];

  return (
    <header className="no-print sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        {/* Logo — compact, no tagline shown in header */}
        <Logo size="sm" showTagline={false} />

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-0.5 xl:flex">
          {/* Deposits dropdown */}
          <NavDropdown
            label={isBn ? "আমানত ও সঞ্চয়" : "Deposits"}
            items={depositItems}
            isActive={isActiveAny(["/savings", "/fdr"])}
          />

          {/* Direct links */}
          {directLinks.map((l) => {
            const active = isActive(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] transition-all duration-200 whitespace-nowrap ${
                  active
                    ? "font-bold text-emerald-800 bg-emerald-500/10 ring-1 ring-emerald-600/20 shadow-2xs"
                    : "font-medium text-slate-600 hover:text-slate-950 hover:bg-slate-100/70"
                }`}
              >
                <span>{l.label}</span>
                {l.badge && (
                  <span className="inline-flex items-center rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[9.5px] font-black text-amber-800 uppercase tracking-wider leading-none">
                    {l.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Tools & Calculators dropdown */}
          <NavDropdown
            label={isBn ? "টুলস ও ক্যালকুলেটর" : "Tools"}
            items={toolItems}
            isActive={isActiveAny([
              "/calculators",
              "/cards/matcher",
              "/routing-numbers",
            ])}
          />
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <LanguageToggle locale={locale} bnNumerals={bnNumerals} />

          <Link
            href="/fdr"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 px-4 py-1.5 text-[12.5px] font-bold text-white shadow-sm shadow-emerald-600/30 transition-all hover:shadow-md hover:shadow-emerald-600/40 active:scale-95 whitespace-nowrap"
          >
            <span>{t.nav.compare}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          {/* Mobile Menu Trigger */}
          <button
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200/80 text-slate-700 hover:bg-slate-100 xl:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={t.nav.menu}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="border-t border-slate-200/80 bg-white/98 px-4 py-4 backdrop-blur-xl xl:hidden">
          <nav className="mx-auto grid max-w-6xl gap-1">
            {/* Deposits group */}
            <div className="mb-1">
              <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {isBn ? "আমানত ও সঞ্চয়" : "Deposits & Savings"}
              </span>
              <div className="mt-1 space-y-0.5">
                {depositItems.map((l) => {
                  const active = isActive(l.href);
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-semibold transition-colors ${
                        active ? "bg-emerald-50 text-emerald-800 font-bold" : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <l.icon className="h-4 w-4 text-emerald-600" />
                      <span>{l.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Direct links */}
            <div className="mb-1">
              <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {isBn ? "পণ্য ও সেবা" : "Products"}
              </span>
              <div className="mt-1 space-y-0.5">
                {directLinks.map((l) => {
                  const active = isActive(l.href);
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[14px] font-semibold transition-colors ${
                        active ? "bg-emerald-50 text-emerald-800 font-bold" : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <l.icon className="h-4 w-4 text-emerald-600" />
                        <span>{l.label}</span>
                      </span>
                      {l.badge && (
                        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 uppercase">
                          {l.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Tools & Calculators */}
            <div className="mb-2 border-t border-slate-100 pt-3">
              <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {isBn ? "ক্যালকুলেটর ও টুলস" : "Tools & Calculators"}
              </span>
              <div className="mt-1 grid grid-cols-2 gap-1.5">
                {toolItems.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 text-[12.5px] font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
                  >
                    <c.icon className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{c.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/fdr"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white shadow-sm"
              >
                <span>{t.nav.compare}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

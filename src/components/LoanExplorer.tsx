"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Banknote,
  Calculator,
  Check,
  ExternalLink,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { BankLogo } from "./BankLogo";
import { Badge, Button } from "./ui";
import type { LoanRow } from "@/lib/queries";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { calcEMI, formatBDT, formatBDTCompact, formatNumber, formatPercent } from "@/lib/format";

type Props = {
  rows: LoanRow[];
  t: Dictionary;
  locale: Locale;
  bnNumerals: boolean;
};

type SortKey = "rate_asc" | "amount_desc" | "popular";

const LOAN_TYPES = ["PERSONAL", "HOME", "AUTO"];

export function LoanExplorer({ rows, t, locale, bnNumerals }: Props) {
  const [q, setQ] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedBanks, setSelectedBanks] = useState<string[]>([]);
  const [shariahOnly, setShariahOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("rate_asc");

  // Interactive Live EMI Simulation state
  const [simAmount, setSimAmount] = useState<number>(500000);
  const [simMonths, setSimMonths] = useState<number>(36);

  const nf = { bnNumerals };
  const name = (r: LoanRow) => (locale === "bn" ? r.nameBn : r.name);
  const bankName = (r: LoanRow) => (locale === "bn" ? r.bank.nameBn : r.bank.shortName);
  const features = (r: LoanRow) => (locale === "bn" ? r.featuresBn : r.features);

  const bankOptions = useMemo(() => {
    const map = new Map<string, { slug: string; label: string; color: string; initials: string }>();
    rows.forEach((r) =>
      map.set(r.bank.slug, {
        slug: r.bank.slug,
        label: locale === "bn" ? r.bank.nameBn : r.bank.shortName,
        color: r.bank.brandColor,
        initials: r.bank.logoInitials,
      })
    );
    return [...map.values()].sort((a, b) => a.label.localeCompare(b.label));
  }, [rows, locale]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const out = rows.filter((r) => {
      if (needle) {
        const hay = `${r.name} ${r.nameBn} ${r.bank.name} ${r.bank.nameBn} ${r.bank.shortName}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      if (selectedType && r.loanType !== selectedType) return false;
      if (selectedBanks.length && !selectedBanks.includes(r.bank.slug)) return false;
      if (shariahOnly && !r.isShariah) return false;
      return true;
    });

    switch (sort) {
      case "rate_asc":
        out.sort((a, b) => a.interestRateMin - b.interestRateMin);
        break;
      case "amount_desc":
        out.sort((a, b) => b.maxAmount - a.maxAmount);
        break;
      case "popular":
      default:
        out.sort((a, b) => b.popularity - a.popularity);
    }
    return out;
  }, [rows, q, selectedType, selectedBanks, shariahOnly, sort]);

  return (
    <div className="space-y-8">
      {/* ---------------- Interactive EMI Simulator Bar ---------------- */}
      <div className="card rounded-2xl border-2 border-brand-200/80 bg-gradient-to-r from-brand-50/70 via-white to-brand-50/40 p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-600 text-white">
                <Calculator className="h-4 w-4" />
              </span>
              <h2 className="text-[17px] font-extrabold text-ink-900">
                {locale === "bn" ? "লাইভ ঋণ কিস্তি সিমুলেটর" : "Live Loan EMI Simulator"}
              </h2>
            </div>
            <p className="mt-1 text-[13px] text-ink-500">
              {locale === "bn"
                ? "ঋণের পরিমাণ ও মেয়াদ পরিবর্তন করুন; নিচের সকল ঋণের মাসিক কিস্তি স্বয়ংক্রিয়ভাবে হিসাব হবে।"
                : "Adjust loan amount and tenure below to see real-time estimated monthly EMIs across all banks."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/calculators/emi"
              className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-white px-3.5 py-1.5 text-[12.5px] font-bold text-brand-700 shadow-xs hover:bg-brand-50"
            >
              {t.nav.emiCalculator}
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-ink-600">{t.loans.loanAmount}</span>
              <span className="text-[16px] font-extrabold tabular text-brand-700">{formatBDT(simAmount, nf)}</span>
            </div>
            <input
              type="range"
              min={100000}
              max={3000000}
              step={50000}
              value={simAmount}
              onChange={(e) => setSimAmount(Number(e.target.value))}
              className="mt-2 w-full accent-brand-600"
            />
            <div className="mt-1 flex justify-between text-[11px] text-ink-400">
              <span>{formatBDTCompact(100000, { locale, bnNumerals })}</span>
              <span>{formatBDTCompact(1500000, { locale, bnNumerals })}</span>
              <span>{formatBDTCompact(3000000, { locale, bnNumerals })}</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-ink-600">{t.loans.tenure}</span>
              <span className="text-[16px] font-extrabold tabular text-brand-700">
                {locale === "bn"
                  ? `${formatNumber(Math.round(simMonths / 12), nf)} বছর (${formatNumber(simMonths, nf)} মাস)`
                  : `${Math.round(simMonths / 12)} Years (${simMonths} months)`}
              </span>
            </div>
            <input
              type="range"
              min={12}
              max={84}
              step={12}
              value={simMonths}
              onChange={(e) => setSimMonths(Number(e.target.value))}
              className="mt-2 w-full accent-brand-600"
            />
            <div className="mt-1 flex justify-between text-[11px] text-ink-400">
              <span>{locale === "bn" ? "১ বছর" : "1 Year"}</span>
              <span>{locale === "bn" ? "৩ বছর" : "3 Years"}</span>
              <span>{locale === "bn" ? "৫ বছর" : "5 Years"}</span>
              <span>{locale === "bn" ? "৭ বছর" : "7 Years"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- Filters & Search Bar ---------------- */}
      <div className="card p-5">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={locale === "bn" ? "ঋণ পণ্য বা ব্যাংকের নাম দিয়ে খুঁজুন…" : "Search by loan product or bank…"}
              className="input pl-10"
            />
            {q && (
              <button
                onClick={() => setQ("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Loan Type Tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedType("")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                selectedType === ""
                  ? "bg-brand-600 text-white shadow-xs"
                  : "bg-ink-100 text-ink-600 hover:bg-ink-200"
              }`}
            >
              {t.common.viewAll}
            </button>
            {LOAN_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType((prev) => (prev === type ? "" : type))}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  selectedType === type
                    ? "bg-brand-600 text-white shadow-xs"
                    : "bg-ink-100 text-ink-600 hover:bg-ink-200"
                }`}
              >
                {t.loans.types[type] ?? type}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-ink-700">
              <input
                type="checkbox"
                checked={shariahOnly}
                onChange={(e) => setShariahOnly(e.target.checked)}
                className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
              />
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                {t.loans.filterShariah}
              </span>
            </label>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-ink-500">{t.common.sortBy}:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="input py-1.5 text-sm font-semibold"
              >
                <option value="rate_asc">{t.loans.sortRateAsc}</option>
                <option value="amount_desc">{t.loans.sortAmountDesc}</option>
                <option value="popular">{t.loans.sortPopular}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bank checklist pills */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-ink-100 pt-3">
          <span className="mr-2 text-[12px] font-bold text-ink-500">{t.loans.filterBank}:</span>
          {bankOptions.map((b) => {
            const active = selectedBanks.includes(b.slug);
            return (
              <button
                key={b.slug}
                onClick={() =>
                  setSelectedBanks((prev) =>
                    active ? prev.filter((x) => x !== b.slug) : [...prev, b.slug]
                  )
                }
                className={`rounded-md px-2.5 py-1 text-[11.5px] font-medium transition-colors ${
                  active ? "bg-brand-600 font-bold text-white" : "bg-ink-100 text-ink-700 hover:bg-ink-200"
                }`}
              >
                {b.label}
              </button>
            );
          })}
          {selectedBanks.length > 0 && (
            <button
              onClick={() => setSelectedBanks([])}
              className="ml-2 text-[11.5px] font-semibold text-brand-700 hover:underline"
            >
              {t.common.clear}
            </button>
          )}
        </div>
      </div>

      {/* ---------------- Results Count ---------------- */}
      <div className="text-[13px] text-ink-500">
        <span className="font-bold text-ink-900 tabular">{formatNumber(filtered.length, nf)}</span>{" "}
        {locale === "bn" ? "টি ঋণ পণ্য পাওয়া গেছে" : "loan products found"}
      </div>

      {/* ---------------- Loans Grid ---------------- */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <Banknote className="mx-auto h-12 w-12 text-ink-300" />
          <h3 className="mt-4 text-[17px] font-bold text-ink-900">{t.common.noResults}</h3>
          <p className="mt-1 text-[13.5px] text-ink-500">{t.common.tryAgain}</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((loan) => {
            // Calculate live EMI for this loan's rate
            const applicableAmount = Math.min(Math.max(simAmount, loan.minAmount), loan.maxAmount);
            const { emi } = calcEMI(applicableAmount, loan.interestRateMin, simMonths);

            return (
              <article key={loan.id} className="card card-hover flex flex-col justify-between p-5">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <BankLogo initials={loan.bank.logoInitials} color={loan.bank.brandColor} size={38} />
                      <div>
                        <div className="text-[12.5px] font-bold text-ink-900">{bankName(loan)}</div>
                        <Badge tone="blue" className="mt-0.5 text-[10.5px]">
                          {t.loans.types[loan.loanType] ?? loan.loanType}
                        </Badge>
                      </div>
                    </div>
                    {loan.isShariah && <Badge tone="brand">{locale === "bn" ? "শরিয়াহ" : "Shariah"}</Badge>}
                  </div>

                  <h3 className="mt-3.5 text-[15.5px] font-bold leading-snug text-ink-900">{name(loan)}</h3>

                  {/* Highlight Rate */}
                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span className="text-[26px] font-extrabold tabular text-brand-600">
                      {formatPercent(loan.interestRateMin, nf)}
                    </span>
                    {loan.interestRateMax > loan.interestRateMin && (
                      <span className="text-[14px] font-semibold tabular text-ink-400">
                        – {formatPercent(loan.interestRateMax, nf)}
                      </span>
                    )}
                    <span className="text-[12px] font-medium text-ink-500">{t.common.perYear}</span>
                  </div>

                  {/* Live Simulated EMI Callout */}
                  <div className="mt-4 rounded-xl border border-brand-200/70 bg-brand-50/60 p-3">
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="font-semibold text-brand-900">{t.loans.estimatedEmi}</span>
                      <span className="text-[11px] text-ink-500">
                        {formatBDT(applicableAmount, nf)} / {formatNumber(simMonths, nf)}m
                      </span>
                    </div>
                    <div className="mt-1 text-[20px] font-extrabold tabular text-brand-700">
                      {formatBDT(Math.round(emi), nf)}
                      <span className="text-[12px] font-normal text-ink-500"> / {locale === "bn" ? "মাস" : "mo"}</span>
                    </div>
                  </div>

                  <dl className="mt-4 space-y-1.5 border-t border-ink-100 pt-3 text-[12.5px]">
                    <div className="flex justify-between">
                      <dt className="text-ink-500">{t.loans.loanAmount}</dt>
                      <dd className="font-semibold tabular text-ink-800">
                        {formatBDTCompact(loan.minAmount, { locale, bnNumerals })} –{" "}
                        {formatBDTCompact(loan.maxAmount, { locale, bnNumerals })}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-ink-500">{t.loans.tenure}</dt>
                      <dd className="font-semibold tabular text-ink-800">
                        {formatNumber(loan.minTenureMonths / 12, nf)} – {formatNumber(loan.maxTenureMonths / 12, nf)}{" "}
                        {locale === "bn" ? "বছর" : "Years"}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-ink-500">{t.loans.processingFee}</dt>
                      <dd className="font-semibold tabular text-ink-800">
                        {loan.processingFeePct ? formatPercent(loan.processingFeePct, nf) : "0.5%"}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-ink-500">{t.loans.minIncome}</dt>
                      <dd className="font-semibold tabular text-ink-800">{formatBDT(loan.minIncome, nf)}</dd>
                    </div>
                  </dl>

                  {/* Features */}
                  {features(loan).length > 0 && (
                    <ul className="mt-4 space-y-1 text-[12px] text-ink-600">
                      {features(loan)
                        .slice(0, 2)
                        .map((f, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                            <span className="line-clamp-1">{f}</span>
                          </li>
                        ))}
                    </ul>
                  )}
                </div>

                <div className="mt-5 border-t border-ink-100 pt-3">
                  <Button href={loan.bank.website} external variant="secondary" className="w-full">
                    {t.common.apply}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

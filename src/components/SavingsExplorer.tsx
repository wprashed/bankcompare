"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Check,
  ChevronDown,
  ExternalLink,
  Filter,
  Info,
  Scale,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { BankLogo } from "./BankLogo";
import { Badge } from "./ui";
import type { SavingsRow } from "@/lib/queries";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { formatBDT, formatDate, formatNumber, formatPercent } from "@/lib/format";

type Props = {
  rows: SavingsRow[];
  t: Dictionary;
  locale: Locale;
  bnNumerals: boolean;
  initial: { q?: string; sort?: string; segment?: string; bank?: string; minRate?: string };
};

type SortKey = "rate_desc" | "rate_asc" | "opening_asc" | "fee_asc" | "popular" | "bank_asc";

const SEGMENTS = ["GENERAL", "STUDENT", "WOMEN", "SENIOR", "DIGITAL", "NRB"];
const BANK_TYPES = ["PRIVATE", "ISLAMIC", "STATE_OWNED", "FOREIGN"];

export function SavingsExplorer({ rows, t, locale, bnNumerals, initial }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(initial.q ?? "");
  const [sort, setSort] = useState<SortKey>((initial.sort as SortKey) ?? "rate_desc");
  const [minRate, setMinRate] = useState<number>(Number(initial.minRate ?? 0));
  const [maxOpening, setMaxOpening] = useState<number>(0); // 0 = any
  const [segments, setSegments] = useState<string[]>(initial.segment ? [initial.segment] : []);
  const [bankTypes, setBankTypes] = useState<string[]>([]);
  const [banks, setBanks] = useState<string[]>(initial.bank ? [initial.bank] : []);
  const [feat, setFeat] = useState<string[]>([]);
  const [balance, setBalance] = useState<number>(100000);
  const [compare, setCompare] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [mobileFilters, setMobileFilters] = useState(false);

  const nf = { bnNumerals };
  const name = (r: SavingsRow) => (locale === "bn" ? r.nameBn : r.name);
  const bankName = (r: SavingsRow) => (locale === "bn" ? r.bank.nameBn : r.bank.name);
  const features = (r: SavingsRow) => (locale === "bn" ? r.featuresBn : r.features);

  /* Keep the URL shareable + SSR-friendly (back/forward and refresh keep state) */
  useEffect(() => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (sort !== "rate_desc") p.set("sort", sort);
    if (minRate > 0) p.set("minRate", String(minRate));
    if (segments.length === 1) p.set("segment", segments[0]);
    if (banks.length === 1) p.set("bank", banks[0]);
    const next = p.toString();
    if (next !== searchParams.toString()) {
      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, sort, minRate, segments, banks]);

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
      if (r.interestRateMax < minRate) return false;
      if (maxOpening > 0 && r.minOpeningBalance > maxOpening) return false;
      if (segments.length && !segments.includes(r.segment)) return false;
      if (bankTypes.length && !bankTypes.includes(r.bank.category)) return false;
      if (banks.length && !banks.includes(r.bank.slug)) return false;
      if (feat.includes("shariah") && !r.isShariah) return false;
      if (feat.includes("online") && !r.onlineAccountOpening) return false;
      if (feat.includes("card") && !r.freeDebitCard) return false;
      if (feat.includes("cheque") && !r.freeChequebook) return false;
      if (feat.includes("nofee") && r.maintenanceFee > 0) return false;
      return true;
    });

    const sorters: Record<SortKey, (a: SavingsRow, b: SavingsRow) => number> = {
      rate_desc: (a, b) => b.interestRateMax - a.interestRateMax || b.popularity - a.popularity,
      rate_asc: (a, b) => a.interestRateMax - b.interestRateMax,
      opening_asc: (a, b) => a.minOpeningBalance - b.minOpeningBalance || b.interestRateMax - a.interestRateMax,
      fee_asc: (a, b) => a.maintenanceFee - b.maintenanceFee || b.interestRateMax - a.interestRateMax,
      popular: (a, b) => b.popularity - a.popularity,
      bank_asc: (a, b) => a.bank.name.localeCompare(b.bank.name),
    };
    return [...out].sort(sorters[sort]);
  }, [rows, q, minRate, maxOpening, segments, bankTypes, banks, feat, sort]);

  const bestRate = useMemo(() => Math.max(0, ...filtered.map((r) => r.interestRateMax)), [filtered]);

  const toggle = (list: string[], set: (v: string[]) => void, value: string) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const resetAll = () => {
    setQ("");
    setMinRate(0);
    setMaxOpening(0);
    setSegments([]);
    setBankTypes([]);
    setBanks([]);
    setFeat([]);
    setSort("rate_desc");
  };

  const activeCount =
    (q ? 1 : 0) + (minRate > 0 ? 1 : 0) + (maxOpening > 0 ? 1 : 0) + segments.length + bankTypes.length + banks.length + feat.length;

  const compareRows = rows.filter((r) => compare.includes(r.id));

  const yearlyInterest = (r: SavingsRow) => {
    const effective = balance >= r.minBalanceForInterest ? r.interestRateMax : 0;
    return (balance * effective) / 100 - r.maintenanceFee * 2;
  };

  const FilterPanel = (
    <div className="space-y-7">
      {/* Balance → earnings estimator */}
      <div className="rounded-2xl border border-brand-200 bg-brand-50/60 p-4">
        <label className="flex items-center gap-1.5 text-[13px] font-bold text-brand-800">
          <Sparkles className="h-3.5 w-3.5" />
          {t.savings.yourBalance}
        </label>
        <div className="mt-2 flex items-center rounded-xl border border-brand-200 bg-white px-3">
          <span className="text-sm font-semibold text-ink-400">৳</span>
          <input
            type="number"
            value={balance || ""}
            min={0}
            step={5000}
            onChange={(e) => setBalance(Number(e.target.value))}
            className="w-full bg-transparent px-2 py-2.5 text-sm font-semibold tabular text-ink-900 outline-none"
          />
        </div>
        <p className="mt-2 text-[11.5px] leading-relaxed text-brand-800/70">{t.savings.estHelp}</p>
      </div>

      <FilterGroup label={t.savings.filterRate}>
        <div className="flex items-center justify-between text-[13px] font-semibold text-ink-700">
          <span>{formatPercent(minRate, nf)}+</span>
          <span className="text-ink-400">{formatPercent(6, nf)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={6}
          step={0.25}
          value={minRate}
          onChange={(e) => setMinRate(Number(e.target.value))}
          className="mt-2 w-full"
        />
      </FilterGroup>

      <FilterGroup label={t.savings.filterOpening}>
        <div className="flex flex-wrap gap-1.5">
          {[
            { v: 0, l: locale === "bn" ? "যেকোনো" : "Any" },
            { v: 500, l: formatBDT(500, nf) },
            { v: 1000, l: formatBDT(1000, nf) },
            { v: 25000, l: formatBDT(25000, nf) },
          ].map((o) => (
            <Chip key={o.v} active={maxOpening === o.v} onClick={() => setMaxOpening(o.v)}>
              {o.l}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label={t.savings.filterSegment}>
        <div className="flex flex-wrap gap-1.5">
          {SEGMENTS.map((s) => (
            <Chip key={s} active={segments.includes(s)} onClick={() => toggle(segments, setSegments, s)}>
              {t.bank.segment[s] ?? s}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label={t.savings.filterBankType}>
        <div className="flex flex-wrap gap-1.5">
          {BANK_TYPES.map((s) => (
            <Chip key={s} active={bankTypes.includes(s)} onClick={() => toggle(bankTypes, setBankTypes, s)}>
              {t.bank.category[s] ?? s}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label={t.savings.filterFeatures}>
        <div className="space-y-1">
          {[
            { k: "shariah", l: t.savings.featureShariah },
            { k: "online", l: t.savings.featureOnline },
            { k: "card", l: t.savings.featureFreeCard },
            { k: "cheque", l: t.savings.featureFreeCheque },
            { k: "nofee", l: t.savings.featureNoFee },
          ].map((f) => (
            <label key={f.k} className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1.5 hover:bg-ink-50">
              <span
                className={`grid h-4.5 w-4.5 place-items-center rounded-[5px] border transition-colors ${
                  feat.includes(f.k) ? "border-brand-600 bg-brand-600" : "border-ink-300 bg-white"
                }`}
              >
                {feat.includes(f.k) && <Check className="h-3 w-3 text-white" strokeWidth={3.5} />}
              </span>
              <input type="checkbox" className="sr-only" checked={feat.includes(f.k)} onChange={() => toggle(feat, setFeat, f.k)} />
              <span className="text-[13.5px] text-ink-700">{f.l}</span>
            </label>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label={t.savings.filterBank}>
        <div className="max-h-64 space-y-1 overflow-y-auto pr-1">
          {bankOptions.map((b) => (
            <label key={b.slug} className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1.5 hover:bg-ink-50">
              <span
                className={`grid h-4.5 w-4.5 place-items-center rounded-[5px] border transition-colors ${
                  banks.includes(b.slug) ? "border-brand-600 bg-brand-600" : "border-ink-300 bg-white"
                }`}
              >
                {banks.includes(b.slug) && <Check className="h-3 w-3 text-white" strokeWidth={3.5} />}
              </span>
              <input type="checkbox" className="sr-only" checked={banks.includes(b.slug)} onChange={() => toggle(banks, setBanks, b.slug)} />
              <BankLogo initials={b.initials} color={b.color} size={20} rounded="rounded-md" />
              <span className="text-[13.5px] text-ink-700">{b.label}</span>
            </label>
          ))}
        </div>
      </FilterGroup>
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      {/* Desktop filters */}
      <aside className="no-print hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-[15px] font-bold text-ink-900">
              <SlidersHorizontal className="h-4 w-4 text-brand-600" />
              {t.common.filters}
            </h2>
            {activeCount > 0 && (
              <button onClick={resetAll} className="text-[12.5px] font-semibold text-flag-600 hover:underline">
                {t.common.clear}
              </button>
            )}
          </div>
          {FilterPanel}
        </div>
      </aside>

      <div>
        {/* Toolbar */}
        <div className="no-print mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t.common.searchPlaceholder}
              className="w-full rounded-full border border-ink-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-ink-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileFilters(true)}
              className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 lg:hidden"
            >
              <Filter className="h-4 w-4" />
              {t.common.filters}
              {activeCount > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand-600 px-1 text-[11px] text-white">
                  {formatNumber(activeCount, nf)}
                </span>
              )}
            </button>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="appearance-none rounded-full border border-ink-200 bg-white py-2.5 pl-4 pr-9 text-sm font-semibold text-ink-700 outline-none focus:border-brand-500"
                aria-label={t.common.sortBy}
              >
                <option value="rate_desc">{t.savings.sortRateDesc}</option>
                <option value="rate_asc">{t.savings.sortRateAsc}</option>
                <option value="opening_asc">{t.savings.sortOpeningAsc}</option>
                <option value="fee_asc">{t.savings.sortFeeAsc}</option>
                <option value="popular">{t.savings.sortPopular}</option>
                <option value="bank_asc">{t.savings.sortBank}</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            </div>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2 text-[13px] text-ink-500">
          <span className="font-semibold text-ink-800">
            {formatNumber(filtered.length, nf)} {t.common.results}
          </span>
          <span className="text-ink-300">·</span>
          <span>
            {t.common.lastVerified}: {formatDate(rows[0]?.effectiveFrom ?? new Date().toISOString(), nf)}
          </span>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="card grid place-items-center gap-2 p-14 text-center">
            <Info className="h-7 w-7 text-ink-300" />
            <p className="font-semibold text-ink-800">{t.common.noResults}</p>
            <p className="text-sm text-ink-500">{t.common.tryAgain}</p>
            <button onClick={resetAll} className="mt-2 text-sm font-semibold text-brand-700 hover:underline">
              {t.common.clear}
            </button>
          </div>
        ) : (
          <ul className="space-y-3.5">
            {filtered.map((r, i) => {
              const isBest = r.interestRateMax === bestRate && sort === "rate_desc" && i === 0;
              const selected = compare.includes(r.id);
              return (
                <li key={r.id}>
                  <article
                    className={`card card-hover relative overflow-hidden p-4 sm:p-5 ${
                      isBest ? "ring-2 ring-brand-500/60" : ""
                    }`}
                  >
                    {isBest && (
                      <div className="absolute right-0 top-0 rounded-bl-xl bg-brand-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                        {t.common.best}
                      </div>
                    )}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                      <BankLogo initials={r.bank.logoInitials} color={r.bank.brandColor} size={46} />

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <h3 className="text-[15.5px] font-bold leading-tight text-ink-900">{name(r)}</h3>
                          {r.isShariah && <Badge tone="brand">{t.savings.featureShariah}</Badge>}
                          {r.segment !== "GENERAL" && <Badge tone="blue">{t.bank.segment[r.segment]}</Badge>}
                          {r.onlineAccountOpening && <Badge tone="neutral">{t.savings.featureOnline}</Badge>}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-ink-500">
                          <span className="font-semibold text-ink-700">{bankName(r)}</span>
                          <span className="text-ink-300">·</span>
                          <span className="inline-flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            <span className="tabular">{formatPercent(r.bank.rating, nf).replace("%", "")}</span>
                            <span className="text-ink-400">
                              ({formatNumber(r.bank.reviewCount, nf)} {t.bank.reviews})
                            </span>
                          </span>
                        </div>

                        <dl className="mt-3.5 grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-4">
                          <Metric label={t.savings.openingBalance} value={formatBDT(r.minOpeningBalance, nf)} />
                          <Metric label={t.savings.minForInterest} value={formatBDT(r.minBalanceForInterest, nf)} />
                          <Metric
                            label={t.savings.maintenanceFee}
                            value={r.maintenanceFee ? `${formatBDT(r.maintenanceFee, nf)}` : "—"}
                            hint={r.maintenanceFee ? t.savings.halfYearly : undefined}
                          />
                          <Metric label={t.savings.payout} value={t.bank.payout[r.interestPayout] ?? r.interestPayout} />
                        </dl>

                        <ul className="mt-3.5 flex flex-wrap gap-1.5">
                          {features(r)
                            .slice(0, 3)
                            .map((f) => (
                              <li
                                key={f}
                                className="rounded-full bg-ink-50 px-2.5 py-1 text-[12px] text-ink-600 ring-1 ring-inset ring-ink-200/70"
                              >
                                {f}
                              </li>
                            ))}
                        </ul>
                      </div>

                      {/* Rate block */}
                      <div className="flex shrink-0 flex-row items-center justify-between gap-4 border-t border-ink-100 pt-4 sm:w-48 sm:flex-col sm:items-end sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
                        <div className="sm:text-right">
                          <div className="text-[11.5px] font-semibold uppercase tracking-wide text-ink-400">
                            {t.savings.interestRate}
                          </div>
                          <div className="text-[26px] font-extrabold leading-none tabular text-brand-600">
                            {formatPercent(r.interestRateMax, nf)}
                          </div>
                          {r.interestRate !== r.interestRateMax && (
                            <div className="text-[12px] text-ink-400">
                              {t.common.from} {formatPercent(r.interestRate, nf)}
                            </div>
                          )}
                          {balance > 0 && (
                            <div className="mt-1.5 rounded-lg bg-brand-50 px-2 py-1 text-[12px] font-semibold text-brand-700">
                              ≈ {formatBDT(Math.max(0, yearlyInterest(r)), nf)}/{locale === "bn" ? "বছর" : "yr"}
                            </div>
                          )}
                        </div>
                        <div className="no-print flex flex-col items-end gap-2">
                          <a
                            href={r.bank.website}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-3.5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-brand-700"
                          >
                            {t.savings.openAccount}
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                          <button
                            onClick={() =>
                              setCompare((c) =>
                                c.includes(r.id) ? c.filter((x) => x !== r.id) : c.length >= 3 ? c : [...c, r.id]
                              )
                            }
                            className={`inline-flex items-center gap-1.5 text-[12.5px] font-semibold transition-colors ${
                              selected ? "text-brand-700" : "text-ink-500 hover:text-ink-800"
                            }`}
                          >
                            <span
                              className={`grid h-4 w-4 place-items-center rounded border ${
                                selected ? "border-brand-600 bg-brand-600" : "border-ink-300"
                              }`}
                            >
                              {selected && <Check className="h-2.5 w-2.5 text-white" strokeWidth={4} />}
                            </span>
                            {t.common.compare}
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        )}

        <p className="mt-6 flex items-start gap-2 text-[12.5px] leading-relaxed text-ink-400">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {t.common.disclaimer}
        </p>
      </div>

      {/* Mobile filter drawer */}
      {mobileFilters && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-ink-900/40" onClick={() => setMobileFilters(false)} />
          <div className="absolute inset-y-0 right-0 flex w-[90%] max-w-sm flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-ink-200 px-5 py-4">
              <h2 className="text-base font-bold text-ink-900">{t.common.filters}</h2>
              <button onClick={() => setMobileFilters(false)} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-ink-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">{FilterPanel}</div>
            <div className="flex gap-3 border-t border-ink-200 px-5 py-4">
              <button onClick={resetAll} className="flex-1 rounded-full border border-ink-200 py-2.5 text-sm font-semibold text-ink-700">
                {t.common.reset}
              </button>
              <button
                onClick={() => setMobileFilters(false)}
                className="flex-[2] rounded-full bg-brand-600 py-2.5 text-sm font-semibold text-white"
              >
                {formatNumber(filtered.length, nf)} {t.common.results}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compare tray */}
      {compare.length > 0 && !showCompare && (
        <div className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-ink-200 bg-white/95 p-3 shadow-[0_-8px_30px_-12px_rgba(0,0,0,0.25)] backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-1">
            <div className="flex flex-1 items-center gap-2 overflow-x-auto">
              {compareRows.map((r) => (
                <span key={r.id} className="inline-flex items-center gap-1.5 rounded-full bg-ink-100 py-1 pl-1 pr-2 text-[12.5px] font-semibold text-ink-700">
                  <BankLogo initials={r.bank.logoInitials} color={r.bank.brandColor} size={20} rounded="rounded-full" />
                  <span className="max-w-[140px] truncate">{name(r)}</span>
                  <button onClick={() => setCompare((c) => c.filter((x) => x !== r.id))} aria-label={t.common.close}>
                    <X className="h-3.5 w-3.5 text-ink-400 hover:text-flag-600" />
                  </button>
                </span>
              ))}
            </div>
            <button
              onClick={() => setShowCompare(true)}
              disabled={compare.length < 2}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
            >
              <Scale className="h-4 w-4" />
              {t.common.compare} ({formatNumber(compare.length, nf)})
            </button>
          </div>
        </div>
      )}

      {/* Compare modal */}
      {showCompare && (
        <div className="fixed inset-0 z-[70] overflow-y-auto bg-ink-900/50 p-3 sm:p-6">
          <div className="mx-auto w-full max-w-4xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-ink-200 px-5 py-4">
              <h2 className="flex items-center gap-2 text-base font-bold text-ink-900">
                <Scale className="h-4.5 w-4.5 text-brand-600" />
                {t.common.comparing} · {formatNumber(compareRows.length, nf)} {t.common.products}
              </h2>
              <button onClick={() => setShowCompare(false)} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-ink-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-x-auto p-5">
              <table className="w-full min-w-[560px] border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="w-40 border-b border-ink-200 pb-3 text-left text-[12px] font-semibold uppercase tracking-wide text-ink-400" />
                    {compareRows.map((r) => (
                      <th key={r.id} className="border-b border-ink-200 px-3 pb-3 text-left align-top">
                        <div className="flex items-center gap-2">
                          <BankLogo initials={r.bank.logoInitials} color={r.bank.brandColor} size={28} />
                          <div>
                            <div className="text-[13.5px] font-bold leading-tight text-ink-900">{name(r)}</div>
                            <div className="text-[12px] text-ink-500">{r.bank.shortName}</div>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <CompareRow label={t.savings.interestRate} highlight>
                    {compareRows.map((r) => (
                      <td key={r.id} className="px-3 py-3 text-[15px] font-extrabold tabular text-brand-600">
                        {formatPercent(r.interestRateMax, nf)}
                      </td>
                    ))}
                  </CompareRow>
                  <CompareRow label={t.savings.estEarnings}>
                    {compareRows.map((r) => (
                      <td key={r.id} className="px-3 py-3 font-semibold tabular text-ink-800">
                        {formatBDT(Math.max(0, yearlyInterest(r)), nf)}
                      </td>
                    ))}
                  </CompareRow>
                  <CompareRow label={t.savings.openingBalance}>
                    {compareRows.map((r) => (
                      <td key={r.id} className="px-3 py-3 tabular text-ink-700">{formatBDT(r.minOpeningBalance, nf)}</td>
                    ))}
                  </CompareRow>
                  <CompareRow label={t.savings.minForInterest}>
                    {compareRows.map((r) => (
                      <td key={r.id} className="px-3 py-3 tabular text-ink-700">{formatBDT(r.minBalanceForInterest, nf)}</td>
                    ))}
                  </CompareRow>
                  <CompareRow label={t.savings.maintenanceFee}>
                    {compareRows.map((r) => (
                      <td key={r.id} className="px-3 py-3 tabular text-ink-700">
                        {r.maintenanceFee ? formatBDT(r.maintenanceFee, nf) : "—"}
                      </td>
                    ))}
                  </CompareRow>
                  <CompareRow label={t.savings.debitCardFee}>
                    {compareRows.map((r) => (
                      <td key={r.id} className="px-3 py-3 tabular text-ink-700">
                        {r.debitCardAnnualFee ? formatBDT(r.debitCardAnnualFee, nf) : "—"}
                      </td>
                    ))}
                  </CompareRow>
                  <CompareRow label={t.savings.payout}>
                    {compareRows.map((r) => (
                      <td key={r.id} className="px-3 py-3 text-ink-700">{t.bank.payout[r.interestPayout]}</td>
                    ))}
                  </CompareRow>
                  <CompareRow label={t.savings.featureFreeCheque}>
                    {compareRows.map((r) => (
                      <td key={r.id} className="px-3 py-3">
                        <YesNo value={r.freeChequebook} />
                      </td>
                    ))}
                  </CompareRow>
                  <CompareRow label={t.savings.featureFreeCard}>
                    {compareRows.map((r) => (
                      <td key={r.id} className="px-3 py-3">
                        <YesNo value={r.freeDebitCard} />
                      </td>
                    ))}
                  </CompareRow>
                  <CompareRow label={t.savings.featureOnline}>
                    {compareRows.map((r) => (
                      <td key={r.id} className="px-3 py-3">
                        <YesNo value={r.onlineAccountOpening} />
                      </td>
                    ))}
                  </CompareRow>
                  <CompareRow label={t.savings.featureShariah}>
                    {compareRows.map((r) => (
                      <td key={r.id} className="px-3 py-3">
                        <YesNo value={r.isShariah} />
                      </td>
                    ))}
                  </CompareRow>
                </tbody>
              </table>
            </div>
            <div className="flex justify-between gap-3 border-t border-ink-200 px-5 py-4">
              <button
                onClick={() => {
                  setCompare([]);
                  setShowCompare(false);
                }}
                className="rounded-full border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-600"
              >
                {t.common.clear}
              </button>
              <button onClick={() => setShowCompare(false)} className="rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white">
                {t.common.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2.5 text-[12.5px] font-bold uppercase tracking-wide text-ink-500">{label}</h3>
      {children}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${
        active ? "bg-brand-600 text-white" : "bg-ink-100 text-ink-600 hover:bg-ink-200"
      }`}
    >
      {children}
    </button>
  );
}

function Metric({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div>
      <dt className="text-[11.5px] font-medium text-ink-400">{label}</dt>
      <dd className="text-[13.5px] font-semibold tabular text-ink-800">
        {value}
        {hint && <span className="ml-1 text-[11px] font-normal text-ink-400">{hint}</span>}
      </dd>
    </div>
  );
}

function CompareRow({ label, children, highlight }: { label: string; children: React.ReactNode; highlight?: boolean }) {
  return (
    <tr className={highlight ? "bg-brand-50/50" : ""}>
      <th className="border-b border-ink-100 py-3 pr-3 text-left text-[12.5px] font-semibold text-ink-500">{label}</th>
      {children}
    </tr>
  );
}

function YesNo({ value }: { value: boolean }) {
  return value ? (
    <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-brand-700">
      <Check className="h-3.5 w-3.5" /> Yes
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-[13px] text-ink-400">
      <X className="h-3.5 w-3.5" /> No
    </span>
  );
}

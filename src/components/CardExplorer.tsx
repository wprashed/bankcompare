"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Check,
  CreditCard as CardIcon,
  ExternalLink,
  Filter,
  Plane,
  Scale,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
  Zap,
  ShieldCheck,
  Gift,
  CircleDollarSign,
} from "lucide-react";
import { BankLogo } from "./BankLogo";
import { Badge, Button } from "./ui";
import type { CreditCardRow } from "@/lib/queries";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { formatBDT, formatNumber, formatPercent } from "@/lib/format";

type Props = {
  rows: CreditCardRow[];
  t: Dictionary;
  locale: Locale;
  bnNumerals: boolean;
  initial: {
    q?: string;
    sort?: string;
    network?: string;
    tier?: string;
    bank?: string;
    lounge?: string;
    waiver?: string;
  };
};

type SortKey = "popular" | "fee_asc" | "apr_asc" | "income_asc" | "bank_asc";

const NETWORKS = ["VISA", "MASTERCARD", "AMEX"];
const TIERS = ["CLASSIC", "GOLD", "PLATINUM", "SIGNATURE", "TITANIUM", "WORLD"];

export function CardExplorer({ rows, t, locale, bnNumerals, initial }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(initial.q ?? "");
  const [sort, setSort] = useState<SortKey>((initial.sort as SortKey) ?? "popular");
  const [selectedNetwork, setSelectedNetwork] = useState<string>(initial.network ?? "");
  const [selectedTier, setSelectedTier] = useState<string>(initial.tier ?? "");
  const [selectedBanks, setSelectedBanks] = useState<string[]>(initial.bank ? [initial.bank] : []);
  const [feeFreeOnly, setFeeFreeOnly] = useState(false);
  const [feeWaiverOnly, setFeeWaiverOnly] = useState(initial.waiver === "1");
  const [loungeOnly, setLoungeOnly] = useState(initial.lounge === "1");
  const [zeroEmiOnly, setZeroEmiOnly] = useState(false);
  const [shariahOnly, setShariahOnly] = useState(false);
  const [userIncome, setUserIncome] = useState<number>(50000);
  const [compare, setCompare] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [mobileFilters, setMobileFilters] = useState(false);

  const nf = { bnNumerals };
  const name = (r: CreditCardRow) => (locale === "bn" ? r.nameBn : r.name);
  const bankName = (r: CreditCardRow) => (locale === "bn" ? r.bank.nameBn : r.bank.shortName);
  const features = (r: CreditCardRow) => (locale === "bn" ? r.featuresBn : r.features);
  const waiverText = (r: CreditCardRow) => (locale === "bn" ? r.feeWaiverConditionBn : r.feeWaiverCondition);
  const loungeText = (r: CreditCardRow) => (locale === "bn" ? r.loungeDetailsBn : r.loungeDetails);
  const rewardText = (r: CreditCardRow) => (locale === "bn" ? r.rewardSummaryBn : r.rewardSummary);

  useEffect(() => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (sort !== "popular") p.set("sort", sort);
    if (selectedNetwork) p.set("network", selectedNetwork);
    if (selectedTier) p.set("tier", selectedTier);
    if (selectedBanks.length === 1) p.set("bank", selectedBanks[0]);
    if (loungeOnly) p.set("lounge", "1");
    if (feeWaiverOnly) p.set("waiver", "1");
    const next = p.toString();
    if (next !== searchParams.toString()) {
      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, sort, selectedNetwork, selectedTier, selectedBanks, loungeOnly, feeWaiverOnly]);

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
      if (selectedNetwork && r.network !== selectedNetwork) return false;
      if (selectedTier && r.tier !== selectedTier) return false;
      if (selectedBanks.length && !selectedBanks.includes(r.bank.slug)) return false;
      if (feeFreeOnly && r.annualFee > 0) return false;
      if (feeWaiverOnly && !r.feeWaiverCondition) return false;
      if (loungeOnly && !r.airportLoungeAccess) return false;
      if (zeroEmiOnly && !r.zeroPctEmiAvailable) return false;
      if (shariahOnly && !r.isShariah) return false;
      return true;
    });

    switch (sort) {
      case "fee_asc":
        out.sort((a, b) => a.annualFee - b.annualFee);
        break;
      case "apr_asc":
        out.sort((a, b) => a.interestRateAnnual - b.interestRateAnnual);
        break;
      case "income_asc":
        out.sort((a, b) => a.minIncome - b.minIncome);
        break;
      case "bank_asc":
        out.sort((a, b) => a.bank.name.localeCompare(b.bank.name));
        break;
      case "popular":
      default:
        out.sort((a, b) => b.popularity - a.popularity);
    }
    return out;
  }, [
    rows,
    q,
    selectedNetwork,
    selectedTier,
    selectedBanks,
    feeFreeOnly,
    feeWaiverOnly,
    loungeOnly,
    zeroEmiOnly,
    shariahOnly,
    sort,
  ]);

  const toggleCompare = (id: string) => {
    setCompare((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const comparedCards = useMemo(() => rows.filter((r) => compare.includes(r.id)), [rows, compare]);

  const activeFilterCount =
    (selectedNetwork ? 1 : 0) +
    (selectedTier ? 1 : 0) +
    selectedBanks.length +
    (feeFreeOnly ? 1 : 0) +
    (feeWaiverOnly ? 1 : 0) +
    (loungeOnly ? 1 : 0) +
    (zeroEmiOnly ? 1 : 0) +
    (shariahOnly ? 1 : 0);

  const resetFilters = () => {
    setQ("");
    setSelectedNetwork("");
    setSelectedTier("");
    setSelectedBanks([]);
    setFeeFreeOnly(false);
    setFeeWaiverOnly(false);
    setLoungeOnly(false);
    setZeroEmiOnly(false);
    setShariahOnly(false);
  };

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[280px_1fr]">
      {/* ---------------- Desktop Filters Sidebar ---------------- */}
      <aside className="sticky top-20 hidden space-y-6 lg:block">
        <div className="card p-5">
          <div className="flex items-center justify-between border-b border-ink-100 pb-3">
            <span className="flex items-center gap-2 text-[14px] font-bold text-ink-900">
              <Filter className="h-4 w-4 text-brand-600" />
              {t.common.filters}
              {activeFilterCount > 0 && (
                <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-600 text-[11px] font-bold text-white">
                  {formatNumber(activeFilterCount, nf)}
                </span>
              )}
            </span>
            {activeFilterCount > 0 && (
              <button onClick={resetFilters} className="text-[12px] font-semibold text-brand-700 hover:underline">
                {t.common.clear}
              </button>
            )}
          </div>

          {/* Network Filter */}
          <div className="mt-5">
            <label className="text-[12.5px] font-bold text-ink-700">{t.cards.filterNetwork}</label>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              <button
                onClick={() => setSelectedNetwork("")}
                className={`rounded-lg py-1.5 text-center text-[12px] font-medium transition-colors ${
                  selectedNetwork === ""
                    ? "bg-brand-600 font-bold text-white shadow-xs"
                    : "bg-ink-100/70 text-ink-600 hover:bg-ink-100"
                }`}
              >
                {t.common.viewAll}
              </button>
              {NETWORKS.map((net) => (
                <button
                  key={net}
                  onClick={() => setSelectedNetwork((prev) => (prev === net ? "" : net))}
                  className={`rounded-lg py-1.5 text-center text-[12px] font-medium transition-colors ${
                    selectedNetwork === net
                      ? "bg-brand-600 font-bold text-white shadow-xs"
                      : "bg-ink-100/70 text-ink-600 hover:bg-ink-100"
                  }`}
                >
                  {t.bank.network[net] ?? net}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Perks / Benefits Toggles */}
          <div className="mt-6 border-t border-ink-100 pt-5">
            <label className="text-[12.5px] font-bold text-ink-700">{t.cards.overview}</label>
            <div className="mt-2.5 space-y-2">
              <label className="flex cursor-pointer items-center gap-2.5 text-[13px] text-ink-700 hover:text-ink-900">
                <input
                  type="checkbox"
                  checked={loungeOnly}
                  onChange={(e) => setLoungeOnly(e.target.checked)}
                  className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
                />
                <span className="flex items-center gap-1.5">
                  <Plane className="h-3.5 w-3.5 text-brand-600" />
                  {t.cards.filterLounge}
                </span>
              </label>

              <label className="flex cursor-pointer items-center gap-2.5 text-[13px] text-ink-700 hover:text-ink-900">
                <input
                  type="checkbox"
                  checked={feeWaiverOnly}
                  onChange={(e) => setFeeWaiverOnly(e.target.checked)}
                  className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
                />
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  {t.cards.filterFeeWaiver}
                </span>
              </label>

              <label className="flex cursor-pointer items-center gap-2.5 text-[13px] text-ink-700 hover:text-ink-900">
                <input
                  type="checkbox"
                  checked={feeFreeOnly}
                  onChange={(e) => setFeeFreeOnly(e.target.checked)}
                  className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
                />
                <span className="flex items-center gap-1.5">
                  <CircleDollarSign className="h-3.5 w-3.5 text-emerald-600" />
                  {t.cards.filterFeeFree}
                </span>
              </label>

              <label className="flex cursor-pointer items-center gap-2.5 text-[13px] text-ink-700 hover:text-ink-900">
                <input
                  type="checkbox"
                  checked={zeroEmiOnly}
                  onChange={(e) => setZeroEmiOnly(e.target.checked)}
                  className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
                />
                <span className="flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-blue-600" />
                  {t.cards.filterZeroEmi}
                </span>
              </label>

              <label className="flex cursor-pointer items-center gap-2.5 text-[13px] text-ink-700 hover:text-ink-900">
                <input
                  type="checkbox"
                  checked={shariahOnly}
                  onChange={(e) => setShariahOnly(e.target.checked)}
                  className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
                />
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  {t.cards.filterShariah}
                </span>
              </label>
            </div>
          </div>

          {/* Card Tier */}
          <div className="mt-6 border-t border-ink-100 pt-5">
            <label className="text-[12.5px] font-bold text-ink-700">{t.cards.filterTier}</label>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedTier("")}
                className={`rounded-md px-2.5 py-1 text-[11.5px] font-semibold transition-colors ${
                  selectedTier === "" ? "bg-brand-600 text-white" : "bg-ink-100 text-ink-600 hover:bg-ink-200"
                }`}
              >
                {t.common.viewAll}
              </button>
              {TIERS.map((tier) => (
                <button
                  key={tier}
                  onClick={() => setSelectedTier((prev) => (prev === tier ? "" : tier))}
                  className={`rounded-md px-2.5 py-1 text-[11.5px] font-semibold transition-colors ${
                    selectedTier === tier ? "bg-brand-600 text-white" : "bg-ink-100 text-ink-600 hover:bg-ink-200"
                  }`}
                >
                  {t.bank.tier[tier] ?? tier}
                </button>
              ))}
            </div>
          </div>

          {/* Banks checklist */}
          <div className="mt-6 border-t border-ink-100 pt-5">
            <div className="flex items-center justify-between">
              <label className="text-[12.5px] font-bold text-ink-700">{t.savings.filterBank}</label>
              {selectedBanks.length > 0 && (
                <button
                  onClick={() => setSelectedBanks([])}
                  className="text-[11.5px] font-semibold text-brand-700 hover:underline"
                >
                  {t.common.clear}
                </button>
              )}
            </div>
            <div className="mt-2.5 max-h-48 space-y-1.5 overflow-y-auto pr-1">
              {bankOptions.map((b) => {
                const checked = selectedBanks.includes(b.slug);
                return (
                  <label
                    key={b.slug}
                    className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 text-[12.5px] text-ink-700 hover:bg-ink-50"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        setSelectedBanks((prev) =>
                          e.target.checked ? [...prev, b.slug] : prev.filter((x) => x !== b.slug)
                        );
                      }}
                      className="h-3.5 w-3.5 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span className="truncate">{b.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Income Filter Card / Eligibility Assistant */}
        <div className="card rounded-2xl bg-gradient-to-br from-ink-900 to-ink-950 p-5 text-white">
          <div className="flex items-center gap-2 text-[13px] font-bold text-brand-300">
            <Gift className="h-4 w-4" />
            <span>{locale === "bn" ? "আয়ের ভিত্তিতে যোগ্যতা" : "Eligibility by Income"}</span>
          </div>
          <p className="mt-2 text-[12px] leading-relaxed text-white/70">
            {locale === "bn"
              ? "আপনার বর্তমান মাসিক আয় নির্ধারণ করুন। কার্ডে আবেদনের যোগ্যতা স্বয়ংক্রিয়ভাবে চিহ্নিত হবে।"
              : "Set your monthly income to see instant eligibility badges across cards."}
          </p>
          <div className="mt-4">
            <div className="flex justify-between text-[12px] font-semibold text-brand-200">
              <span>{t.cards.minIncome}</span>
              <span className="tabular">{formatBDT(userIncome, nf)}</span>
            </div>
            <input
              type="range"
              min={20000}
              max={150000}
              step={5000}
              value={userIncome}
              onChange={(e) => setUserIncome(Number(e.target.value))}
              className="mt-2 w-full accent-brand-500"
            />
          </div>
        </div>
      </aside>

      {/* ---------------- Main Content ---------------- */}
      <div>
        {/* Search, Sort and Mobile Filter Toggle */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={locale === "bn" ? "কার্ডের নাম বা ব্যাংক দিয়ে খুঁজুন…" : "Search by card name or bank…"}
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

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileFilters(true)}
              className="flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-3.5 py-2 text-sm font-semibold text-ink-700 lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4 text-brand-600" />
              {t.common.filters}
              {activeFilterCount > 0 && (
                <span className="grid h-4.5 w-4.5 place-items-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
                  {formatNumber(activeFilterCount, nf)}
                </span>
              )}
            </button>

            <div className="flex items-center gap-2 text-sm">
              <span className="hidden whitespace-nowrap text-ink-500 sm:inline">{t.common.sortBy}:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="input py-2 text-sm font-semibold"
              >
                <option value="popular">{t.cards.sortPopular}</option>
                <option value="fee_asc">{t.cards.sortFeeAsc}</option>
                <option value="apr_asc">{t.cards.sortAprAsc}</option>
                <option value="income_asc">{t.cards.sortIncomeAsc}</option>
                <option value="bank_asc">{t.savings.sortBank}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results summary & Active compare indicator */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[13px] text-ink-500">
          <div>
            <span className="font-bold text-ink-900 tabular">{formatNumber(filtered.length, nf)}</span>{" "}
            {locale === "bn" ? "টি ক্রেডিট কার্ড পাওয়া গেছে" : "credit cards found"}
          </div>

          {compare.length > 0 && (
            <button
              onClick={() => setShowCompare(true)}
              className="flex items-center gap-2 rounded-full bg-brand-600 px-4 py-1.5 text-[12.5px] font-bold text-white shadow-sm hover:bg-brand-700"
            >
              <Scale className="h-3.5 w-3.5" />
              {t.cards.compareCards} ({formatNumber(compare.length, nf)}/৩)
            </button>
          )}
        </div>

        {/* Card Grid */}
        {filtered.length === 0 ? (
          <div className="card mt-8 p-12 text-center">
            <CardIcon className="mx-auto h-12 w-12 text-ink-300" />
            <h3 className="mt-4 text-[17px] font-bold text-ink-900">{t.common.noResults}</h3>
            <p className="mt-1 text-[13.5px] text-ink-500">{t.common.tryAgain}</p>
            <button onClick={resetFilters} className="mt-4 inline-flex items-center text-sm font-bold text-brand-600 hover:underline">
              {t.common.clear}
            </button>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((card) => {
              const isCompared = compare.includes(card.id);
              const eligible = userIncome >= card.minIncome;
              return (
                <article
                  key={card.id}
                  className={`card card-hover flex flex-col justify-between overflow-hidden p-5 transition-all ${
                    isCompared ? "ring-2 ring-brand-600" : ""
                  }`}
                >
                  {/* Visual Credit Card Mockup Header */}
                  <div>
                    <div
                      className="relative h-40 w-full overflow-hidden rounded-2xl p-4 text-white shadow-md"
                      style={{
                        background: `linear-gradient(135deg, ${card.cardColor} 0%, #090d16 100%)`,
                      }}
                    >
                      {/* Decorative background glow */}
                      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-xl" />

                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <BankLogo initials={card.bank.logoInitials} color={card.bank.brandColor} size={28} />
                          <span className="text-[12px] font-extrabold tracking-wide uppercase text-white/90">
                            {bankName(card)}
                          </span>
                        </div>
                        <span className="rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-extrabold tracking-wider uppercase backdrop-blur-xs">
                          {card.network}
                        </span>
                      </div>

                      {/* Chip & Contactless */}
                      <div className="mt-3 flex items-center gap-2">
                        <div className="h-6 w-8 rounded-sm border border-amber-300/40 bg-gradient-to-tr from-amber-400/80 to-amber-200/90 shadow-xs" />
                        <svg className="h-4 w-4 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12a2.5 2.5 0 0 0-2.5-2.5" />
                          <path d="M6 17a6 6 0 0 0 6-6 6 6 0 0 0-6-6" />
                          <path d="M3.5 19.5A9.5 9.5 0 0 0 13 10a9.5 9.5 0 0 0-9.5-9.5" />
                        </svg>
                      </div>

                      {/* Card Name and Tier */}
                      <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                        <div className="min-w-0 pr-2">
                          <div className="truncate text-[13px] font-bold text-white">{name(card)}</div>
                          <div className="text-[10px] font-semibold tracking-wider uppercase text-white/60">
                            {t.bank.tier[card.tier] ?? card.tier}
                          </div>
                        </div>
                        {card.isShariah && (
                          <span className="shrink-0 rounded bg-emerald-500/30 px-1.5 py-0.5 text-[9.5px] font-bold text-emerald-200 border border-emerald-400/40">
                            {locale === "bn" ? "শরিয়াহ" : "Shariah"}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Title & Key Attributes */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-medium text-ink-500">{t.cards.annualFee}</span>
                        <div className="text-right">
                          <span className="text-[18px] font-extrabold tabular text-brand-600">
                            {card.annualFee === 0 ? (
                              <span className="text-emerald-600">{locale === "bn" ? "ফ্রি" : "Free"}</span>
                            ) : (
                              formatBDT(card.annualFee, nf)
                            )}
                          </span>
                        </div>
                      </div>

                      {waiverText(card) && (
                        <div className="mt-1 flex items-center gap-1.5 text-[11.5px] text-emerald-700">
                          <Sparkles className="h-3 w-3 shrink-0 text-amber-500" />
                          <span className="truncate">{waiverText(card)}</span>
                        </div>
                      )}
                    </div>

                    <dl className="mt-3.5 space-y-1.5 border-t border-ink-100 pt-3 text-[12.5px]">
                      <div className="flex justify-between">
                        <dt className="text-ink-500">{t.cards.apr}</dt>
                        <dd className="font-semibold tabular text-ink-900">
                          {card.interestRateAnnual === 0
                            ? locale === "bn"
                              ? "সুদমুক্ত (উজরহ)"
                              : "0% (Ujrah)"
                            : formatPercent(card.interestRateAnnual, nf)}
                        </dd>
                      </div>

                      <div className="flex justify-between">
                        <dt className="text-ink-500">{t.cards.gracePeriod}</dt>
                        <dd className="font-semibold tabular text-ink-900">
                          {formatNumber(card.interestFreeDays, nf)} {t.cards.days}
                        </dd>
                      </div>

                      <div className="flex justify-between">
                        <dt className="text-ink-500">{t.cards.minIncome}</dt>
                        <dd className="flex items-center gap-1 font-semibold tabular text-ink-900">
                          {formatBDT(card.minIncome, nf)}
                          {eligible ? (
                            <span className="rounded bg-emerald-100 px-1 py-0.2 text-[10px] font-bold text-emerald-800">
                              {locale === "bn" ? "যোগ্য" : "Eligible"}
                            </span>
                          ) : null}
                        </dd>
                      </div>
                    </dl>

                    {/* Lounge & Rewards Badges */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {card.airportLoungeAccess && (
                        <Badge tone="blue">
                          <Plane className="mr-1 h-3 w-3" />
                          {locale === "bn" ? "এয়ারপোর্ট লাউঞ্জ" : "Lounge Access"}
                        </Badge>
                      )}
                      {card.zeroPctEmiAvailable && (
                        <Badge tone="neutral">
                          <Zap className="mr-1 h-3 w-3 text-blue-500" />
                          {locale === "bn" ? `০% ইএমআই (${formatNumber(card.maxEmiMonths, nf)} মাস)` : `0% EMI (${card.maxEmiMonths}m)`}
                        </Badge>
                      )}
                      {card.isDualCurrency && (
                        <Badge tone="flag">{locale === "bn" ? "দ্বৈত মুদ্রা" : "Dual Currency"}</Badge>
                      )}
                    </div>

                    {/* Features list */}
                    {features(card).length > 0 && (
                      <ul className="mt-3 space-y-1 text-[12px] text-ink-600">
                        {features(card)
                          .slice(0, 2)
                          .map((f, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                              <span className="line-clamp-1">{f}</span>
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>

                  {/* Actions / Compare */}
                  <div className="mt-5 flex items-center justify-between border-t border-ink-100 pt-3">
                    <button
                      onClick={() => toggleCompare(card.id)}
                      className={`inline-flex items-center gap-1 text-[12.5px] font-semibold transition-colors ${
                        isCompared ? "text-brand-700" : "text-ink-500 hover:text-ink-800"
                      }`}
                    >
                      <Scale className="h-3.5 w-3.5" />
                      {isCompared ? (locale === "bn" ? "তুলনায় আছে" : "Comparing") : t.common.compare}
                    </button>

                    <Button href={card.bank.website} external size="sm" variant="secondary">
                      {t.common.apply}
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* ---------------- Comparison Drawer / Modal ---------------- */}
      {showCompare && comparedCards.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="card max-h-[90vh] w-full max-w-4xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between border-b border-ink-200 bg-ink-50/80 px-6 py-4">
              <div className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-brand-600" />
                <h3 className="text-[17px] font-extrabold text-ink-900">{t.cards.compareCards}</h3>
              </div>
              <button
                onClick={() => setShowCompare(false)}
                className="grid h-8 w-8 place-items-center rounded-lg text-ink-500 hover:bg-ink-200/60"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[calc(90vh-130px)] overflow-x-auto overflow-y-auto p-6">
              <table className="w-full min-w-[550px] border-collapse text-[13px]">
                <thead>
                  <tr className="border-b border-ink-200">
                    <th className="w-1/4 pb-4 text-left font-bold text-ink-500">{t.cards.cardDetails}</th>
                    {comparedCards.map((c) => (
                      <th key={c.id} className="pb-4 text-left font-bold text-ink-900">
                        <div className="flex items-center gap-2">
                          <BankLogo initials={c.bank.logoInitials} color={c.bank.brandColor} size={28} />
                          <div>
                            <div className="font-extrabold text-ink-900">{name(c)}</div>
                            <div className="text-[11.5px] font-normal text-ink-500">{bankName(c)}</div>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  <tr>
                    <td className="py-3 font-semibold text-ink-600">{t.cards.filterNetwork}</td>
                    {comparedCards.map((c) => (
                      <td key={c.id} className="py-3 font-bold text-ink-900">
                        {t.bank.network[c.network] ?? c.network}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-ink-600">{t.cards.filterTier}</td>
                    {comparedCards.map((c) => (
                      <td key={c.id} className="py-3 font-semibold text-ink-800">
                        {t.bank.tier[c.tier] ?? c.tier}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-ink-600">{t.cards.annualFee}</td>
                    {comparedCards.map((c) => (
                      <td key={c.id} className="py-3 text-[15px] font-extrabold tabular text-brand-600">
                        {c.annualFee === 0 ? (locale === "bn" ? "ফ্রি" : "Free") : formatBDT(c.annualFee, nf)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-ink-600">{t.cards.feeWaiver}</td>
                    {comparedCards.map((c) => (
                      <td key={c.id} className="py-3 text-[12px] text-ink-700">
                        {waiverText(c) ?? "—"}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-ink-600">{t.cards.apr}</td>
                    {comparedCards.map((c) => (
                      <td key={c.id} className="py-3 font-bold tabular text-ink-900">
                        {c.interestRateAnnual === 0
                          ? locale === "bn"
                            ? "সুদমুক্ত (উজরহ)"
                            : "0% (Ujrah)"
                          : formatPercent(c.interestRateAnnual, nf)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-ink-600">{t.cards.gracePeriod}</td>
                    {comparedCards.map((c) => (
                      <td key={c.id} className="py-3 font-semibold tabular text-ink-900">
                        {formatNumber(c.interestFreeDays, nf)} {t.cards.days}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-ink-600">{t.cards.minIncome}</td>
                    {comparedCards.map((c) => (
                      <td key={c.id} className="py-3 font-bold tabular text-ink-900">
                        {formatBDT(c.minIncome, nf)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-ink-600">{t.cards.loungeAccess}</td>
                    {comparedCards.map((c) => (
                      <td key={c.id} className="py-3 text-[12px] text-ink-700">
                        {c.airportLoungeAccess ? (
                          <span className="font-semibold text-emerald-700">{loungeText(c) ?? "Yes"}</span>
                        ) : (
                          <span className="text-ink-400">No</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-ink-600">{t.cards.rewards}</td>
                    {comparedCards.map((c) => (
                      <td key={c.id} className="py-3 text-[12px] text-ink-700">
                        {rewardText(c) || "—"}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-ink-600">{t.cards.zeroEmi}</td>
                    {comparedCards.map((c) => (
                      <td key={c.id} className="py-3 font-semibold text-ink-800">
                        {c.zeroPctEmiAvailable
                          ? locale === "bn"
                            ? `সর্বোচ্চ ${formatNumber(c.maxEmiMonths, nf)} মাস`
                            : `Up to ${c.maxEmiMonths} months`
                          : "—"}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-ink-200 bg-ink-50/80 px-6 py-3">
              <button
                onClick={() => setCompare([])}
                className="text-[13px] font-semibold text-ink-500 hover:text-ink-800"
              >
                {t.common.clear}
              </button>
              <Button onClick={() => setShowCompare(false)} size="sm">
                {t.common.close}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Mobile Filters Drawer ---------------- */}
      {mobileFilters && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white lg:hidden">
          <div className="flex items-center justify-between border-b border-ink-200 px-5 py-4">
            <span className="flex items-center gap-2 text-[16px] font-bold text-ink-900">
              <Filter className="h-5 w-5 text-brand-600" />
              {t.common.filters}
            </span>
            <button onClick={() => setMobileFilters(false)} className="rounded-lg p-1 text-ink-600">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto p-5">
            <div>
              <label className="text-[13px] font-bold text-ink-700">{t.cards.filterNetwork}</label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedNetwork("")}
                  className={`rounded-lg py-2 text-center text-sm font-medium ${
                    selectedNetwork === "" ? "bg-brand-600 text-white" : "bg-ink-100 text-ink-700"
                  }`}
                >
                  {t.common.viewAll}
                </button>
                {NETWORKS.map((net) => (
                  <button
                    key={net}
                    onClick={() => setSelectedNetwork((prev) => (prev === net ? "" : net))}
                    className={`rounded-lg py-2 text-center text-sm font-medium ${
                      selectedNetwork === net ? "bg-brand-600 text-white" : "bg-ink-100 text-ink-700"
                    }`}
                  >
                    {t.bank.network[net] ?? net}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-ink-100 pt-4">
              <label className="text-[13px] font-bold text-ink-700">{t.cards.overview}</label>
              <div className="mt-3 space-y-3">
                <label className="flex items-center gap-3 text-sm text-ink-800">
                  <input
                    type="checkbox"
                    checked={loungeOnly}
                    onChange={(e) => setLoungeOnly(e.target.checked)}
                    className="h-4 w-4 rounded text-brand-600"
                  />
                  <span>{t.cards.filterLounge}</span>
                </label>
                <label className="flex items-center gap-3 text-sm text-ink-800">
                  <input
                    type="checkbox"
                    checked={feeWaiverOnly}
                    onChange={(e) => setFeeWaiverOnly(e.target.checked)}
                    className="h-4 w-4 rounded text-brand-600"
                  />
                  <span>{t.cards.filterFeeWaiver}</span>
                </label>
                <label className="flex items-center gap-3 text-sm text-ink-800">
                  <input
                    type="checkbox"
                    checked={feeFreeOnly}
                    onChange={(e) => setFeeFreeOnly(e.target.checked)}
                    className="h-4 w-4 rounded text-brand-600"
                  />
                  <span>{t.cards.filterFeeFree}</span>
                </label>
                <label className="flex items-center gap-3 text-sm text-ink-800">
                  <input
                    type="checkbox"
                    checked={zeroEmiOnly}
                    onChange={(e) => setZeroEmiOnly(e.target.checked)}
                    className="h-4 w-4 rounded text-brand-600"
                  />
                  <span>{t.cards.filterZeroEmi}</span>
                </label>
              </div>
            </div>
          </div>

          <div className="border-t border-ink-200 p-4">
            <Button onClick={() => setMobileFilters(false)} className="w-full">
              {t.common.apply} ({formatNumber(filtered.length, nf)} {t.common.results})
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

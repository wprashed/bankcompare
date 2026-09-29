"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, Award, ExternalLink, Info, Landmark, Search } from "lucide-react";
import { BankLogo } from "./BankLogo";
import { Badge } from "./ui";
import type { FdrOffer } from "@/lib/queries";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { applyTax, fdrSimpleMaturity, formatBDT, formatNumber, formatPercent, tenureLabel } from "@/lib/format";

type SortKey = "rate" | "maturity" | "min" | "bank";

export function FdrExplorer({
  offers,
  t,
  locale,
  bnNumerals,
  initialTenure = 12,
}: {
  offers: FdrOffer[];
  t: Dictionary;
  locale: Locale;
  bnNumerals: boolean;
  initialTenure?: number;
}) {
  const tenures = useMemo(() => [...new Set(offers.map((o) => o.tenureMonths))].sort((a, b) => a - b), [offers]);
  const [tenure, setTenure] = useState(initialTenure);
  const [amount, setAmount] = useState(100000);
  const [q, setQ] = useState("");
  const [shariahOnly, setShariahOnly] = useState(false);
  const [applyTaxToggle, setApplyTaxToggle] = useState(true);
  const [hasTin, setHasTin] = useState(true);
  const [sort, setSort] = useState<SortKey>("rate");
  const nf = { bnNumerals };

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = offers
      .filter((o) => o.tenureMonths === tenure)
      .filter((o) => (shariahOnly ? o.isShariah : true))
      .filter((o) =>
        needle ? `${o.name} ${o.nameBn} ${o.bank.name} ${o.bank.nameBn} ${o.bank.shortName}`.toLowerCase().includes(needle) : true
      )
      .map((o) => {
        const eligible = amount >= o.minDeposit;
        const { interest, maturity } = fdrSimpleMaturity(amount, o.rate, tenure);
        const { net, tax } = applyTax(interest, hasTin);
        return {
          ...o,
          eligible,
          interest,
          maturity,
          tax,
          netInterest: net,
          netMaturity: amount + net,
        };
      });

    const sorters: Record<SortKey, (a: (typeof list)[0], b: (typeof list)[0]) => number> = {
      rate: (a, b) => Number(b.eligible) - Number(a.eligible) || b.rate - a.rate,
      maturity: (a, b) => Number(b.eligible) - Number(a.eligible) || b.netMaturity - a.netMaturity,
      min: (a, b) => a.minDeposit - b.minDeposit || b.rate - a.rate,
      bank: (a, b) => a.bank.name.localeCompare(b.bank.name),
    };
    return list.sort(sorters[sort]);
  }, [offers, tenure, amount, q, shariahOnly, hasTin, sort]);

  const best = rows.find((r) => r.eligible);

  return (
    <div>
      {/* Controls */}
      <div className="no-print card mb-6 p-4 sm:p-5">
        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-[220px] flex-1">
            <label className="block text-[12px] font-bold uppercase tracking-wide text-ink-500">{t.fdr.amount}</label>
            <div className="mt-2 flex items-center rounded-xl border border-ink-200 bg-white px-3.5 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100">
              <span className="text-[15px] font-semibold text-ink-400">৳</span>
              <input
                type="number"
                min={1000}
                step={10000}
                value={amount || ""}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-transparent px-2 py-2.5 text-[16px] font-bold tabular text-ink-900 outline-none"
              />
            </div>
          </div>
          <div className="min-w-[200px] flex-[1.5]">
            <label className="block text-[12px] font-bold uppercase tracking-wide text-ink-500">{t.common.search}</label>
            <div className="relative mt-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t.common.searchPlaceholder}
                className="w-full rounded-xl border border-ink-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShariahOnly((v) => !v)}
              className={`rounded-full px-3.5 py-2.5 text-[12.5px] font-semibold transition-colors ${
                shariahOnly ? "bg-brand-600 text-white" : "bg-ink-100 text-ink-600 hover:bg-ink-200"
              }`}
            >
              {t.savings.featureShariah}
            </button>
            <button
              onClick={() => setApplyTaxToggle((v) => !v)}
              className={`rounded-full px-3.5 py-2.5 text-[12.5px] font-semibold transition-colors ${
                applyTaxToggle ? "bg-ink-900 text-white" : "bg-ink-100 text-ink-600 hover:bg-ink-200"
              }`}
            >
              {t.fdr.showTax}
            </button>
            {applyTaxToggle && (
              <div className="flex rounded-full bg-ink-100 p-0.5 text-[12px] font-semibold">
                <button
                  onClick={() => setHasTin(true)}
                  className={`rounded-full px-2.5 py-2 ${hasTin ? "bg-white text-ink-900 shadow-sm" : "text-ink-500"}`}
                >
                  {formatPercent(10, nf)}
                </button>
                <button
                  onClick={() => setHasTin(false)}
                  className={`rounded-full px-2.5 py-2 ${!hasTin ? "bg-white text-ink-900 shadow-sm" : "text-ink-500"}`}
                >
                  {formatPercent(15, nf)}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tenure tabs */}
        <div className="mt-5 flex flex-wrap items-center gap-1.5 border-t border-ink-100 pt-4">
          <span className="mr-1 text-[12px] font-bold uppercase tracking-wide text-ink-500">{t.fdr.tenure}:</span>
          {tenures.map((m) => (
            <button
              key={m}
              onClick={() => setTenure(m)}
              className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors ${
                tenure === m ? "bg-brand-600 text-white shadow-sm" : "bg-ink-100 text-ink-600 hover:bg-ink-200"
              }`}
            >
              {tenureLabel(m, locale, bnNumerals)}
            </button>
          ))}
        </div>
      </div>

      {/* Best offer highlight */}
      {best && (
        <div className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-brand-700 to-brand-600 p-5 text-white sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <BankLogo initials={best.bank.logoInitials} color="#ffffff22" size={48} />
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-wider text-brand-100">
                  <Award className="h-3.5 w-3.5" />
                  {t.fdr.bestFor} · {tenureLabel(tenure, locale, bnNumerals)}
                </div>
                <div className="mt-0.5 text-[17px] font-bold">{locale === "bn" ? best.bank.nameBn : best.bank.name}</div>
                <div className="text-[13px] text-brand-100">{locale === "bn" ? best.nameBn : best.name}</div>
              </div>
            </div>
            <div className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-3 sm:text-right">
              <div>
                <div className="text-[11.5px] uppercase tracking-wide text-brand-100">{t.fdr.rate}</div>
                <div className="text-[26px] font-extrabold leading-tight tabular">{formatPercent(best.rate, nf)}</div>
              </div>
              <div>
                <div className="text-[11.5px] uppercase tracking-wide text-brand-100">
                  {applyTaxToggle ? t.fdr.netInterest : t.fdr.interest}
                </div>
                <div className="text-[19px] font-bold leading-tight tabular">
                  {formatBDT(applyTaxToggle ? best.netInterest : best.interest, nf)}
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <div className="text-[11.5px] uppercase tracking-wide text-brand-100">{t.fdr.maturity}</div>
                <div className="text-[19px] font-bold leading-tight tabular">
                  {formatBDT(applyTaxToggle ? best.netMaturity : best.maturity, nf)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-3 flex items-center justify-between text-[13px]">
        <span className="font-semibold text-ink-800">
          {formatNumber(rows.length, nf)} {t.common.results} · {tenureLabel(tenure, locale, bnNumerals)}
        </span>
        <span className="text-ink-500">
          {t.fdr.amount}: <span className="font-semibold tabular text-ink-800">{formatBDT(amount, nf)}</span>
        </span>
      </div>

      {/* Table (desktop) */}
      <div className="card hidden overflow-hidden md:block">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-ink-50 text-left text-[11.5px] uppercase tracking-wide text-ink-500">
              <Th onClick={() => setSort("bank")} active={sort === "bank"}>
                {t.common.banks}
              </Th>
              <Th onClick={() => setSort("rate")} active={sort === "rate"} right>
                {t.fdr.rate}
              </Th>
              <Th onClick={() => setSort("min")} active={sort === "min"} right>
                {t.fdr.minDeposit}
              </Th>
              <th className="px-4 py-3 text-right font-semibold">
                {applyTaxToggle ? t.fdr.netInterest : t.fdr.interest}
              </th>
              <Th onClick={() => setSort("maturity")} active={sort === "maturity"} right>
                {t.fdr.maturity}
              </Th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={r.id}
                className={`border-t border-ink-100 transition-colors hover:bg-brand-50/40 ${
                  !r.eligible ? "opacity-45" : ""
                }`}
              >
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="w-4 text-[12px] font-bold tabular text-ink-300">{formatNumber(i + 1, nf)}</span>
                    <BankLogo initials={r.bank.logoInitials} color={r.bank.brandColor} size={34} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-[13.5px] font-bold text-ink-900">
                          {locale === "bn" ? r.bank.nameBn : r.bank.shortName}
                        </span>
                        {r.isShariah && <Badge tone="brand">{locale === "bn" ? "শরিয়াহ" : "Shariah"}</Badge>}
                      </div>
                      <div className="truncate text-[12px] text-ink-500">{locale === "bn" ? r.nameBn : r.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-right">
                  <span className="text-[17px] font-extrabold tabular text-brand-600">{formatPercent(r.rate, nf)}</span>
                </td>
                <td className="px-4 py-3.5 text-right tabular text-[13px] text-ink-600">{formatBDT(r.minDeposit, nf)}</td>
                <td className="px-4 py-3.5 text-right tabular text-[13px] font-semibold text-ink-800">
                  {formatBDT(applyTaxToggle ? r.netInterest : r.interest, nf)}
                </td>
                <td className="px-4 py-3.5 text-right tabular text-[14px] font-bold text-ink-900">
                  {formatBDT(applyTaxToggle ? r.netMaturity : r.maturity, nf)}
                </td>
                <td className="px-4 py-3.5 text-right">
                  <a
                    href={r.bank.website}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="no-print inline-flex items-center gap-1 rounded-full border border-ink-200 px-3 py-1.5 text-[12px] font-semibold text-ink-700 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                  >
                    {t.common.viewDetails}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <div className="grid place-items-center gap-2 p-12 text-center">
            <Landmark className="h-7 w-7 text-ink-300" />
            <p className="font-semibold text-ink-800">{t.common.noResults}</p>
          </div>
        )}
      </div>

      {/* Cards (mobile) */}
      <ul className="space-y-3 md:hidden">
        {rows.map((r) => (
          <li key={r.id} className={`card p-4 ${!r.eligible ? "opacity-50" : ""}`}>
            <div className="flex items-start gap-3">
              <BankLogo initials={r.bank.logoInitials} color={r.bank.brandColor} size={38} />
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-bold text-ink-900">{locale === "bn" ? r.bank.nameBn : r.bank.shortName}</div>
                <div className="truncate text-[12px] text-ink-500">{locale === "bn" ? r.nameBn : r.name}</div>
              </div>
              <span className="text-[20px] font-extrabold tabular text-brand-600">{formatPercent(r.rate, nf)}</span>
            </div>
            <dl className="mt-3 grid grid-cols-3 gap-2 border-t border-ink-100 pt-3 text-center">
              <div>
                <dt className="text-[11px] text-ink-400">{t.fdr.minDeposit}</dt>
                <dd className="text-[12.5px] font-semibold tabular text-ink-800">{formatBDT(r.minDeposit, nf)}</dd>
              </div>
              <div>
                <dt className="text-[11px] text-ink-400">{applyTaxToggle ? t.fdr.netInterest : t.fdr.interest}</dt>
                <dd className="text-[12.5px] font-semibold tabular text-ink-800">
                  {formatBDT(applyTaxToggle ? r.netInterest : r.interest, nf)}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] text-ink-400">{t.fdr.maturity}</dt>
                <dd className="text-[12.5px] font-bold tabular text-brand-700">
                  {formatBDT(applyTaxToggle ? r.netMaturity : r.maturity, nf)}
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>

      <p className="mt-6 flex items-start gap-2 text-[12.5px] leading-relaxed text-ink-400">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        {t.common.disclaimer}
      </p>
    </div>
  );
}

function Th({
  children,
  onClick,
  active,
  right,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active: boolean;
  right?: boolean;
}) {
  return (
    <th className={`px-4 py-3 font-semibold ${right ? "text-right" : "text-left"}`}>
      <button
        onClick={onClick}
        className={`inline-flex items-center gap-1 uppercase tracking-wide transition-colors hover:text-ink-800 ${
          active ? "text-brand-700" : ""
        }`}
      >
        {children}
        <ArrowUpDown className="h-3 w-3" />
      </button>
    </th>
  );
}

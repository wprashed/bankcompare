"use client";

import { useMemo, useState } from "react";
import { Calculator, Info, Percent, Printer, TrendingUp } from "lucide-react";
import { BankLogo } from "./BankLogo";
import type { FdrOffer } from "@/lib/queries";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { applyTax, fdrCompoundMaturity, fdrSimpleMaturity, formatBDT, formatPercent, tenureLabel } from "@/lib/format";

const AMOUNT_PRESETS = [50000, 100000, 500000, 1000000];

export function FdrCalculator({
  offers,
  t,
  locale,
  bnNumerals,
  compact = false,
}: {
  offers: FdrOffer[];
  t: Dictionary;
  locale: Locale;
  bnNumerals: boolean;
  compact?: boolean;
}) {
  const tenures = useMemo(
    () => [...new Set(offers.map((o) => o.tenureMonths))].sort((a, b) => a - b),
    [offers]
  );
  const [amount, setAmount] = useState(100000);
  const [tenure, setTenure] = useState(12);
  const [rate, setRate] = useState(9.25);
  const [method, setMethod] = useState<"simple" | "compound">("simple");
  const [hasTin, setHasTin] = useState(true);
  const [productId, setProductId] = useState<string>("");

  const nf = { bnNumerals };

  const tenureOffers = useMemo(
    () => offers.filter((o) => o.tenureMonths === tenure).sort((a, b) => b.rate - a.rate),
    [offers, tenure]
  );
  const bestOffer = tenureOffers[0];

  const pickProduct = (id: string) => {
    setProductId(id);
    const o = offers.find((x) => x.id === id);
    if (o) {
      setRate(o.rate);
      setTenure(o.tenureMonths);
      if (amount < o.minDeposit) setAmount(o.minDeposit);
    }
  };

  const { interest, maturity } =
    method === "simple" ? fdrSimpleMaturity(amount, rate, tenure) : fdrCompoundMaturity(amount, rate, tenure);
  const { tax, net, rate: taxRate } = applyTax(interest, hasTin);
  const netMaturity = amount + net;
  const effectiveAnnual = amount > 0 ? (net / amount) * (12 / tenure) * 100 : 0;

  return (
    <div className={`card overflow-hidden ${compact ? "" : "shadow-sm"}`}>
      <div className="grid lg:grid-cols-[1.15fr_1fr]">
        {/* Inputs */}
        <div className="border-b border-ink-200 p-5 sm:p-6 lg:border-b-0 lg:border-r">
          <div className="mb-5 flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <Calculator className="h-4.5 w-4.5" />
            </span>
            <div>
              <h3 className="text-[15px] font-bold text-ink-900">{t.calc.fdrTitle}</h3>
              <p className="text-[12.5px] text-ink-500">{t.calc.fdrSubtitle}</p>
            </div>
          </div>

          <label className="block text-[12.5px] font-bold uppercase tracking-wide text-ink-500">{t.calc.principal}</label>
          <div className="mt-2 flex items-center rounded-xl border border-ink-200 bg-white px-3.5 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100">
            <span className="text-[15px] font-semibold text-ink-400">৳</span>
            <input
              type="number"
              min={1000}
              step={1000}
              value={amount || ""}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-transparent px-2 py-3 text-[17px] font-bold tabular text-ink-900 outline-none"
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {AMOUNT_PRESETS.map((a) => (
              <button
                key={a}
                onClick={() => setAmount(a)}
                className={`rounded-full px-2.5 py-1 text-[12px] font-semibold transition-colors ${
                  amount === a ? "bg-brand-600 text-white" : "bg-ink-100 text-ink-600 hover:bg-ink-200"
                }`}
              >
                {formatBDT(a, nf)}
              </button>
            ))}
          </div>

          <label className="mt-6 block text-[12.5px] font-bold uppercase tracking-wide text-ink-500">
            {t.calc.tenureMonths}
          </label>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {tenures.map((m) => (
              <button
                key={m}
                onClick={() => setTenure(m)}
                className={`rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${
                  tenure === m ? "bg-brand-600 text-white" : "bg-ink-100 text-ink-600 hover:bg-ink-200"
                }`}
              >
                {tenureLabel(m, locale, bnNumerals)}
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[12.5px] font-bold uppercase tracking-wide text-ink-500">{t.calc.rate}</label>
              <div className="mt-2 flex items-center rounded-xl border border-ink-200 bg-white px-3.5 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100">
                <input
                  type="number"
                  min={0}
                  max={20}
                  step={0.05}
                  value={rate}
                  onChange={(e) => {
                    setRate(Number(e.target.value));
                    setProductId("");
                  }}
                  className="w-full bg-transparent py-3 text-[17px] font-bold tabular text-ink-900 outline-none"
                />
                <Percent className="h-4 w-4 text-ink-400" />
              </div>
            </div>
            <div>
              <label className="block text-[12.5px] font-bold uppercase tracking-wide text-ink-500">{t.calc.method}</label>
              <div className="mt-2 flex rounded-xl bg-ink-100 p-1">
                {(["simple", "compound"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMethod(m)}
                    className={`flex-1 rounded-lg px-2 py-2 text-[12.5px] font-semibold transition-colors ${
                      method === m ? "bg-white text-ink-900 shadow-sm" : "text-ink-500"
                    }`}
                  >
                    {m === "simple" ? t.calc.simple : t.calc.compound}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-[12.5px] font-bold uppercase tracking-wide text-ink-500">{t.calc.pickProduct}</label>
            <select
              value={productId}
              onChange={(e) => pickProduct(e.target.value)}
              className="mt-2 w-full rounded-xl border border-ink-200 bg-white px-3.5 py-3 text-[13.5px] font-medium text-ink-800 outline-none focus:border-brand-500"
            >
              <option value="">{t.calc.customRate}</option>
              {tenureOffers.map((o) => (
                <option key={o.id} value={o.id}>
                  {(locale === "bn" ? o.bank.nameBn : o.bank.shortName)} — {formatPercent(o.rate)} · {locale === "bn" ? o.nameBn : o.name}
                </option>
              ))}
            </select>
            {bestOffer && rate < bestOffer.rate && (
              <button
                onClick={() => pickProduct(bestOffer.id)}
                className="mt-2 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-flag-600 hover:underline"
              >
                <TrendingUp className="h-3.5 w-3.5" />
                {t.calc.applyBestRate}: {formatPercent(bestOffer.rate, nf)} ·{" "}
                {locale === "bn" ? bestOffer.bank.nameBn : bestOffer.bank.shortName}
              </button>
            )}
          </div>

          <div className="mt-6">
            <label className="block text-[12.5px] font-bold uppercase tracking-wide text-ink-500">{t.calc.tax}</label>
            <div className="mt-2 flex rounded-xl bg-ink-100 p-1">
              <button
                onClick={() => setHasTin(true)}
                className={`flex-1 rounded-lg px-2 py-2 text-[12.5px] font-semibold transition-colors ${
                  hasTin ? "bg-white text-ink-900 shadow-sm" : "text-ink-500"
                }`}
              >
                {t.fdr.hasTin}
              </button>
              <button
                onClick={() => setHasTin(false)}
                className={`flex-1 rounded-lg px-2 py-2 text-[12.5px] font-semibold transition-colors ${
                  !hasTin ? "bg-white text-ink-900 shadow-sm" : "text-ink-500"
                }`}
              >
                {t.fdr.noTin}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-gradient-to-b from-brand-50/70 to-white p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[12.5px] font-bold uppercase tracking-wide text-brand-700">{t.calc.results}</h3>
            <button
              onClick={() => window.print()}
              className="no-print inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-ink-600 hover:bg-ink-50"
            >
              <Printer className="h-3.5 w-3.5" />
              PDF
            </button>
          </div>

          <div className="mt-4 rounded-2xl border border-brand-200 bg-white p-5">
            <div className="text-[12.5px] font-medium text-ink-500">{t.calc.netMaturity}</div>
            <div className="mt-1 text-[34px] font-extrabold leading-none tabular tracking-tight text-brand-600">
              {formatBDT(netMaturity, nf)}
            </div>
            <div className="mt-2 text-[12.5px] text-ink-500">
              {formatBDT(amount, nf)} + {formatBDT(net, nf)} ({t.fdr.netInterest})
            </div>
          </div>

          <dl className="mt-4 space-y-2.5">
            <Row label={t.calc.principalAmount} value={formatBDT(amount, nf)} />
            <Row label={t.calc.grossInterest} value={formatBDT(interest, nf)} />
            <Row
              label={`${t.calc.taxDeducted} (${formatPercent(taxRate, nf)})`}
              value={`- ${formatBDT(tax, nf)}`}
              tone="flag"
            />
            <div className="h-px bg-ink-200" />
            <Row label={t.fdr.maturity} value={formatBDT(maturity, nf)} muted />
            <Row label={t.calc.netMaturity} value={formatBDT(netMaturity, nf)} bold />
          </dl>

          <div className="mt-4 rounded-xl bg-ink-900 p-4 text-white">
            <div className="flex items-baseline justify-between">
              <span className="text-[12.5px] text-white/70">
                {locale === "bn" ? "কার্যকর বার্ষিক রিটার্ন (কর পরে)" : "Effective annual return (after tax)"}
              </span>
              <span className="text-[19px] font-extrabold tabular text-brand-200">{formatPercent(effectiveAnnual, nf)}</span>
            </div>
          </div>

          {bestOffer && (
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-ink-200 bg-white p-3">
              <BankLogo initials={bestOffer.bank.logoInitials} color={bestOffer.bank.brandColor} size={34} />
              <div className="min-w-0 flex-1">
                <div className="text-[11.5px] font-semibold uppercase tracking-wide text-ink-400">{t.fdr.bestFor}</div>
                <div className="truncate text-[13.5px] font-bold text-ink-900">
                  {locale === "bn" ? bestOffer.bank.nameBn : bestOffer.bank.name}
                </div>
              </div>
              <span className="text-[17px] font-extrabold tabular text-brand-600">{formatPercent(bestOffer.rate, nf)}</span>
            </div>
          )}

          <p className="mt-4 flex items-start gap-1.5 text-[11.5px] leading-relaxed text-ink-400">
            <Info className="mt-0.5 h-3 w-3 shrink-0" />
            {t.common.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  tone,
  bold,
  muted,
}: {
  label: string;
  value: string;
  tone?: "flag";
  bold?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className={`text-[13px] ${muted ? "text-ink-400" : "text-ink-600"}`}>{label}</dt>
      <dd
        className={`tabular ${bold ? "text-[15px] font-extrabold text-ink-900" : "text-[13.5px] font-semibold"} ${
          tone === "flag" ? "text-flag-600" : muted ? "text-ink-400" : "text-ink-800"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

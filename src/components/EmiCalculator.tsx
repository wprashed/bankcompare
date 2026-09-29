"use client";

import { useState } from "react";
import { Banknote, Info, Printer } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { calcEMI, formatBDT, formatNumber, formatPercent } from "@/lib/format";

const LOAN_TYPES = [
  { key: "home", rate: 9.5, years: 15, amount: 5000000, en: "Home loan", bn: "গৃহঋণ" },
  { key: "car", rate: 10.5, years: 5, amount: 2000000, en: "Car loan", bn: "গাড়ি ঋণ" },
  { key: "personal", rate: 12.0, years: 4, amount: 500000, en: "Personal loan", bn: "ব্যক্তিগত ঋণ" },
  { key: "sme", rate: 11.5, years: 5, amount: 1500000, en: "SME loan", bn: "এসএমই ঋণ" },
];

export function EmiCalculator({ t, locale, bnNumerals }: { t: Dictionary; locale: Locale; bnNumerals: boolean }) {
  const [type, setType] = useState("home");
  const [amount, setAmount] = useState(5000000);
  const [rate, setRate] = useState(9.5);
  const [years, setYears] = useState(15);
  const nf = { bnNumerals };

  const months = Math.max(1, Math.round(years * 12));
  const { emi, totalInterest, totalPayment } = calcEMI(amount, rate, months);
  const interestShare = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;

  const applyType = (key: string) => {
    const preset = LOAN_TYPES.find((l) => l.key === key)!;
    setType(key);
    setAmount(preset.amount);
    setRate(preset.rate);
    setYears(preset.years);
  };

  return (
    <div className="card overflow-hidden shadow-sm">
      <div className="grid lg:grid-cols-[1.15fr_1fr]">
        <div className="border-b border-ink-200 p-5 sm:p-6 lg:border-b-0 lg:border-r">
          <div className="mb-5 flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-flag-50 text-flag-600">
              <Banknote className="h-4.5 w-4.5" />
            </span>
            <div>
              <h3 className="text-[15px] font-bold text-ink-900">{t.calc.emiTitle}</h3>
              <p className="text-[12.5px] text-ink-500">{t.calc.emiSubtitle}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {LOAN_TYPES.map((l) => (
              <button
                key={l.key}
                onClick={() => applyType(l.key)}
                className={`rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${
                  type === l.key ? "bg-ink-900 text-white" : "bg-ink-100 text-ink-600 hover:bg-ink-200"
                }`}
              >
                {locale === "bn" ? l.bn : l.en}
              </button>
            ))}
          </div>

          <label className="mt-6 block text-[12.5px] font-bold uppercase tracking-wide text-ink-500">
            {t.calc.loanAmount}
          </label>
          <div className="mt-2 flex items-center rounded-xl border border-ink-200 bg-white px-3.5 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100">
            <span className="text-[15px] font-semibold text-ink-400">৳</span>
            <input
              type="number"
              min={10000}
              step={50000}
              value={amount || ""}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-transparent px-2 py-3 text-[17px] font-bold tabular text-ink-900 outline-none"
            />
          </div>
          <input
            type="range"
            min={100000}
            max={20000000}
            step={100000}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="mt-3 w-full"
          />

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <div className="flex items-baseline justify-between">
                <label className="text-[12.5px] font-bold uppercase tracking-wide text-ink-500">{t.calc.rate}</label>
                <span className="text-[13px] font-bold tabular text-ink-900">{formatPercent(rate, nf)}</span>
              </div>
              <input
                type="range"
                min={5}
                max={20}
                step={0.25}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="mt-3 w-full"
              />
            </div>
            <div>
              <div className="flex items-baseline justify-between">
                <label className="text-[12.5px] font-bold uppercase tracking-wide text-ink-500">{t.calc.years}</label>
                <span className="text-[13px] font-bold tabular text-ink-900">
                  {formatNumber(years, nf)} · {formatNumber(months, nf)} {t.calc.months}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={25}
                step={1}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="mt-3 w-full"
              />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-b from-flag-50/60 to-white p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[12.5px] font-bold uppercase tracking-wide text-flag-700">{t.calc.results}</h3>
            <button
              onClick={() => window.print()}
              className="no-print inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-ink-600 hover:bg-ink-50"
            >
              <Printer className="h-3.5 w-3.5" />
              PDF
            </button>
          </div>

          <div className="mt-4 rounded-2xl border border-flag-200 bg-white p-5">
            <div className="text-[12.5px] font-medium text-ink-500">{t.calc.monthlyEmi}</div>
            <div className="mt-1 text-[34px] font-extrabold leading-none tabular tracking-tight text-flag-600">
              {formatBDT(emi, nf)}
            </div>
            <div className="mt-2 text-[12.5px] text-ink-500">
              {formatNumber(months, nf)} {t.calc.months} · {formatPercent(rate, nf)} {t.common.perYear}
            </div>
          </div>

          <dl className="mt-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <dt className="text-[13px] text-ink-600">{t.calc.principalAmount}</dt>
              <dd className="text-[13.5px] font-semibold tabular text-ink-800">{formatBDT(amount, nf)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-[13px] text-ink-600">{t.calc.totalInterest}</dt>
              <dd className="text-[13.5px] font-semibold tabular text-flag-600">{formatBDT(totalInterest, nf)}</dd>
            </div>
            <div className="h-px bg-ink-200" />
            <div className="flex items-center justify-between">
              <dt className="text-[13px] font-semibold text-ink-700">{t.calc.totalPayment}</dt>
              <dd className="text-[15px] font-extrabold tabular text-ink-900">{formatBDT(totalPayment, nf)}</dd>
            </div>
          </dl>

          <div className="mt-5">
            <div className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-ink-500">{t.calc.breakdown}</div>
            <div className="flex h-3 overflow-hidden rounded-full bg-ink-100">
              <div className="bg-brand-600" style={{ width: `${100 - interestShare}%` }} />
              <div className="bg-flag-500" style={{ width: `${interestShare}%` }} />
            </div>
            <div className="mt-2 flex justify-between text-[12px]">
              <span className="inline-flex items-center gap-1.5 text-ink-600">
                <span className="h-2 w-2 rounded-full bg-brand-600" />
                {t.calc.principalAmount} {formatPercent(100 - interestShare, nf)}
              </span>
              <span className="inline-flex items-center gap-1.5 text-ink-600">
                <span className="h-2 w-2 rounded-full bg-flag-500" />
                {t.calc.totalInterest} {formatPercent(interestShare, nf)}
              </span>
            </div>
          </div>

          <p className="mt-5 flex items-start gap-1.5 text-[11.5px] leading-relaxed text-ink-400">
            <Info className="mt-0.5 h-3 w-3 shrink-0" />
            {locale === "bn"
              ? "ক্রমহ্রাসমান স্থিতি পদ্ধতিতে হিসাব। প্রসেসিং ফি, বীমা ও অন্যান্য চার্জ অন্তর্ভুক্ত নয়।"
              : "Calculated on a reducing-balance basis. Processing fees, insurance and other bank charges are not included."}
          </p>
        </div>
      </div>
    </div>
  );
}

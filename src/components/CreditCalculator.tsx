"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Calculator,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import {
  calcCreditCardPayoff,
  estimateCreditEligibility,
  formatBDT,
  formatBDTCompact,
  formatNumber,
  formatPercent,
} from "@/lib/format";

type Props = {
  t: Dictionary;
  locale: Locale;
  bnNumerals: boolean;
};

export function CreditCalculator({ t, locale, bnNumerals }: Props) {
  const [activeTab, setActiveTab] = useState<"payoff" | "eligibility">("payoff");
  const nf = { bnNumerals };

  // Payoff state
  const [balance, setBalance] = useState<number>(60000);
  const [apr, setApr] = useState<number>(20.0); // 20% BB ceiling
  const [monthlyPayment, setMonthlyPayment] = useState<number>(5000);

  // Eligibility state
  const [income, setIncome] = useState<number>(60000);
  const [existingEmi, setExistingEmi] = useState<number>(5000);

  // Payoff calculations
  const payoffResult = useMemo(
    () => calcCreditCardPayoff(balance, apr, monthlyPayment),
    [balance, apr, monthlyPayment]
  );

  // Minimum payment comparison (paying only 5%)
  const minOnlyResult = useMemo(
    () => calcCreditCardPayoff(balance, apr, Math.max(500, balance * 0.05)),
    [balance, apr]
  );

  // Eligibility calculations
  const eligibilityResult = useMemo(
    () => estimateCreditEligibility(income, existingEmi, 0.5),
    [income, existingEmi]
  );

  return (
    <div className="mx-auto max-w-4xl">
      {/* Tab Switcher */}
      <div className="flex rounded-2xl bg-ink-100 p-1.5 shadow-inner">
        <button
          onClick={() => setActiveTab("payoff")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all ${
            activeTab === "payoff"
              ? "bg-white text-ink-900 shadow-sm"
              : "text-ink-600 hover:text-ink-900"
          }`}
        >
          <CreditCard className="h-4 w-4 text-brand-600" />
          {t.creditCalc.tabPayoff}
        </button>
        <button
          onClick={() => setActiveTab("eligibility")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all ${
            activeTab === "eligibility"
              ? "bg-white text-ink-900 shadow-sm"
              : "text-ink-600 hover:text-ink-900"
          }`}
        >
          <ShieldCheck className="h-4 w-4 text-brand-600" />
          {t.creditCalc.tabEligibility}
        </button>
      </div>

      {/* ---------------- Mode 1: Credit Card Payoff ---------------- */}
      {activeTab === "payoff" && (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Controls */}
          <div className="card space-y-6 p-6 sm:p-7">
            <div>
              <div className="flex justify-between text-sm font-bold text-ink-900">
                <span>{t.creditCalc.cardBalance}</span>
                <span className="text-[17px] font-extrabold tabular text-brand-600">{formatBDT(balance, nf)}</span>
              </div>
              <input
                type="range"
                min={5000}
                max={300000}
                step={5000}
                value={balance}
                onChange={(e) => setBalance(Number(e.target.value))}
                className="mt-3 w-full accent-brand-600"
              />
              <div className="mt-1 flex justify-between text-[11px] text-ink-400">
                <span>৳৫,০০০</span>
                <span>৳১,৫০,০০০</span>
                <span>৳৩,০০,০০০</span>
              </div>
            </div>

            <div className="border-t border-ink-100 pt-5">
              <div className="flex justify-between text-sm font-bold text-ink-900">
                <span>{t.creditCalc.cardApr}</span>
                <span className="text-[17px] font-extrabold tabular text-brand-600">{formatPercent(apr, nf)}</span>
              </div>
              <input
                type="range"
                min={10.0}
                max={20.0}
                step={0.5}
                value={apr}
                onChange={(e) => setApr(Number(e.target.value))}
                className="mt-3 w-full accent-brand-600"
              />
              <p className="mt-1 text-[11.5px] text-ink-400">
                {locale === "bn"
                  ? "বাংলাদেশ ব্যাংক নির্ধারিত ক্রেডিট কার্ডের সর্বোচ্চ সুদের হার ২০.০০%।"
                  : "Bangladesh Bank ceiling on credit card interest is 20.00% p.a."}
              </p>
            </div>

            <div className="border-t border-ink-100 pt-5">
              <div className="flex justify-between text-sm font-bold text-ink-900">
                <span>{t.creditCalc.monthlyPay}</span>
                <span className="text-[17px] font-extrabold tabular text-brand-600">
                  {formatBDT(monthlyPayment, nf)}
                </span>
              </div>
              <input
                type="range"
                min={Math.max(1000, payoffResult.minPayment ?? 500)}
                max={Math.max(20000, balance)}
                step={500}
                value={monthlyPayment}
                onChange={(e) => setMonthlyPayment(Number(e.target.value))}
                className="mt-3 w-full accent-brand-600"
              />
              <div className="mt-2 flex items-center justify-between rounded-lg bg-ink-50 px-3 py-2 text-[12px] text-ink-600">
                <span>{t.creditCalc.minPaymentDue}:</span>
                <span className="font-bold tabular text-ink-900">{formatBDT(payoffResult.minPayment ?? 500, nf)}</span>
              </div>
            </div>
          </div>

          {/* Results Summary & Minimum Payment Comparison */}
          <div className="space-y-5">
            <div className="card rounded-2xl bg-gradient-to-br from-ink-900 to-ink-950 p-6 text-white shadow-xl">
              <div className="flex items-center gap-2 text-brand-300">
                <Calculator className="h-5 w-5" />
                <span className="text-[13px] font-bold uppercase tracking-wider">{t.calc.results}</span>
              </div>

              <div className="mt-5">
                <span className="text-[13px] text-white/70">{t.creditCalc.monthsToPayoff}</span>
                <div className="mt-1 text-[38px] font-extrabold leading-none text-brand-300">
                  {formatNumber(payoffResult.months, nf)}{" "}
                  <span className="text-[18px] font-medium text-white/60">
                    {locale === "bn" ? "মাস" : "Months"}
                  </span>
                </div>
              </div>

              <dl className="mt-6 space-y-3 border-t border-white/10 pt-5 text-[13.5px]">
                <div className="flex justify-between">
                  <dt className="text-white/70">{t.creditCalc.totalInterestPaid}</dt>
                  <dd className="font-bold tabular text-brand-200">{formatBDT(payoffResult.totalInterest, nf)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-white/70">{t.creditCalc.totalCost}</dt>
                  <dd className="text-[16px] font-extrabold tabular text-white">
                    {formatBDT(payoffResult.totalPayment, nf)}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Minimum Payment Trap Notice */}
            <div className="card border border-amber-200 bg-amber-50/80 p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
                <div className="text-[13px] leading-relaxed text-amber-900">
                  <h4 className="font-bold text-amber-950">
                    {locale === "bn" ? "ন্যূনতম পেমেন্ট ফাঁদ এড়িয়ে চলুন" : "Beware the Minimum Payment Trap"}
                  </h4>
                  <p className="mt-1.5 text-amber-800">{t.creditCalc.payoffWarning}</p>
                  {minOnlyResult.months > payoffResult.months && (
                    <div className="mt-3 rounded-lg bg-white/70 p-2.5 text-[12px] font-medium text-amber-900">
                      {locale === "bn"
                        ? `প্রতি মাসে মাত্র ৫% ন্যূনতম কিস্তি দিলে ঋণ পরিশোধে প্রায় ${formatNumber(
                            minOnlyResult.months,
                            nf
                          )} মাস সময় লাগবে এবং অতিরিক্ত ${formatBDT(
                            minOnlyResult.totalInterest - payoffResult.totalInterest,
                            nf
                          )} টাকা সুদ দিতে হবে!`
                        : `Paying only the 5% minimum payment would take ${minOnlyResult.months} months and cost an extra ${formatBDT(
                            minOnlyResult.totalInterest - payoffResult.totalInterest,
                            nf
                          )} in interest!`}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Mode 2: Eligibility Estimator ---------------- */}
      {activeTab === "eligibility" && (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="card space-y-6 p-6 sm:p-7">
            <div>
              <div className="flex justify-between text-sm font-bold text-ink-900">
                <span>{t.creditCalc.monthlyIncome}</span>
                <span className="text-[17px] font-extrabold tabular text-brand-600">{formatBDT(income, nf)}</span>
              </div>
              <input
                type="range"
                min={20000}
                max={250000}
                step={5000}
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                className="mt-3 w-full accent-brand-600"
              />
              <div className="mt-1 flex justify-between text-[11px] text-ink-400">
                <span>৳২০,০০০</span>
                <span>৳১,২৫,০০০</span>
                <span>৳২,৫০,০০০</span>
              </div>
            </div>

            <div className="border-t border-ink-100 pt-5">
              <div className="flex justify-between text-sm font-bold text-ink-900">
                <span>{t.creditCalc.existingEmis}</span>
                <span className="text-[17px] font-extrabold tabular text-ink-700">
                  {formatBDT(existingEmi, nf)}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={Math.round(income * 0.7)}
                step={2000}
                value={existingEmi}
                onChange={(e) => setExistingEmi(Number(e.target.value))}
                className="mt-3 w-full accent-brand-600"
              />
              <p className="mt-1 text-[11.5px] text-ink-400">
                {locale === "bn"
                  ? "বিদ্যমান অন্যান্য ঋণ বা ক্রেডিট কার্ডের মাসিক কিস্তির পরিমাণ লিখুন।"
                  : "Total existing monthly instalments for loans or credit cards."}
              </p>
            </div>

            <div className="rounded-xl bg-ink-50 p-4 text-[12.5px] text-ink-600">
              <span className="font-bold text-ink-800">{t.creditCalc.dbrRatio}: </span>
              {locale === "bn"
                ? "বাংলাদেশ ব্যাংকের সার্কুলার অনুযায়ী একজন গ্রাহকের মোট মাসিক ঋণের কিস্তি তার মোট আয়ের ৫০% এর বেশি হতে পারবে না।"
                : "Under Bangladesh Bank consumer lending regulations, debt burden ratio (DBR) should generally not exceed 50% of verified monthly gross income."}
            </div>
          </div>

          {/* Results Summary */}
          <div className="space-y-5">
            <div className="card rounded-2xl bg-gradient-to-br from-brand-900 to-ink-950 p-6 text-white shadow-xl">
              <div className="flex items-center gap-2 text-brand-300">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-[13px] font-bold uppercase tracking-wider">{t.calc.results}</span>
              </div>

              <div className="mt-5 space-y-4">
                <div className="rounded-xl bg-white/[0.08] p-4 backdrop-blur-xs">
                  <span className="text-[12px] text-white/70">{t.creditCalc.maxEmiCapacity}</span>
                  <div className="mt-0.5 text-[26px] font-extrabold text-brand-300">
                    {formatBDT(eligibilityResult.disposableIncomeForEmi, nf)}{" "}
                    <span className="text-[12px] font-normal text-white/60">
                      / {locale === "bn" ? "মাস" : "month"}
                    </span>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-white/[0.06] p-3.5">
                    <span className="text-[11.5px] text-white/70">{t.creditCalc.estCardLimit}</span>
                    <div className="mt-1 text-[20px] font-extrabold text-white">
                      {formatBDTCompact(eligibilityResult.estimatedCreditCardLimit, { locale, bnNumerals })}
                    </div>
                  </div>

                  <div className="rounded-xl bg-white/[0.06] p-3.5">
                    <span className="text-[11.5px] text-white/70">{t.creditCalc.estLoanMax}</span>
                    <div className="mt-1 text-[20px] font-extrabold text-white">
                      {formatBDTCompact(eligibilityResult.estimatedPersonalLoanMax, { locale, bnNumerals })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2.5 border-t border-white/10 pt-5">
                <Link
                  href="/cards"
                  className="flex items-center justify-between rounded-xl bg-brand-600 px-4 py-3 text-[13.5px] font-bold text-white transition-colors hover:bg-brand-500"
                >
                  <span>{locale === "bn" ? "উপযুক্ত ক্রেডিট কার্ড দেখুন" : "Browse Eligible Credit Cards"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/loans"
                  className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3 text-[13.5px] font-bold text-white transition-colors hover:bg-white/20"
                >
                  <span>{locale === "bn" ? "উপযুক্ত ঋণ পণ্য দেখুন" : "Browse Eligible Loan Products"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

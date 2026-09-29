"use client";

import { useState, useMemo } from "react";
import { useLanguage } from "@/lib/i18n";
import { formatBdt } from "@/lib/format";
import { DpsRow } from "@/lib/queries";
import { ApplyModal, ApplyModalProduct } from "@/components/ApplyModal";

interface DpsCalculatorProps {
  dpsProducts: DpsRow[];
}

export function DpsCalculator({ dpsProducts }: DpsCalculatorProps) {
  const { lang } = useLanguage();
  const [monthlyDeposit, setMonthlyDeposit] = useState(5000);
  const [tenureYears, setTenureYears] = useState(5);
  const [interestRate, setInterestRate] = useState(9.5);
  const [hasTin, setHasTin] = useState(true);
  const [applyProduct, setApplyProduct] = useState<ApplyModalProduct | null>(null);

  // Calculation logic based on Bangladesh Bank & NBR Tax rules
  const results = useMemo(() => {
    const n = tenureYears * 12;
    const r = interestRate / 100 / 12;

    // Future Value of monthly annuity due: FV = P * [((1+r)^n - 1) / r] * (1+r)
    const futureValue = monthlyDeposit * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const totalPrincipal = monthlyDeposit * n;
    const grossInterest = Math.max(0, futureValue - totalPrincipal);

    // Advance Income Tax (AIT): 10% with TIN, 15% without TIN
    const aitRate = hasTin ? 0.10 : 0.15;
    const taxDeduction = grossInterest * aitRate;

    // NBR Excise Duty Slabs on final closing balance
    let exciseDuty = 0;
    if (futureValue > 50000000) {
      exciseDuty = 50000;
    } else if (futureValue > 10000000) {
      exciseDuty = 15000;
    } else if (futureValue > 1000000) {
      exciseDuty = 3000;
    } else if (futureValue > 500000) {
      exciseDuty = 500;
    } else if (futureValue > 100000) {
      exciseDuty = 150;
    }

    const netPayout = Math.max(0, futureValue - taxDeduction - exciseDuty);

    return {
      totalPrincipal,
      grossInterest,
      taxDeduction,
      exciseDuty,
      futureValue,
      netPayout,
      aitRatePercent: hasTin ? 10 : 15,
    };
  }, [monthlyDeposit, tenureYears, interestRate, hasTin]);

  return (
    <div className="space-y-10">
      {/* Interactive Calculator Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Controls Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-slate-900 dark:text-white">
                  {lang === "bn" ? "প্রতি মাসের কিস্তি" : "Monthly Installment"}
                </label>
                <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                  {formatBdt(monthlyDeposit, lang)}
                </span>
              </div>
              <input
                type="range"
                min={500}
                max={50000}
                step={500}
                value={monthlyDeposit}
                onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>৳৫০০</span>
                <span>৳২৫,০০০</span>
                <span>৳৫০,০০০</span>
              </div>
            </div>

            {/* Tenure Buttons */}
            <div>
              <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
                {lang === "bn" ? "ডিপিএসের সময়কাল (বছর)" : "DPS Tenure (Years)"}
              </label>
              <div className="grid grid-cols-6 gap-2">
                {[1, 2, 3, 5, 7, 10].map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setTenureYears(yr)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      tenureYears === yr
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {yr} {lang === "bn" ? "বছর" : "Yr"}
                  </button>
                ))}
              </div>
            </div>

            {/* Interest Rate Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-slate-900 dark:text-white">
                  {lang === "bn" ? "বার্ষিক মুনাফা / সুদের হার" : "Annual Interest / Profit Rate"}
                </label>
                <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                  {interestRate.toFixed(2)}%
                </span>
              </div>
              <input
                type="range"
                min={7.0}
                max={11.0}
                step={0.25}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>7.0%</span>
                <span>9.0%</span>
                <span>11.0%</span>
              </div>
            </div>

            {/* Tax / TIN Status Toggle */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  {lang === "bn" ? "ই-টিআইএন (TIN) সার্টিফিকেট আছে?" : "Do you have e-TIN Certificate?"}
                </span>
                <span className="text-[11px] text-slate-500">
                  {hasTin
                    ? (lang === "bn" ? "১০% উৎসে কর (AIT) প্রযোজ্য" : "10% Advance Income Tax (AIT) applies")
                    : (lang === "bn" ? "১৫% উৎসে কর (AIT) প্রযোজ্য (টিআইএন না থাকলে)" : "15% AIT applies without TIN")}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setHasTin(!hasTin)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  hasTin
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                {hasTin ? (lang === "bn" ? "হ্যাঁ (১০%)" : "Yes (10%)") : (lang === "bn" ? "না (১৫%)" : "No (15%)")}
              </button>
            </div>
          </div>

          {/* Results Summary Box (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-emerald-600 to-teal-800 rounded-2xl p-6 text-white shadow-xl space-y-5">
            <span className="text-[11px] uppercase tracking-wider font-bold bg-white/20 px-2.5 py-1 rounded-full inline-block">
              {lang === "bn" ? "মেয়াদান্তে মোট প্রাপ্তি" : "Estimated Net Payout"}
            </span>

            <div>
              <p className="text-xs text-emerald-100 font-medium">
                {lang === "bn" ? "কর ও আবগারি শুল্ক কাটার পর হাতে পাবেন" : "Net In-Hand Return after Tax & Excise Duty"}
              </p>
              <div className="text-3xl sm:text-4xl font-black font-mono mt-1 text-white tracking-tight">
                {formatBdt(Math.round(results.netPayout), lang)}
              </div>
            </div>

            {/* Breakdown List */}
            <div className="space-y-2.5 pt-4 border-t border-white/15 text-xs">
              <div className="flex justify-between text-emerald-100">
                <span>{lang === "bn" ? "মোট জমাকৃত আসল টাকা:" : "Total Principal Deposited:"}</span>
                <span className="font-bold text-white font-mono">{formatBdt(results.totalPrincipal, lang)}</span>
              </div>
              <div className="flex justify-between text-emerald-100">
                <span>{lang === "bn" ? "মোট অর্জিত মুনাফা (সুদ):" : "Gross Profit / Interest:"}</span>
                <span className="font-bold text-emerald-300 font-mono">+{formatBdt(Math.round(results.grossInterest), lang)}</span>
              </div>
              <div className="flex justify-between text-emerald-100">
                <span>
                  {lang === "bn" ? `উৎসে আয়কর (AIT ${results.aitRatePercent}%):` : `Income Tax (AIT ${results.aitRatePercent}%):`}
                </span>
                <span className="font-bold text-rose-300 font-mono">-{formatBdt(Math.round(results.taxDeduction), lang)}</span>
              </div>
              <div className="flex justify-between text-emerald-100">
                <span>{lang === "bn" ? "সরকারি আবগারি শুল্ক (Excise):" : "Govt Excise Duty:"}</span>
                <span className="font-bold text-rose-300 font-mono">-{formatBdt(results.exciseDuty, lang)}</span>
              </div>
            </div>

            <p className="text-[10px] text-emerald-200/80 leading-relaxed pt-2">
              ℹ️ {lang === "bn"
                ? "বাংলাদেশ ব্যাংকের নির্দেশনা ও জাতীয় রাজস্ব বোর্ডের (NBR) বিধিমালা অনুযায়ী হিসাবকৃত।"
                : "Calculated strictly in accordance with Bangladesh Bank guidelines and NBR excise duty slabs."}
            </p>
          </div>
        </div>
      </div>

      {/* Available DPS Products from Banks */}
      <div>
        <div className="mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {lang === "bn" ? "শীর্ষ ব্যাংকসমূহের ডিপিএস অফার" : "Available DPS Schemes Across Bangladeshi Banks"}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {lang === "bn"
              ? "সরাসরি ব্যাংক থেকে সেরা মুনাফার ডিপিএস বেছে নিন এবং সহজে আবেদন করুন"
              : "Compare real DPS accounts from scheduled banks and apply with one click"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {dpsProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    {p.bank.shortName}
                  </span>
                  {p.isShariah && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {lang === "bn" ? "শরীয়াহ সম্মত" : "Islamic"}
                    </span>
                  )}
                </div>

                <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {lang === "bn" ? p.nameBn : p.name}
                </h4>

                <div className="my-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">
                      {lang === "bn" ? "মুনাফা হার" : "Profit Rate"}
                    </span>
                    <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                      {p.interestRate.toFixed(2)}%
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">
                      {lang === "bn" ? "মাসিক জমা" : "Monthly Range"}
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {formatBdt(p.minMonthlyDeposit, lang)} - {formatBdt(p.maxMonthlyDeposit, lang)}
                    </span>
                  </div>
                </div>

                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {(lang === "bn" ? p.featuresBn : p.features).slice(0, 3).map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() =>
                    setApplyProduct({
                      name: p.name,
                      nameBn: p.nameBn,
                      bankName: p.bank.name,
                      bankSlug: p.bank.slug,
                      productType: "DPS",
                      productSlug: p.slug,
                    })
                  }
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm"
                >
                  {lang === "bn" ? "আবেদন করুন" : "Apply For This DPS"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fast Track Apply Modal */}
      {applyProduct && (
        <ApplyModal product={applyProduct} onClose={() => setApplyProduct(null)} />
      )}
    </div>
  );
}

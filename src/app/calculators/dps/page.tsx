import { Metadata } from "next";
import { getDpsProducts } from "@/lib/queries";
import { DpsCalculator } from "@/components/DpsCalculator";

export const metadata: Metadata = {
  title: "DPS Calculator Bangladesh — Maturity & Post-Tax Payout Estimator | BankBhai",
  description:
    "Calculate your Deposit Pension Scheme (DPS) maturity value, gross interest, NBR Advance Income Tax (10% with TIN / 15% without), and Excise Duty deductions.",
};

export default async function DpsCalculatorPage() {
  const dpsList = await getDpsProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <span>📈</span>
          <span>Post-Tax Maturity Calculator & Bank Schemes</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          DPS Calculator & Real Take-Home Maturity Estimator
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Estimate your exact monthly savings growth after mandatory Bangladesh Bank & NBR deductions — including 10%/15% Advance Income Tax (AIT) and annual Govt Excise Duty slabs.
        </p>
      </div>

      <DpsCalculator dpsProducts={dpsList} />
    </div>
  );
}

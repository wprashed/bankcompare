import { Metadata } from "next";
import { getCreditCardRows } from "@/lib/queries";
import { CardMatcher } from "@/components/CardMatcher";

export const metadata: Metadata = {
  title: "Credit Card Matcher Quiz — Find Your Ideal Bangladeshi Card | BankBhai",
  description:
    "Answer 3 simple questions about your monthly income and lifestyle priorities to find the highest-value credit cards with airport lounges, B1G1 buffets, and cashback.",
};

export default async function CardMatcherPage() {
  const cards = await getCreditCardRows();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Header */}
      <div className="space-y-3 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <span>🎯</span>
          <span>AI-Powered Card Recommendation Wizard</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Find Your Ideal Credit Card in 60 Seconds
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Skip browsing dozens of banks. Answer 3 quick lifestyle questions and our engine matches you with cards offering the highest rewards and approval probability.
        </p>
      </div>

      <CardMatcher cards={cards} />
    </div>
  );
}

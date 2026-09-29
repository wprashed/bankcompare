import { Metadata } from "next";
import { getCardDeals } from "@/lib/queries";
import { DealExplorer } from "@/components/DealExplorer";

export const metadata: Metadata = {
  title: "Credit Card B1G1 Buffets & Dining Deals in Bangladesh | BankCompare BD",
  description:
    "Discover all Buy 1 Get 1 free hotel buffets, restaurant discounts, international airline deals, and e-commerce shopping offers on credit cards in Bangladesh.",
};

export default async function DealsPage() {
  const deals = await getCardDeals();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Hero Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <span>🍽️</span>
          <span>B1G1 Hotel Buffets · Airline Tickets · E-commerce Discounts</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Credit Card Deals & Buy 1 Get 1 Offers in Bangladesh
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Save thousands of Taka with active card promotions across Dhaka, Chattogram, and Sylhet. Explore 5-star hotel buffet companion privileges, luxury resort stays, and online shopping discounts.
        </p>
      </div>

      {/* Explorer Component */}
      <DealExplorer initialDeals={deals} />
    </div>
  );
}

import { Metadata } from "next";
import { getBankRoutings } from "@/lib/queries";
import { RoutingExplorer } from "@/components/RoutingExplorer";

export const metadata: Metadata = {
  title: "Bank Routing Numbers & SWIFT Codes in Bangladesh | BankBhai",
  description:
    "Comprehensive directory of 9-digit Bangladesh Bank Routing Numbers and SWIFT/BIC codes for BEFTN, RTGS, and NPSB inter-bank transfers across all scheduled banks.",
};

export default async function RoutingNumbersPage() {
  const routings = await getBankRoutings();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <span>🏦</span>
          <span>Official 9-Digit Bangladesh Bank Routing Codes</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Bank Routing Numbers & SWIFT Code Directory
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Quickly find and copy 9-digit branch routing numbers needed for electronic fund transfers (BEFTN, NPSB, and RTGS) across all Bangladeshi scheduled banks and districts.
        </p>
      </div>

      <RoutingExplorer initialRoutings={routings} />
    </div>
  );
}

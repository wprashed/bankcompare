"use client";

import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Scale,
  Award,
  ArrowUp,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { Logo } from "./Logo";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function Footer({ t, verifiedLabel }: { t: Dictionary; verifiedLabel: string }) {
  const year = new Date().getFullYear();
  const isBn = t.nav.savings.includes("সঞ্চয়ী");

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="no-print mt-24 bg-slate-950 text-slate-400 border-t border-slate-800/80 selection:bg-emerald-500 selection:text-white">
      {/* ---------------- 1. Trust & Value Propositions Bar ---------------- */}
      <div className="border-b border-slate-900 bg-slate-900/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  {isBn ? "আমানত সুরক্ষা গ্যারান্টি" : "Deposit Protection"}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {isBn
                    ? "বাংলাদেশ ব্যাংক বীমা ট্রাস্ট তহবিলের আওতায় সর্বোচ্চ ২,০০,০০০ টাকা সুরক্ষিত।"
                    : "Secured up to ৳2,00,000 per depositor under Bangladesh Bank regulations."}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 shrink-0">
                <Scale className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  {isBn ? "শতভাগ নিরপেক্ষ তুলনা" : "100% Unbiased & Free"}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {isBn
                    ? "কোনো হিডেন ফি নেই। ব্যাংক স্পনসরশিপ বা প্রভাবমুক্ত নিরপেক্ষ বিশ্লেষণ।"
                    : "Zero hidden charges. Independent comparison free from bank sponsorship bias."}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 shrink-0">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  {isBn ? "যাচাইকৃত ব্যাংকিং তথ্য" : "Verified Rates Data"}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {isBn
                    ? "সর্বশেষ সার্কুলার ও শিডিউল অব চার্জেস অনুযায়ী নিয়মিত আপডেটকৃত।"
                    : "Continuously updated against official bank circulars & schedules of charges."}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 shrink-0">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  {isBn ? "ব্যাংক-গ্রেড নিরাপত্তা" : "256-Bit Encryption"}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {isBn
                    ? "আপনার তথ্যের সর্বোচ্চ গোপনীয়তা ও কঠোর তথ্য সুরক্ষার নিশ্চয়তা।"
                    : "Enterprise-grade SSL security keeping your application details private."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- 2. Main Navigation Grid ---------------- */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand Info & Mission (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Logo inverted size="md" />
            <p className="text-xs leading-relaxed text-slate-400 pr-4">
              {isBn
                ? "বাংলাদেশের শীর্ষস্থানীয় আর্থিক বিশ্লেষণ ও ব্যাংকিং পণ্য তুলনা প্ল্যাটফর্ম। সাধারণ নাগরিক ও ব্যবসায়ীদের সেরা সেভিংস, এফডিআর, ক্রেডিট কার্ড ও ঋণ সেবা বেছে নিতে সহায়তা করে।"
                : "Bangladesh's premier financial intelligence aggregator. Empowering consumers and enterprises to make confident, unbiased banking choices across 27 scheduled banks."}
            </p>

            <div className="pt-2 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span className="font-semibold text-slate-300">{verifiedLabel}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Building2 className="h-4 w-4 text-slate-500" />
                <span>Dhaka, Bangladesh · 27 Scheduled Banks Monitored</span>
              </div>
            </div>

            {/* Newsletter Mini Form */}
            <div className="pt-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-2">
                {isBn ? "সুদ হার ও ডিল অ্যালার্ট পান" : "Get Rate & Offer Alerts"}
              </span>
              <div className="flex gap-1.5 max-w-sm">
                <input
                  type="email"
                  placeholder="yourname@gmail.com"
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => alert("Thank you for subscribing to BankBhai rate alerts!")}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 transition-colors"
                >
                  {isBn ? "সাবস্ক্রাইব" : "Join"}
                </button>
              </div>
            </div>
          </div>

          {/* Col 1: Deposit Products */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 border-b border-slate-800 pb-2">
              {isBn ? "আমানত ও সঞ্চয়" : "Deposits & Savings"}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/savings" className="hover:text-emerald-400 transition-colors">
                  {t.nav.savings}
                </Link>
              </li>
              <li>
                <Link href="/fdr" className="hover:text-emerald-400 transition-colors">
                  {t.nav.fdr} (Fixed Deposits)
                </Link>
              </li>
              <li>
                <Link href="/calculators/dps" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>{isBn ? "ডিপিএস পেনশন স্কিম" : "DPS Schemes"}</span>
                  <span className="px-1.5 py-0.2 bg-emerald-950 text-emerald-300 text-[10px] rounded font-bold">New</span>
                </Link>
              </li>
              <li>
                <Link href="/savings?segment=STUDENT" className="hover:text-emerald-400 transition-colors">
                  {isBn ? "স্টুডেন্ট একাউন্ট" : "Student Accounts"}
                </Link>
              </li>
              <li>
                <Link href="/savings?shariah=true" className="hover:text-emerald-400 transition-colors">
                  {isBn ? "মুদারাবা ইসলামিক সঞ্চয়" : "Islamic Shariah Deposits"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Cards & Offers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 border-b border-slate-800 pb-2">
              {isBn ? "ক্রেডিট কার্ড ও অফার" : "Cards & Perks"}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/cards" className="hover:text-emerald-400 transition-colors">
                  {t.nav.cards} (All Banks)
                </Link>
              </li>
              <li>
                <Link href="/deals" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>{isBn ? "১টি কিনলে ১টি ফ্রি বুফে" : "B1G1 Hotel Buffets"}</span>
                  <span className="px-1.5 py-0.2 bg-amber-950 text-amber-300 text-[10px] rounded font-bold">Hot</span>
                </Link>
              </li>
              <li>
                <Link href="/cards/matcher" className="hover:text-emerald-400 transition-colors">
                  {isBn ? "কার্ড ম্যাচ কুইজ (৬০ সে.)" : "Card Matcher Quiz"}
                </Link>
              </li>
              <li>
                <Link href="/cards?lounge=1" className="hover:text-emerald-400 transition-colors">
                  {isBn ? "এয়ারপোর্ট লাউঞ্জ কার্ড" : "Airport Lounge Access"}
                </Link>
              </li>
              <li>
                <Link href="/cards?network=AMEX" className="hover:text-emerald-400 transition-colors">
                  American Express (Amex)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Loans & Retail Credit */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 border-b border-slate-800 pb-2">
              {isBn ? "ঋণ ও ক্যালকুলেটর" : "Loans & Calculators"}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/loans" className="hover:text-emerald-400 transition-colors">
                  {t.nav.loans} (Personal / Home)
                </Link>
              </li>
              <li>
                <Link href="/calculators/dps" className="hover:text-emerald-400 transition-colors">
                  {isBn ? "ডিপিএস কর ক্যালকুলেটর" : "DPS Post-Tax Estimator"}
                </Link>
              </li>
              <li>
                <Link href="/calculators/fdr" className="hover:text-emerald-400 transition-colors">
                  {t.nav.fdrCalculator}
                </Link>
              </li>
              <li>
                <Link href="/calculators/emi" className="hover:text-emerald-400 transition-colors">
                  {t.nav.emiCalculator}
                </Link>
              </li>
              <li>
                <Link href="/calculators/credit-card" className="hover:text-emerald-400 transition-colors">
                  {isBn ? "কার্ড পে-অফ ও ৫০% ডিবিআর" : "Card Payoff & BB DBR"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Banks & Compliance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 border-b border-slate-800 pb-2">
              {isBn ? "ব্যাংক ডিরেক্টরি" : "Banks & Directory"}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/banks" className="hover:text-emerald-400 transition-colors">
                  {t.nav.banks} (27 Profiles)
                </Link>
              </li>
              <li>
                <Link href="/routing-numbers" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>{isBn ? "৯-সংখ্যার রাউটিং নম্বর" : "Routing Numbers & SWIFT"}</span>
                </Link>
              </li>
              <li>
                <Link href="/banks/the-city-bank" className="hover:text-emerald-400 transition-colors">
                  The City Bank PLC
                </Link>
              </li>
              <li>
                <Link href="/banks/brac-bank" className="hover:text-emerald-400 transition-colors">
                  BRAC Bank PLC
                </Link>
              </li>
              <li>
                <Link href="/banks/eastern-bank" className="hover:text-emerald-400 transition-colors">
                  Eastern Bank (EBL)
                </Link>
              </li>
              <li>
                <Link href="/banks/islami-bank-bangladesh" className="hover:text-emerald-400 transition-colors">
                  Islami Bank (IBBL)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ---------------- 3. Regulatory Disclaimer Box ---------------- */}
        <div className="mt-12 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 text-xs leading-relaxed text-slate-400">
          <div className="flex items-center gap-2 font-bold text-slate-200 mb-1.5">
            <span className="text-emerald-500">⚖️</span>
            <span>{isBn ? "আইনগত ও নিয়ন্ত্রক সতর্কতা" : "Regulatory & Central Bank Disclaimer"}</span>
          </div>
          <p>
            {isBn
              ? "ব্যাংকভাই একটি স্বাধীন আর্থিক তথ্য ও গবেষণা প্ল্যাটফর্ম। সমস্ত তথ্য সংশ্লিষ্ট ব্যাংকসমূহের প্রকাশিত শিডিউল অব চার্জেস এবং বাংলাদেশ ব্যাংকের নির্দেশনার আলোকে সংগৃহীত। আমানত বা ঋণের চূড়ান্ত শর্তাবলি ব্যাংক কর্তৃপক্ষের সিদ্ধান্ত সাপেক্ষে পরিবর্তিত হতে পারে। সিদ্ধান্ত গ্রহণের পূর্বে ব্যাংকের সংশ্লিষ্ট শাখায় যাচাই করার পরামর্শ দেওয়া হচ্ছে।"
              : "BankBhai is an independent financial aggregator. All interest rates, charges, and perks are compiled from public bank schedules of charges and Bangladesh Bank circulars. Final terms remain subject to bank approval. Users are encouraged to verify current rates with respective bank branches before entering financial commitments."}
          </p>
        </div>

        {/* ---------------- 4. Bottom Copyright & Back to Top ---------------- */}
        <div className="mt-8 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>© {year} BankBhai. All rights reserved.</span>
            <span>·</span>
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition-colors"
          >
            <span>{isBn ? "উপরে যান" : "Back to Top"}</span>
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}

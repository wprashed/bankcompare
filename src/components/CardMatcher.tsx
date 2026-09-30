"use client";

import { useState, useMemo } from "react";
import {
  Briefcase,
  Laptop,
  Building2,
  UtensilsCrossed,
  Plane,
  ShoppingBag,
  CreditCard,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { formatBdt } from "@/lib/format";
import { CreditCardRow } from "@/lib/queries";
import { ApplyModal, ApplyModalProduct } from "@/components/ApplyModal";
import { getBankApplyUrl } from "@/lib/bankUrls";

interface CardMatcherProps {
  cards: CreditCardRow[];
}

export function CardMatcher({ cards }: CardMatcherProps) {
  const { lang } = useLanguage();
  const [step, setStep] = useState(1);
  const [income, setIncome] = useState(50000);
  const [profession, setProfession] = useState<"SALARIED" | "FREELANCER" | "BUSINESS">("SALARIED");
  const [priority, setPriority] = useState<"DINING" | "LOUNGE" | "CASHBACK" | "LOW_FEE" | "SHARIAH">("DINING");
  const [networkPref, setNetworkPref] = useState<"ANY" | "AMEX" | "VISA" | "MASTERCARD">("ANY");
  const [applyCard, setApplyCard] = useState<ApplyModalProduct | null>(null);

  // Recommendation Scoring Engine
  const recommendedCards = useMemo(() => {
    return cards
      .map((card) => {
        let score = 50;
        const reasons: string[] = [];
        const reasonsBn: string[] = [];

        // Salary check
        if (income >= card.minIncome) {
          score += 20;
          reasons.push(`Your income (${formatBdt(income, "en")}) qualifies for the ৳${card.minIncome.toLocaleString()} requirement.`);
          reasonsBn.push(`আপনার আয় (${formatBdt(income, "bn")}) এই কার্ডের ন্যূনতম শর্ত পূরণ করে।`);
        } else {
          score -= 30;
        }

        // Priority matching
        if (priority === "DINING") {
          if (card.slug.includes("amex") || card.tier === "SIGNATURE" || card.tier === "WORLD" || card.popularity > 90) {
            score += 30;
            reasons.push("Outstanding B1G1 dining and 5-star hotel buffet privileges across Dhaka & Chittagong.");
            reasonsBn.push("ঢাকা ও চট্টগ্রামের পাঁচতারা হোটেলে ১টি কিনলে ১টি ফ্রি বুফে ও ডাইনিং অফার।");
          }
        } else if (priority === "LOUNGE") {
          if (card.airportLoungeAccess) {
            score += 35;
            reasons.push(card.loungeDetails || "Complimentary airport lounge access included.");
            reasonsBn.push(card.loungeDetailsBn || "এয়ারপোর্ট লাউঞ্জে ফ্রি প্রবেশাধিকার রয়েছে।");
          }
        } else if (priority === "CASHBACK") {
          if (card.rewardType === "CASHBACK" || card.slug.includes("agora") || card.rewardSummary.includes("cashback")) {
            score += 35;
            reasons.push("High cash return and direct savings on groceries, supermarkets and bills.");
            reasonsBn.push("মুদি দোকান ও সুপারমার্কেটে কেনাকাটায় সরাসরি ক্যাশব্যাক ও সেভিংস।");
          }
        } else if (priority === "LOW_FEE") {
          if (card.annualFee <= 3500 || card.feeWaiverCondition) {
            score += 30;
            reasons.push(card.feeWaiverCondition || "Low annual fee with easy transaction waiver.");
            reasonsBn.push(card.feeWaiverConditionBn || "সহজ ট্রানজ্যাকশনে বার্ষিক ফি শতভাগ মওকুফের সুযোগ।");
          }
        } else if (priority === "SHARIAH") {
          if (card.isShariah) {
            score += 50;
            reasons.push("100% Shariah compliant based on Ujrah contract (Zero Riba/Interest).");
            reasonsBn.push("শতভাগ সুদমুক্ত শরীয়াহভিত্তিক উজরাহ চুক্তির নিশ্চয়তা।");
          } else {
            score -= 40;
          }
        }

        // Network preference
        if (networkPref !== "ANY") {
          if (card.network === networkPref) {
            score += 15;
            reasons.push(`Official ${networkPref} global cardholder benefits.`);
            reasonsBn.push(`অফিসিয়াল ${networkPref} নেটওয়ার্ক সুবিধা।`);
          }
        }

        // Freelancer USD endorsement
        if (profession === "FREELANCER" && card.isDualCurrency) {
          score += 10;
          reasons.push("Dual-currency international support for online subscriptions, AWS, and ad payments.");
          reasonsBn.push("অনলাইন সাবস্ক্রিপশন ও আন্তর্জাতিক খরচের জন্য ডুয়াল কারেন্সি সুবিধা।");
        }

        return {
          card,
          score: Math.min(99, Math.max(20, score)),
          reasons: reasons.slice(0, 3),
          reasonsBn: reasonsBn.slice(0, 3),
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [cards, income, profession, priority, networkPref]);

  return (
    <div className="space-y-8">
      {/* Wizard Step Progress */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {lang === "bn" ? `ধাপ ${step} / ৩` : `Step ${step} of 3`}
            </span>
            <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
              {step === 1 && (lang === "bn" ? "আপনার পেশা ও মাসিক আয় নির্বাচন করুন" : "Your Occupation & Monthly Income")}
              {step === 2 && (lang === "bn" ? "আপনার শীর্ষ ব্যয়ের অগ্রাধিকার কী?" : "What is Your Primary Spending Priority?")}
              {step === 3 && (lang === "bn" ? "পেমেন্ট নেটওয়ার্ক বা শরীয়াহ পছন্দ" : "Card Network or Shariah Preference")}
            </h3>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all ${
                  step === s ? "w-8 bg-emerald-600" : step > s ? "w-3 bg-emerald-400" : "w-3 bg-slate-200 dark:bg-slate-800"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Profession & Income */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                {lang === "bn" ? "আপনার বর্তমান পেশা:" : "Your Profession / Occupation:"}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { key: "SALARIED", label: lang === "bn" ? "বেতনভুক্ত চাকরিজীবী" : "Salaried Professional", icon: Briefcase },
                  { key: "FREELANCER", label: lang === "bn" ? "ফ্রিল্যান্সার / আইটি কর্মী" : "Freelancer / IT", icon: Laptop },
                  { key: "BUSINESS", label: lang === "bn" ? "ব্যবসায়ী / উদ্যোক্তা" : "Business Owner", icon: Building2 },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setProfession(item.key as "SALARIED" | "FREELANCER" | "BUSINESS")}
                    className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                      profession === item.key
                        ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 font-bold shadow-xs"
                        : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850"
                    }`}
                  >
                    <div className="p-2.5 rounded-xl bg-emerald-100/70 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 shrink-0">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-semibold">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {lang === "bn" ? "আপনার গড় মাসিক আয়:" : "Your Monthly Income (BDT):"}
                </label>
                <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                  {formatBdt(income, lang)}
                </span>
              </div>
              <input
                type="range"
                min={25000}
                max={250000}
                step={5000}
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>৳২৫,০০০</span>
                <span>৳১,২৫,০০০</span>
                <span>৳২,৫০,০০০+</span>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm"
              >
                {lang === "bn" ? "পরবর্তী ধাপ →" : "Next Step →"}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Spending Priority */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  key: "DINING",
                  title: lang === "bn" ? "১টি কিনলে ১টি ফ্রি বুফে ও ডাইনিং" : "B1G1 Hotel Buffets & Dining",
                  desc: lang === "bn" ? "ওয়েস্টিন, রেডিসন, লা মেরিডিয়ানে ফ্রি ডাইনিং" : "Complimentary 5-star hotel companion buffets",
                  icon: UtensilsCrossed,
                },
                {
                  key: "LOUNGE",
                  title: lang === "bn" ? "বিমানবন্দর লাউঞ্জ অ্যাক্সেস" : "Airport Lounge Access",
                  desc: lang === "bn" ? "বলাকা, এমটিবি ও আন্তর্জাতিক প্রায়োরিটি পাস" : "Balaka Lounge, domestic & Priority Pass access",
                  icon: Plane,
                },
                {
                  key: "CASHBACK",
                  title: lang === "bn" ? "সুপারমার্কেট ক্যাশব্যাক ও মুদি" : "Supermarket & Grocery Cashback",
                  desc: lang === "bn" ? "স্বপ্ন, আগোরা, ইউনিমার্টে কেনাকাটায় সেভিংস" : "Direct percentage savings on household spend",
                  icon: ShoppingBag,
                },
                {
                  key: "LOW_FEE",
                  title: lang === "bn" ? "কম বার্ষিক ফি / ট্রানজ্যাকশনে মওকুফ" : "Low Annual Fee / Free Waiver",
                  desc: lang === "bn" ? "স্বল্প ফি ও লেনদেনের মাধ্যমে শতভাগ ফি মওকুফ" : "Minimum cost of ownership with 15 swipes waiver",
                  icon: CreditCard,
                },
                {
                  key: "SHARIAH",
                  title: lang === "bn" ? "শতভাগ ইসলামিক / শরীয়াহ সম্মত" : "100% Shariah Compliant",
                  desc: lang === "bn" ? "সুদমুক্ত উজরাহ চুক্তি ও হালাল কেনাকাটা" : "Zero riba, Islamic bank card with monthly Ujrah",
                  icon: ShieldCheck,
                },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setPriority(item.key as "DINING" | "LOUNGE" | "CASHBACK" | "LOW_FEE" | "SHARIAH")}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    priority === item.key
                      ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 shadow-xs"
                      : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-1.5">
                    <div className="p-2 rounded-xl bg-emerald-100/70 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 shrink-0">
                      <item.icon className="h-4.5 w-4.5" />
                    </div>
                    <span className="text-sm font-bold">{item.title}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 pl-11">{item.desc}</p>
                </button>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold"
              >
                ← {lang === "bn" ? "আগের ধাপ" : "Back"}
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm"
              >
                {lang === "bn" ? "পরবর্তী ধাপ →" : "Next Step →"}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Network Preference */}
        {step === 3 && (
          <div className="space-y-6">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              {lang === "bn" ? "পেমেন্ট নেটওয়ার্ক পছন্দ:" : "Preferred Card Network:"}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { key: "ANY", label: lang === "bn" ? "যেকোনো নেটওয়ার্ক" : "Any Network" },
                { key: "AMEX", label: "American Express (Amex)" },
                { key: "VISA", label: "Visa" },
                { key: "MASTERCARD", label: "Mastercard" },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setNetworkPref(item.key as "ANY" | "AMEX" | "VISA" | "MASTERCARD")}
                  className={`p-3.5 rounded-xl border text-center text-xs font-bold transition-all ${
                    networkPref === item.key
                      ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold"
              >
                ← {lang === "bn" ? "আগের ধাপ" : "Back"}
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm"
              >
                {lang === "bn" ? "সেরা কার্ড দেখুন ✨" : "View Recommendations ✨"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Top Recommendations Output */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {lang === "bn" ? "আপনার জন্য সেরা ৩টি ক্রেডিট কার্ড" : "Top 3 Recommended Cards For You"}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === "bn" ? "আপনার আয় ও পছন্দের উপর ভিত্তি করে নিখুঁতভাবে নির্বাচিত" : "Ranked using real banking eligibility formulas and lifestyle perks"}
            </p>
          </div>
          <button
            onClick={() => setStep(1)}
            className="text-xs font-semibold text-emerald-600 hover:underline"
          >
            {lang === "bn" ? "পছন্দ পরিবর্তন করুন ↺" : "Reset Answers ↺"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedCards.map(({ card, score, reasons, reasonsBn }, index) => (
            <div
              key={card.id}
              className={`relative bg-white dark:bg-slate-900 border rounded-3xl p-6 shadow-sm flex flex-col justify-between transition-transform hover:-translate-y-1 ${
                index === 0
                  ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-emerald-500/10 shadow-lg"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            >
              {index === 0 && (
                <div className="absolute -top-3 left-6 bg-emerald-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-sm">
                  {lang === "bn" ? "সেরা ম্যাচ" : "Top Pick #1"}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {card.bank.shortName}
                  </span>
                  <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full text-xs font-bold">
                    <span>⚡</span>
                    <span>{score}% {lang === "bn" ? "ম্যাচ" : "Match"}</span>
                  </div>
                </div>

                <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {lang === "bn" ? card.nameBn : card.name}
                </h4>

                <div className="my-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">{lang === "bn" ? "বার্ষিক ফি:" : "Annual Fee:"}</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {card.annualFee === 0 ? (lang === "bn" ? "ফ্রি" : "Free") : formatBdt(card.annualFee, lang)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">{lang === "bn" ? "ন্যূনতম আয়:" : "Min Salary:"}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {formatBdt(card.minIncome, lang)}/mo
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    {lang === "bn" ? "কেন এটি আপনার জন্য উপযুক্ত:" : "Why this fits you:"}
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    {(lang === "bn" ? reasonsBn : reasons).map((r, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold shrink-0">✓</span>
                        <span className="leading-tight">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <a
                  href={getBankApplyUrl(card.bank.website, card.bank.slug, "CARD")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-1.5"
                  title={`${lang === "bn" ? "আবেদন করতে ব্যাংকের ওয়েবসাইটে যান" : "Apply on official bank website"}`}
                >
                  <span>{lang === "bn" ? "আবেদন করুন" : "Apply For This Card"}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {applyCard && (
        <ApplyModal product={applyCard} onClose={() => setApplyCard(null)} />
      )}
    </div>
  );
}

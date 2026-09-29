"use client";

import { useState, useMemo } from "react";
import {
  Sparkles,
  UtensilsCrossed,
  Hotel,
  Plane,
  ShoppingBag,
  HeartPulse,
  MapPin,
  Building2,
  Tag,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { CardDealRow } from "@/lib/queries";

interface DealExplorerProps {
  initialDeals: CardDealRow[];
}

export function DealExplorer({ initialDeals }: DealExplorerProps) {
  const { lang } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedCity, setSelectedCity] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  const categories = [
    { key: "ALL", label: lang === "bn" ? "সব অফার" : "All Deals", icon: Sparkles },
    { key: "DINING_B1G1", label: lang === "bn" ? "১টি কিনলে ১টি ফ্রি বুফে" : "B1G1 Buffets", icon: UtensilsCrossed },
    { key: "HOTEL_B1G1", label: lang === "bn" ? "হোটেল ও রিসোর্ট" : "Hotels & Resorts", icon: Hotel },
    { key: "TRAVEL", label: lang === "bn" ? "ফ্লাইট ও ভ্রমণ" : "Flights & Travel", icon: Plane },
    { key: "SHOPPING", label: lang === "bn" ? "ই-কমার্স ও শপিং" : "Shopping Deals", icon: ShoppingBag },
    { key: "HEALTHCARE", label: lang === "bn" ? "স্বাস্থ্যসেবা ও ডায়াগনস্টিক" : "Healthcare", icon: HeartPulse },
  ];

  const filteredDeals = useMemo(() => {
    return initialDeals.filter((d) => {
      if (selectedCategory !== "ALL" && d.category !== selectedCategory) return false;
      if (selectedCity !== "ALL" && d.city !== selectedCity && d.city !== "NATIONWIDE") return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = d.title.toLowerCase().includes(q) || d.titleBn.toLowerCase().includes(q);
        const matchMerchant = d.merchantName.toLowerCase().includes(q);
        const matchBank = d.bankName.toLowerCase().includes(q);
        const matchLoc = d.location ? d.location.toLowerCase().includes(q) : false;
        if (!matchTitle && !matchMerchant && !matchBank && !matchLoc) return false;
      }
      return true;
    });
  }, [initialDeals, selectedCategory, selectedCity, search]);

  return (
    <div className="space-y-6">
      {/* Search & City Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-96">
            <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder={lang === "bn" ? "হোটেল, মার্চেন্ট বা ব্যাংকের নাম দিয়ে খুঁজুন..." : "Search hotels, restaurants, or banks..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* City Selection */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {["ALL", "DHAKA", "CHITTAGONG", "SYLHET"].map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCity === city
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {city === "ALL" && (lang === "bn" ? "সারাদেশ" : "All Cities")}
                {city === "DHAKA" && (lang === "bn" ? "ঢাকা" : "Dhaka")}
                {city === "CHITTAGONG" && (lang === "bn" ? "চট্টগ্রাম" : "Chattogram")}
                {city === "SYLHET" && (lang === "bn" ? "সিলেট" : "Sylhet")}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 dark:border-slate-800 pb-1">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.key
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <cat.icon className="h-3.5 w-3.5" />
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Result Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>
          {lang === "bn"
            ? `মোট ${filteredDeals.length} টি সক্রিয় অফার পাওয়া গেছে`
            : `Showing ${filteredDeals.length} active credit card deals`}
        </span>
      </div>

      {/* Deals Grid */}
      {filteredDeals.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-500">
            {lang === "bn" ? "কোনো অফার খুঁজে পাওয়া যায়নি।" : "No deals match your search criteria."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDeals.map((deal) => (
            <div
              key={deal.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    <span>{deal.bannerBadge || (lang === "bn" ? "বিশেষ অফার" : "Special Offer")}</span>
                  </span>
                  <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-slate-400" />
                    <span>{deal.city === "NATIONWIDE" ? (lang === "bn" ? "সারাদেশ" : "Nationwide") : deal.city}</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2 leading-snug">
                  {lang === "bn" ? deal.titleBn : deal.title}
                </h3>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-slate-400" />
                  <span>{deal.merchantName} {deal.location && `· ${deal.location}`}</span>
                </p>

                <p className="text-xs text-slate-700 dark:text-slate-300 mt-3 leading-relaxed">
                  {lang === "bn" ? deal.discountDetailsBn : deal.discountDetails}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                    {lang === "bn" ? "প্রযোজ্য ব্যাংক" : "Eligible Bank"}
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {deal.bankName}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-lg">
                  {deal.cardTier} Cards
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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
  Search,
  X,
  Tag,
  Filter,
  ChevronDown,
  ExternalLink,
  SlidersHorizontal,
  Star,
  Clock,
  BadgePercent,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { CardDealRow } from "@/lib/queries";

interface DealExplorerProps {
  initialDeals: CardDealRow[];
}

const CATEGORY_META: Record<
  string,
  { label: string; labelBn: string; icon: React.ElementType; color: string; bg: string; border: string }
> = {
  ALL: { label: "All Deals", labelBn: "সব অফার", icon: Sparkles, color: "text-violet-700", bg: "bg-violet-50", border: "border-violet-200" },
  DINING_B1G1: { label: "B1G1 Buffets", labelBn: "১টি কিনলে ১টি ফ্রি", icon: UtensilsCrossed, color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200" },
  HOTEL_B1G1: { label: "Hotels & Resorts", labelBn: "হোটেল ও রিসোর্ট", icon: Hotel, color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
  TRAVEL: { label: "Flights & Travel", labelBn: "ফ্লাইট ও ভ্রমণ", icon: Plane, color: "text-sky-700", bg: "bg-sky-50", border: "border-sky-200" },
  SHOPPING: { label: "Shopping", labelBn: "শপিং ও ই-কমার্স", icon: ShoppingBag, color: "text-pink-700", bg: "bg-pink-50", border: "border-pink-200" },
  HEALTHCARE: { label: "Healthcare", labelBn: "স্বাস্থ্যসেবা", icon: HeartPulse, color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
};

const CITY_LABELS: Record<string, { en: string; bn: string }> = {
  ALL: { en: "All Cities", bn: "সারাদেশ" },
  DHAKA: { en: "Dhaka", bn: "ঢাকা" },
  CHITTAGONG: { en: "Chattogram", bn: "চট্টগ্রাম" },
  SYLHET: { en: "Sylhet", bn: "সিলেট" },
  NATIONWIDE: { en: "Nationwide", bn: "সারাদেশ" },
};

const BADGE_COLORS: Record<string, string> = {
  "Buy 1 Get 1": "bg-amber-100 text-amber-800 border-amber-300",
  "B1G1 Night": "bg-amber-100 text-amber-800 border-amber-300",
  "B1G1": "bg-amber-100 text-amber-800 border-amber-300",
  "NATIONWIDE": "bg-violet-100 text-violet-800 border-violet-300",
};

function getBadgeColor(badge: string | null): string {
  if (!badge) return "bg-slate-100 text-slate-700 border-slate-200";
  if (badge.includes("Buy 1") || badge.includes("B1G1")) return "bg-amber-100 text-amber-800 border-amber-300";
  if (badge.includes("Cashback")) return "bg-emerald-100 text-emerald-800 border-emerald-300";
  if (badge.includes("OFF") || badge.includes("%")) return "bg-rose-100 text-rose-800 border-rose-300";
  if (badge.includes("Night")) return "bg-blue-100 text-blue-800 border-blue-300";
  if (badge.includes("Flight")) return "bg-sky-100 text-sky-800 border-sky-300";
  return "bg-violet-100 text-violet-800 border-violet-300";
}

function getCityColor(city: string): string {
  if (city === "NATIONWIDE") return "text-violet-600";
  if (city === "DHAKA") return "text-blue-600";
  if (city === "CHITTAGONG") return "text-orange-600";
  if (city === "SYLHET") return "text-emerald-600";
  return "text-slate-500";
}

export function DealExplorer({ initialDeals }: DealExplorerProps) {
  const { lang } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedCity, setSelectedCity] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [expandedDeal, setExpandedDeal] = useState<string | null>(null);

  const filteredDeals = useMemo(() => {
    return initialDeals
      .filter((d) => {
        if (selectedCategory !== "ALL" && d.category !== selectedCategory) return false;
        if (selectedCity !== "ALL" && d.city !== selectedCity && d.city !== "NATIONWIDE") return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          const hay = [d.title, d.titleBn, d.merchantName, d.bankName, d.location ?? ""].join(" ").toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => (b.popularity ?? 50) - (a.popularity ?? 50));
  }, [initialDeals, selectedCategory, selectedCity, search]);

  // Group deals by category for the stats bar
  const stats = useMemo(() => {
    const counts: Record<string, number> = { ALL: initialDeals.length };
    initialDeals.forEach((d) => {
      counts[d.category] = (counts[d.category] ?? 0) + 1;
    });
    return counts;
  }, [initialDeals]);

  const activeFilterCount = (selectedCategory !== "ALL" ? 1 : 0) + (selectedCity !== "ALL" ? 1 : 0);

  const resetFilters = () => {
    setSelectedCategory("ALL");
    setSelectedCity("ALL");
    setSearch("");
  };

  const isBn = lang === "bn";

  return (
    <div className="space-y-6">
      {/* ─── Stats Strip ─────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Object.entries(CATEGORY_META).map(([key, meta]) => {
          const Icon = meta.icon;
          const count = stats[key] ?? 0;
          return (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`group flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center transition-all hover:shadow-md ${
                selectedCategory === key
                  ? `${meta.bg} ${meta.border} ${meta.color} shadow-sm ring-1 ring-current/20`
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <Icon className={`h-5 w-5 ${selectedCategory === key ? meta.color : "text-slate-400 group-hover:text-slate-600"}`} />
              <span className={`text-[11px] font-bold leading-tight ${selectedCategory === key ? meta.color : "text-slate-600"}`}>
                {isBn ? meta.labelBn : meta.label}
              </span>
              {key !== "ALL" && (
                <span className={`text-[10px] font-semibold tabular-nums ${selectedCategory === key ? "opacity-80" : "text-slate-400"}`}>
                  {count} {isBn ? "টি" : "deals"}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ─── Search & Filter Bar ─────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={isBn ? "হোটেল, মার্চেন্ট বা ব্যাংকের নাম দিয়ে খুঁজুন..." : "Search hotels, restaurants, banks..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-9 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* City Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {["ALL", "DHAKA", "CHITTAGONG", "SYLHET"].map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  selectedCity === city
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <MapPin className="mr-1 inline h-3 w-3" />
                {CITY_LABELS[city]?.[isBn ? "bn" : "en"] ?? city}
              </button>
            ))}
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold text-rose-600 hover:text-rose-700"
            >
              <X className="h-3.5 w-3.5" />
              {isBn ? "ফিল্টার মুছুন" : "Clear filters"}
              <span className="grid h-4.5 w-4.5 place-items-center rounded-full bg-rose-100 text-[10px] font-bold text-rose-600">
                {activeFilterCount}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* ─── Result Count ────────────────────────────── */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          <span className="font-bold text-slate-900">{filteredDeals.length}</span>{" "}
          {isBn ? "টি সক্রিয় অফার পাওয়া গেছে" : "active deals found"}
        </p>
        {selectedCategory !== "ALL" && (
          <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${CATEGORY_META[selectedCategory]?.bg} ${CATEGORY_META[selectedCategory]?.color}`}>
            {(() => { const Icon = CATEGORY_META[selectedCategory]?.icon; return Icon ? <Icon className="h-3.5 w-3.5" /> : null; })()}
            {isBn ? CATEGORY_META[selectedCategory]?.labelBn : CATEGORY_META[selectedCategory]?.label}
          </div>
        )}
      </div>

      {/* ─── Deals Grid ──────────────────────────────── */}
      {filteredDeals.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center">
          <Sparkles className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-500">
            {isBn ? "কোনো অফার পাওয়া যায়নি।" : "No deals match your filters."}
          </p>
          <button onClick={resetFilters} className="mt-3 text-xs font-bold text-emerald-600 hover:underline">
            {isBn ? "ফিল্টার সরান" : "Reset filters"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredDeals.map((deal) => {
            const catMeta = CATEGORY_META[deal.category] ?? CATEGORY_META.ALL;
            const CatIcon = catMeta.icon;
            const isExpanded = expandedDeal === deal.id;
            const badgeColor = getBadgeColor(deal.bannerBadge);
            const cityColor = getCityColor(deal.city);

            return (
              <article
                key={deal.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                {/* Card Header Strip */}
                <div className={`flex items-center justify-between px-4 py-2.5 ${catMeta.bg}`}>
                  <div className={`flex items-center gap-1.5 text-[11.5px] font-bold ${catMeta.color}`}>
                    <CatIcon className="h-3.5 w-3.5" />
                    <span>{isBn ? catMeta.labelBn : catMeta.label}</span>
                  </div>
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10.5px] font-extrabold ${badgeColor}`}>
                    <Tag className="h-2.5 w-2.5" />
                    {deal.bannerBadge ?? (isBn ? "বিশেষ অফার" : "Special Offer")}
                  </span>
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col p-4">
                  {/* Title */}
                  <h3 className="text-[14.5px] font-extrabold leading-snug text-slate-900">
                    {isBn ? deal.titleBn : deal.title}
                  </h3>

                  {/* Merchant & Location */}
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="flex items-center gap-1 text-[11.5px] font-medium text-slate-500">
                      <Building2 className="h-3 w-3 shrink-0 text-slate-400" />
                      {deal.merchantName}
                    </span>
                    {deal.location && (
                      <span className="flex items-center gap-1 text-[11.5px] text-slate-400">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {deal.location}
                      </span>
                    )}
                  </div>

                  {/* City Badge */}
                  <div className="mt-2">
                    <span className={`text-[11px] font-bold ${cityColor}`}>
                      {deal.city === "NATIONWIDE"
                        ? (isBn ? "🇧🇩 সারাদেশ" : "🇧🇩 Nationwide")
                        : `📍 ${CITY_LABELS[deal.city]?.[isBn ? "bn" : "en"] ?? deal.city}`}
                    </span>
                  </div>

                  {/* Description */}
                  <p className={`mt-3 text-[12.5px] leading-relaxed text-slate-600 ${isExpanded ? "" : "line-clamp-3"}`}>
                    {isBn ? deal.discountDetailsBn : deal.discountDetails}
                  </p>

                  {/* Terms (expanded) */}
                  {isExpanded && (isBn ? deal.termsBn : deal.terms) && (
                    <div className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-[11.5px] text-amber-800 border border-amber-200">
                      <span className="font-bold">📋 {isBn ? "শর্তাবলি:" : "Terms:"} </span>
                      {isBn ? deal.termsBn : deal.terms}
                    </div>
                  )}

                  {(isBn ? deal.discountDetailsBn : deal.discountDetails).length > 120 && (
                    <button
                      onClick={() => setExpandedDeal(isExpanded ? null : deal.id)}
                      className="mt-1 text-[11.5px] font-semibold text-emerald-600 hover:underline text-left"
                    >
                      {isExpanded ? (isBn ? "কম দেখুন ▲" : "Show less ▲") : (isBn ? "আরও দেখুন ▼" : "Read more ▼")}
                    </button>
                  )}
                </div>

                {/* Card Footer */}
                <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
                  <div className="min-w-0">
                    <div className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400">
                      {isBn ? "প্রযোজ্য ব্যাংক" : "Eligible Bank"}
                    </div>
                    <div className="truncate text-[12px] font-bold text-slate-800">{deal.bankName}</div>
                  </div>
                  <span className={`shrink-0 rounded-lg border px-2.5 py-1 text-[10.5px] font-extrabold tracking-wide ${catMeta.bg} ${catMeta.color} ${catMeta.border}`}>
                    {deal.cardTier}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

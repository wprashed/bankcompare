import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Sparkles, Tag, MapPin, Utensils } from "lucide-react";
import { getCardDeals } from "@/lib/queries";
import { DealExplorer } from "@/components/DealExplorer";
import { Container } from "@/components/ui";
import { getI18n } from "@/lib/i18n/server";
import { SITE_URL } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Credit Card Deals & B1G1 Offers in Bangladesh 2026 | BankBhai",
  description:
    "Discover 70+ exclusive credit card deals across Bangladesh — B1G1 hotel buffets, 5-star restaurant dining, airline discounts, e-commerce cashback and healthcare discounts from all major banks.",
  alternates: { canonical: "/deals" },
  keywords: [
    "credit card deals Bangladesh",
    "buy 1 get 1 buffet Bangladesh",
    "credit card offers Bangladesh 2026",
    "bank dining offers Dhaka",
    "B1G1 hotel buffet Dhaka",
    "ক্রেডিট কার্ড অফার বাংলাদেশ",
  ],
};

export default async function DealsPage() {
  const deals = await getCardDeals();
  const { t, locale } = await getI18n();
  const isBn = locale === "bn";

  // Stats
  const totalDeals = deals.length;
  const b1g1Count = deals.filter((d) => d.category === "DINING_B1G1").length;
  const hotelCount = deals.filter((d) => d.category === "HOTEL_B1G1").length;
  const bankCount = new Set(deals.map((d) => d.bankSlug)).size;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: isBn ? "হোম" : "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: isBn ? "ডিলস ও অফার" : "Deals & Offers", item: `${SITE_URL}/deals` },
    ],
  };

  return (
    <>
      <JsonLd data={[breadcrumbLd]} />

      {/* ─── Hero Banner ─────────────────────────────── */}
      <section className="border-b border-ink-200 bg-gradient-to-b from-amber-50/70 via-white to-white">
        <Container className="py-9 sm:py-12">
          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center gap-1.5 text-[12.5px] text-ink-400" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-brand-700">{isBn ? "হোম" : "Home"}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-ink-600">{isBn ? "ডিলস ও অফার" : "Deals & Offers"}</span>
          </nav>

          {/* Badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-[12px] font-bold text-amber-800">
            <Sparkles className="h-3.5 w-3.5" />
            {isBn ? "বি১জি১ বুফে · ফ্লাইট ছাড় · শপিং অফার" : "B1G1 Buffets · Flight Discounts · Shopping Cashback"}
          </div>

          <h1 className="max-w-3xl text-[28px] font-extrabold leading-tight tracking-tight text-ink-900 sm:text-[36px]">
            {isBn
              ? "ক্রেডিট কার্ড ডিলস ও বিশেষ অফার — ২০২৬"
              : "Credit Card Deals & Exclusive Offers — 2026"}
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-500">
            {isBn
              ? "ঢাকা, চট্টগ্রাম ও সিলেটের পাঁচতারা হোটেল বুফে, রেস্তোরাঁ, ফ্লাইট টিকিট, অনলাইন শপিং ও স্বাস্থ্যসেবায় হাজার হাজার টাকা সাশ্রয় করুন।"
              : "Save thousands of Taka on 5-star hotel buffets, restaurants, airline tickets, online shopping and healthcare across Bangladesh."}
          </p>

          {/* Stats Row */}
          <div className="mt-7 flex flex-wrap gap-4">
            {[
              { value: totalDeals + "+", label: isBn ? "মোট অফার" : "Total Deals", color: "text-violet-700", bg: "bg-violet-50 border-violet-200" },
              { value: b1g1Count + "+", label: isBn ? "বি১জি১ বুফে" : "B1G1 Buffets", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
              { value: hotelCount + "+", label: isBn ? "হোটেল অফার" : "Hotel Deals", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
              { value: bankCount + "+", label: isBn ? "ব্যাংক" : "Banks", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
            ].map((s) => (
              <div key={s.label} className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${s.bg}`}>
                <span className={`text-[22px] font-extrabold tabular-nums ${s.color}`}>{s.value}</span>
                <span className={`text-[12px] font-semibold ${s.color} opacity-80`}>{s.label}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── Explorer ────────────────────────────────── */}
      <Container className="py-9">
        <DealExplorer initialDeals={deals} />
      </Container>
    </>
  );
}

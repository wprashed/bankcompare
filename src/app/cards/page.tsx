import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui";
import { JsonLd } from "@/components/JsonLd";
import { CardExplorer } from "@/components/CardExplorer";
import { getI18n } from "@/lib/i18n/server";
import { getCreditCardRows } from "@/lib/queries";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Best Credit Cards in Bangladesh 2026 — Compare Annual Fees & Benefits",
  description:
    "Compare annual fees, lounge access, reward points, 0% EMI and interest rates across credit cards from top banks in Bangladesh. Filter by Visa, Mastercard, Amex, fee waivers and Shariah compliance.",
  alternates: { canonical: "/cards" },
  keywords: [
    "best credit card in Bangladesh",
    "credit card comparison Bangladesh",
    "zero fee credit card Bangladesh",
    "credit card lounge access Dhaka airport",
    "সেরা ক্রেডিট কার্ড বাংলাদেশ",
  ],
};

export default async function CardsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { t, locale, bnNumerals } = await getI18n();
  const sp = await searchParams;
  const rows = await getCreditCardRows();

  const str = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t.nav.home, item: SITE_URL },
      { "@type": "ListItem", position: 2, name: t.cards.title, item: `${SITE_URL}/cards` },
    ],
  };

  const productsLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Best credit cards in Bangladesh",
    numberOfItems: rows.length,
    itemListElement: rows.slice(0, 20).map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "FinancialProduct",
        name: `${r.bank.name} — ${r.name}`,
        url: `${SITE_URL}/cards`,
        category: "PaymentCard",
        provider: { "@type": "BankOrCreditUnion", name: r.bank.name, url: r.bank.website },
        annualPercentageRate: r.interestRateAnnual,
        feesAndCommissionsSpecification: `Annual fee BDT ${r.annualFee}`,
      },
    })),
  };

  return (
    <>
      <JsonLd data={[breadcrumbLd, productsLd]} />

      <section className="border-b border-ink-200 bg-gradient-to-b from-brand-50/60 to-white">
        <Container className="py-9 sm:py-12">
          <nav className="mb-4 flex items-center gap-1.5 text-[12.5px] text-ink-400" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-brand-700">
              {t.nav.home}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-ink-600">{t.cards.title}</span>
          </nav>
          <h1 className="max-w-3xl text-[28px] font-extrabold leading-tight tracking-tight text-ink-900 sm:text-[36px]">
            {t.cards.title}
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-500">{t.cards.subtitle}</p>
        </Container>
      </section>

      <Container className="py-9">
        <Suspense fallback={<div className="p-10 text-center text-ink-400">{t.common.loading}</div>}>
          <CardExplorer
            rows={rows}
            t={t}
            locale={locale}
            bnNumerals={bnNumerals}
            initial={{
              q: str(sp.q),
              sort: str(sp.sort),
              network: str(sp.network),
              tier: str(sp.tier),
              bank: str(sp.bank),
              lounge: str(sp.lounge),
              waiver: str(sp.waiver),
            }}
          />
        </Suspense>
      </Container>
    </>
  );
}

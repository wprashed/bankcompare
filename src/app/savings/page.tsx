import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui";
import { JsonLd } from "@/components/JsonLd";
import { SavingsExplorer } from "@/components/SavingsExplorer";
import { getI18n } from "@/lib/i18n/server";
import { getSavingsRows } from "@/lib/queries";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Best Savings Account in Bangladesh 2026 — Compare Interest Rates",
  description:
    "Compare savings account interest rates, minimum balance, maintenance fees and features across the top banks in Bangladesh. Filter by rate, bank type, student, women and digital accounts.",
  alternates: { canonical: "/savings" },
  keywords: [
    "best savings account in Bangladesh",
    "savings account interest rate Bangladesh",
    "bank account comparison Bangladesh",
    "student savings account Bangladesh",
    "সেরা সঞ্চয়ী হিসাব",
  ],
};

export default async function SavingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { t, locale, bnNumerals } = await getI18n();
  const sp = await searchParams;
  const rows = await getSavingsRows();

  const str = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t.nav.home, item: SITE_URL },
      { "@type": "ListItem", position: 2, name: t.savings.title, item: `${SITE_URL}/savings` },
    ],
  };

  const productsLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Best savings accounts in Bangladesh",
    numberOfItems: rows.length,
    itemListElement: rows.slice(0, 20).map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "BankAccount",
        name: `${r.bank.name} — ${r.name}`,
        url: `${SITE_URL}/savings`,
        provider: { "@type": "BankOrCreditUnion", name: r.bank.name, url: r.bank.website },
        interestRate: { "@type": "QuantitativeValue", value: r.interestRateMax, unitText: "PERCENT_PER_YEAR" },
        annualPercentageRate: r.interestRateMax,
        accountMinimumInflow: { "@type": "MonetaryAmount", currency: "BDT", value: r.minOpeningBalance },
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
            <span className="font-medium text-ink-600">{t.nav.savings}</span>
          </nav>
          <h1 className="max-w-3xl text-[28px] font-extrabold leading-tight tracking-tight text-ink-900 sm:text-[36px]">
            {t.savings.title}
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-500">{t.savings.subtitle}</p>
        </Container>
      </section>

      <Container className="py-9">
        <Suspense fallback={<div className="p-10 text-center text-ink-400">{t.common.loading}</div>}>
          <SavingsExplorer
            rows={rows}
            t={t}
            locale={locale}
            bnNumerals={bnNumerals}
            initial={{
              q: str(sp.q),
              sort: str(sp.sort),
              segment: str(sp.segment),
              bank: str(sp.bank),
              minRate: str(sp.minRate),
            }}
          />
        </Suspense>
      </Container>
    </>
  );
}

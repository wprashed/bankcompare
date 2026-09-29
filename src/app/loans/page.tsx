import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui";
import { JsonLd } from "@/components/JsonLd";
import { LoanExplorer } from "@/components/LoanExplorer";
import { getI18n } from "@/lib/i18n/server";
import { getLoanRows } from "@/lib/queries";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Best Bank Loans in Bangladesh 2026 — Compare Personal, Home & Auto Rates",
  description:
    "Compare personal loan, home loan and auto loan interest rates from top banks in Bangladesh. Check loan limits, tenures, processing fees and run real-time EMI simulations.",
  alternates: { canonical: "/loans" },
  keywords: [
    "best bank loan Bangladesh",
    "personal loan interest rate Bangladesh",
    "home loan Bangladesh",
    "auto loan Bangladesh",
    "ব্যাংক ঋণ বাংলাদেশ",
  ],
};

export default async function LoansPage() {
  const { t, locale, bnNumerals } = await getI18n();
  const rows = await getLoanRows();

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t.nav.home, item: SITE_URL },
      { "@type": "ListItem", position: 2, name: t.loans.title, item: `${SITE_URL}/loans` },
    ],
  };

  const productsLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Best bank loans in Bangladesh",
    numberOfItems: rows.length,
    itemListElement: rows.slice(0, 20).map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "FinancialProduct",
        name: `${r.bank.name} — ${r.name}`,
        url: `${SITE_URL}/loans`,
        category: "LoanOrCredit",
        provider: { "@type": "BankOrCreditUnion", name: r.bank.name, url: r.bank.website },
        interestRate: { "@type": "QuantitativeValue", value: r.interestRateMin, unitText: "PERCENT_PER_YEAR" },
        annualPercentageRate: r.interestRateMin,
        amount: { "@type": "MonetaryAmount", currency: "BDT", minValue: r.minAmount, maxValue: r.maxAmount },
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
            <span className="font-medium text-ink-600">{t.loans.title}</span>
          </nav>
          <h1 className="max-w-3xl text-[28px] font-extrabold leading-tight tracking-tight text-ink-900 sm:text-[36px]">
            {t.loans.title}
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-500">{t.loans.subtitle}</p>
        </Container>
      </section>

      <Container className="py-9">
        <Suspense fallback={<div className="p-10 text-center text-ink-400">{t.common.loading}</div>}>
          <LoanExplorer rows={rows} t={t} locale={locale} bnNumerals={bnNumerals} />
        </Suspense>
      </Container>
    </>
  );
}

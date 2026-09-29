import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui";
import { JsonLd } from "@/components/JsonLd";
import { FdrExplorer } from "@/components/FdrExplorer";
import { FdrCalculator } from "@/components/FdrCalculator";
import { getI18n } from "@/lib/i18n/server";
import { getFdrOffers } from "@/lib/queries";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Highest FDR Rate in Bangladesh 2026 — Fixed Deposit Rate Comparison",
  description:
    "Compare fixed deposit (FDR) interest rates from the top banks in Bangladesh across 1, 3, 6, 12, 24 and 36 month tenures. See maturity value after 10% source tax.",
  alternates: { canonical: "/fdr" },
  keywords: [
    "highest FDR rate in Bangladesh 2026",
    "fixed deposit rate Bangladesh",
    "FDR interest rate comparison",
    "best FDR bank Bangladesh",
    "এফডিআর হার",
  ],
};

export default async function FdrPage() {
  const { t, locale, bnNumerals } = await getI18n();
  const offers = await getFdrOffers();

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t.nav.home, item: SITE_URL },
      { "@type": "ListItem", position: 2, name: t.fdr.title, item: `${SITE_URL}/fdr` },
    ],
  };

  const oneYear = offers.filter((o) => o.tenureMonths === 12).sort((a, b) => b.rate - a.rate);
  const listLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Highest FDR rates in Bangladesh (1 year)",
    numberOfItems: oneYear.length,
    itemListElement: oneYear.map((o, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "FinancialProduct",
        name: `${o.bank.name} — ${o.name}`,
        category: "Fixed Deposit Receipt",
        provider: { "@type": "BankOrCreditUnion", name: o.bank.name, url: o.bank.website },
        interestRate: { "@type": "QuantitativeValue", value: o.rate, unitText: "PERCENT_PER_YEAR" },
      },
    })),
  };

  return (
    <>
      <JsonLd data={[breadcrumbLd, listLd]} />

      <section className="border-b border-ink-200 bg-gradient-to-b from-brand-50/60 to-white">
        <Container className="py-9 sm:py-12">
          <nav className="mb-4 flex items-center gap-1.5 text-[12.5px] text-ink-400" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-brand-700">
              {t.nav.home}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-ink-600">{t.nav.fdr}</span>
          </nav>
          <h1 className="max-w-3xl text-[28px] font-extrabold leading-tight tracking-tight text-ink-900 sm:text-[36px]">
            {t.fdr.title}
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-500">{t.fdr.subtitle}</p>
        </Container>
      </section>

      <Container className="py-9">
        <FdrExplorer offers={offers} t={t} locale={locale} bnNumerals={bnNumerals} />

        <div className="mt-14">
          <SectionHeading eyebrow={t.nav.calculators} title={t.calc.fdrTitle} subtitle={t.calc.fdrSubtitle} />
          <FdrCalculator offers={offers} t={t} locale={locale} bnNumerals={bnNumerals} />
        </div>
      </Container>
    </>
  );
}

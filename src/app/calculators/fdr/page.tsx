import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui";
import { FdrCalculator } from "@/components/FdrCalculator";
import { JsonLd } from "@/components/JsonLd";
import { getI18n } from "@/lib/i18n/server";
import { getFdrOffers } from "@/lib/queries";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "FDR Calculator Bangladesh — Fixed Deposit Maturity & Tax Calculator",
  description:
    "Calculate your fixed deposit maturity value in Bangladesh, including 10% or 15% source tax on interest. Compare against live FDR rates from 10 banks.",
  alternates: { canonical: "/calculators/fdr" },
  keywords: ["FDR calculator Bangladesh", "fixed deposit calculator BD", "FDR maturity calculator", "এফডিআর ক্যালকুলেটর"],
};

export default async function FdrCalculatorPage() {
  const { t, locale, bnNumerals } = await getI18n();
  const offers = await getFdrOffers();

  const appLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "FDR Calculator Bangladesh",
    url: `${SITE_URL}/calculators/fdr`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "BDT" },
  };

  return (
    <>
      <JsonLd data={appLd} />
      <section className="border-b border-ink-200 bg-gradient-to-b from-brand-50/60 to-white">
        <Container className="py-9 sm:py-12">
          <nav className="mb-4 flex items-center gap-1.5 text-[12.5px] text-ink-400" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-brand-700">
              {t.nav.home}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-ink-600">{t.calc.fdrTitle}</span>
          </nav>
          <h1 className="text-[28px] font-extrabold leading-tight tracking-tight text-ink-900 sm:text-[36px]">
            {t.calc.fdrTitle}
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-500">{t.calc.fdrSubtitle}</p>
        </Container>
      </section>
      <Container className="py-9">
        <FdrCalculator offers={offers} t={t} locale={locale} bnNumerals={bnNumerals} />
      </Container>
    </>
  );
}

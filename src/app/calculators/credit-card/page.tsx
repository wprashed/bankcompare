import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui";
import { CreditCalculator } from "@/components/CreditCalculator";
import { JsonLd } from "@/components/JsonLd";
import { getI18n } from "@/lib/i18n/server";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Credit Card & Loan Eligibility Calculator Bangladesh — Payoff & Debt Capacity",
  description:
    "Calculate your credit card payoff time, total interest cost, minimum payment traps, and loan eligibility under Bangladesh Bank DBR limits. Free, instant and accurate.",
  alternates: { canonical: "/calculators/credit-card" },
  keywords: [
    "credit card calculator Bangladesh",
    "credit card payoff calculator",
    "loan eligibility calculator Bangladesh",
    "Bangladesh Bank DBR ratio",
    "ক্রেডিট কার্ড ক্যালকুলেটর",
  ],
};

export default async function CreditCalculatorPage() {
  const { t, locale, bnNumerals } = await getI18n();

  const appLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Credit Card & Loan Eligibility Calculator Bangladesh",
    url: `${SITE_URL}/calculators/credit-card`,
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
            <Link href="/calculators/fdr" className="hover:text-brand-700">
              {t.nav.calculators}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-ink-600">{t.creditCalc.title}</span>
          </nav>
          <h1 className="text-[28px] font-extrabold leading-tight tracking-tight text-ink-900 sm:text-[36px]">
            {t.creditCalc.title}
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-500">{t.creditCalc.subtitle}</p>
        </Container>
      </section>
      <Container className="py-9">
        <CreditCalculator t={t} locale={locale} bnNumerals={bnNumerals} />
      </Container>
    </>
  );
}

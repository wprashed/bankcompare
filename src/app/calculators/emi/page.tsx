import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui";
import { EmiCalculator } from "@/components/EmiCalculator";
import { JsonLd } from "@/components/JsonLd";
import { getI18n } from "@/lib/i18n/server";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "EMI Calculator Bangladesh — Home, Car & Personal Loan Instalments",
  description:
    "Calculate monthly EMI for home loans, car loans, personal loans and SME loans in Bangladesh on a reducing-balance basis. See total interest and payment breakdown.",
  alternates: { canonical: "/calculators/emi" },
  keywords: ["EMI calculator Bangladesh", "loan interest rate Bangladesh", "home loan EMI BD", "ইএমআই ক্যালকুলেটর"],
};

export default async function EmiCalculatorPage() {
  const { t, locale, bnNumerals } = await getI18n();

  const appLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "EMI Calculator Bangladesh",
    url: `${SITE_URL}/calculators/emi`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "BDT" },
  };

  return (
    <>
      <JsonLd data={appLd} />
      <section className="border-b border-ink-200 bg-gradient-to-b from-flag-50/50 to-white">
        <Container className="py-9 sm:py-12">
          <nav className="mb-4 flex items-center gap-1.5 text-[12.5px] text-ink-400" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-brand-700">
              {t.nav.home}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-ink-600">{t.calc.emiTitle}</span>
          </nav>
          <h1 className="text-[28px] font-extrabold leading-tight tracking-tight text-ink-900 sm:text-[36px]">
            {t.calc.emiTitle}
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-500">{t.calc.emiSubtitle}</p>
        </Container>
      </section>
      <Container className="py-9">
        <EmiCalculator t={t} locale={locale} bnNumerals={bnNumerals} />
      </Container>
    </>
  );
}

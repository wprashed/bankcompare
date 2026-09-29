import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { getI18n } from "@/lib/i18n/server";
import { formatDate } from "@/lib/format";
import { RATES_VERIFIED_ON, SITE_URL } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const bengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bengali",
  display: "swap",
});


export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "BankBhai — Smart Bank Rate, Credit Card & Loan Comparison in Bangladesh",
    template: "%s | BankBhai",
  },
  description:
    "Compare savings account interest rates, FDR rates, loans and credit cards from the top banks in Bangladesh. Free, unbiased and updated with published bank rates.",
  keywords: [
    "best savings account in Bangladesh",
    "highest FDR rate in Bangladesh 2026",
    "credit card comparison Bangladesh",
    "loan interest rate Bangladesh",
    "best DPS rate Bangladesh",
    "bKash vs Nagad comparison",
    "bank interest rate Bangladesh",
    "fixed deposit rate BD",
    "ব্যাংক সুদের হার",
    "এফডিআর হার বাংলাদেশ",
  ],
  authors: [{ name: "BankBhai" }],
  alternates: {
    canonical: "/",
    languages: { en: "/", bn: "/" },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["bn_BD"],
    url: SITE_URL,
    siteName: "BankBhai",
    title: "BankBhai — Smart Bank Rate, Credit Card & Loan Comparison in Bangladesh",
    description:
      "Compare savings account interest rates, FDR rates, loans and credit cards from the top banks in Bangladesh.",
  },
  twitter: {
    card: "summary_large_image",
    title: "BankBhai — Compare bank rates in Bangladesh",
    description: "Free, unbiased comparison of savings accounts, FDR rates and loans in Bangladesh.",
  },
  robots: { index: true, follow: true },
  category: "finance",
};

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { locale, t, bnNumerals } = await getI18n();

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BankBhai",
    url: SITE_URL,
    description:
      "Independent comparison service for Bangladeshi banking products — savings accounts, fixed deposits (FDR), loans and cards.",
    areaServed: { "@type": "Country", name: "Bangladesh" },
    knowsLanguage: ["en", "bn"],
  };

  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "BankBhai",
    url: SITE_URL,
    inLanguage: locale === "bn" ? "bn-BD" : "en-BD",
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/savings?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang={locale} className={`${inter.variable} ${bengali.variable}`}>
      <body className="min-h-screen bg-white font-sans antialiased">
        <JsonLd data={[organizationLd, websiteLd]} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Header locale={locale} bnNumerals={bnNumerals} t={{ nav: t.nav, brand: t.brand }} />
        <main id="main">{children}</main>
        <Footer t={t} verifiedLabel={`${t.common.lastVerified}: ${formatDate(RATES_VERIFIED_ON, { bnNumerals })}`} />
      </body>
    </html>
  );
}

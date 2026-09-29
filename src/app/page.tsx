import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  BadgeCheck,
  Calculator,
  ChevronRight,
  CreditCard,
  Banknote,
  LineChart,
  PiggyBank,
  Plane,
  Scale,
  Shield,
  Star,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { Badge, Button, Container, SectionHeading, Stat } from "@/components/ui";
import { BankLogo } from "@/components/BankLogo";
import { RateTicker } from "@/components/RateTicker";
import { JsonLd } from "@/components/JsonLd";
import { getI18n } from "@/lib/i18n/server";
import {
  getBanks,
  getRateChanges,
  getStats,
  getTopCreditCards,
  getTopFdrByTenure,
  getTopLoans,
  getTopSavings,
} from "@/lib/queries";
import { formatBDT, formatBDTCompact, formatNumber, formatPercent, fdrSimpleMaturity, tenureLabel } from "@/lib/format";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Best Bank Rates in Bangladesh 2026 — Savings, FDR, Loans & Cards",
  description:
    "Compare the best savings account interest rates, highest FDR rates, top credit cards and bank loans in Bangladesh from leading banks. Free FDR, EMI and credit calculators.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const { t, locale, bnNumerals } = await getI18n();
  const nf = { bnNumerals };
  const [topFdr, topSavings, topCards, topLoans, banks, changes, stats] = await Promise.all([
    getTopFdrByTenure(12, 6),
    getTopSavings(6),
    getTopCreditCards(3),
    getTopLoans(3),
    getBanks(),
    getRateChanges(7),
    getStats(),
  ]);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Highest FDR rates in Bangladesh (1 year)",
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    numberOfItems: topFdr.length,
    itemListElement: topFdr.map((o, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "FinancialProduct",
        name: `${o.bank.name} — ${o.name}`,
        category: "Fixed Deposit",
        url: `${SITE_URL}/fdr`,
        provider: { "@type": "BankOrCreditUnion", name: o.bank.name, url: o.bank.website },
        interestRate: { "@type": "QuantitativeValue", value: o.rate, unitText: "PERCENT_PER_YEAR" },
        feesAndCommissionsSpecification: `Minimum deposit BDT ${o.minDeposit}`,
      },
    })),
  };

  return (
    <>
      <JsonLd data={[faqLd, itemListLd]} />

      {/* ---------------- Hero ---------------- */}
      <section className="hero-grid border-b border-ink-200">
        <Container className="py-14 sm:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <Badge tone="flag" className="mb-5 px-3 py-1 text-[11.5px]">
                <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-flag-500" />
                {t.home.heroBadge}
              </Badge>
              <h1 className="text-[34px] font-extrabold leading-[1.1] tracking-tight text-ink-900 sm:text-[46px]">
                {t.home.heroTitle}{" "}
                <span className="relative whitespace-nowrap text-brand-600">
                  {t.home.heroTitleAccent}
                  <svg
                    className="absolute -bottom-1.5 left-0 h-2.5 w-full text-flag-400/70"
                    viewBox="0 0 200 8"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path d="M0 6 C 50 1, 150 1, 200 6" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-ink-500">{t.home.heroSubtitle}</p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button href="/savings" size="lg">
                  {t.home.ctaSavings}
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button href="/fdr" size="lg" variant="secondary">
                  {t.home.ctaFdr}
                </Button>
              </div>

              <dl className="mt-10 grid max-w-lg grid-cols-2 gap-6 border-t border-ink-200 pt-7 sm:grid-cols-4">
                <Stat value={formatNumber(stats.banks, nf)} label={t.home.statBanks} />
                <Stat value={formatNumber(stats.products, nf)} label={t.home.statProducts} />
                <Stat value={formatNumber(stats.slabs, nf)} label={t.home.statRates} />
                <Stat value={formatPercent(stats.maxFdrRate, nf)} label={t.home.statTopFdr} accent />
              </dl>
            </div>

            {/* Quick-pick card */}
            <div className="card overflow-hidden p-1.5 shadow-[0_24px_60px_-30px_rgba(0,106,78,0.45)]">
              <div className="rounded-[1.05rem] bg-ink-900 p-5 text-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-[13px] font-bold uppercase tracking-wider text-brand-200">{t.home.quickTitle}</h2>
                  <Scale className="h-4 w-4 text-brand-300" />
                </div>
                <div className="mt-4 grid gap-2">
                  {[
                    { href: "/savings", icon: PiggyBank, label: t.nav.savings, meta: `${formatNumber(stats.savings, nf)} ${t.common.products}`, rate: formatPercent(stats.maxSavingsRate, nf) },
                    { href: "/fdr", icon: LineChart, label: t.nav.fdr, meta: `${formatNumber(stats.slabs, nf)} ${t.home.statRates.toLowerCase()}`, rate: formatPercent(stats.maxFdrRate, nf) },
                    { href: "/cards", icon: CreditCard, label: t.nav.cards, meta: `${formatNumber(stats.cards, nf)} ${t.common.products}`, rate: "0% EMI" },
                    { href: "/deals", icon: Sparkles, label: locale === "bn" ? "কার্ড ডিলস ও বুফে" : "Deals & B1G1 Buffets", meta: "Westin, Le Méridien, Radisson", rate: "B1G1" },
                    { href: "/loans", icon: Banknote, label: t.nav.loans, meta: `${formatNumber(stats.loans, nf)} ${t.common.products}`, rate: `${t.common.from} ${formatPercent(stats.minLoanRate, nf)}` },
                    { href: "/calculators/dps", icon: LineChart, label: locale === "bn" ? "ডিপিএস ক্যালকুলেটর" : "DPS Calculator", meta: "After-Tax Payout", rate: "9.75%" },
                    { href: "/cards/matcher", icon: Sparkles, label: locale === "bn" ? "কার্ড ম্যাচ কুইজ" : "Card Matcher Quiz", meta: "Find your card in 60s", rate: "Quiz" },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group flex items-center gap-3 rounded-xl bg-white/[0.06] px-3.5 py-2.5 transition-colors hover:bg-white/[0.12]"
                    >
                      <span className="grid h-8.5 w-8.5 shrink-0 place-items-center rounded-lg bg-brand-500/20 text-brand-200">
                        <item.icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13.5px] font-semibold">{item.label}</span>
                        <span className="block truncate text-[11.5px] text-white/50">{item.meta}</span>
                      </span>
                      {item.rate && (
                        <span className="text-[14px] font-extrabold tabular text-brand-300">{item.rate}</span>
                      )}
                      <ChevronRight className="h-4 w-4 shrink-0 text-white/30 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-brand-500/15 px-3.5 py-2.5 text-[12px] text-brand-100">
                  <Shield className="h-3.5 w-3.5 shrink-0" />
                  {locale === "bn"
                    ? "আমানত বীমা: প্রতি ব্যাংকে সর্বোচ্চ ২,০০,০০০ টাকা সুরক্ষিত।"
                    : "Deposit insurance covers up to ৳2,00,000 per bank, per depositor."}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <RateTicker changes={changes} locale={locale} bnNumerals={bnNumerals} label={t.home.tickerTitle} />

      {/* ---------------- Top FDR ---------------- */}
      <section className="py-14 sm:py-16">
        <Container>
          <SectionHeading
            eyebrow={t.nav.fdr}
            title={t.home.topFdrTitle}
            subtitle={t.home.topFdrSubtitle}
            action={
              <Button href="/fdr" variant="secondary" size="sm">
                {t.common.viewAll}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            }
          />

          <div className="card overflow-hidden">
            <div className="hidden bg-ink-50 px-5 py-3 text-[11.5px] font-semibold uppercase tracking-wide text-ink-500 sm:grid sm:grid-cols-[2.2fr_1fr_1fr_1.2fr]">
              <span>{t.common.banks}</span>
              <span className="text-right">{t.fdr.rate}</span>
              <span className="text-right">{t.fdr.minDeposit}</span>
              <span className="text-right">
                {t.fdr.maturity} · {formatBDT(100000, nf)}
              </span>
            </div>
            <ul>
              {topFdr.map((o, i) => {
                const { maturity } = fdrSimpleMaturity(100000, o.rate, 12);
                return (
                  <li
                    key={o.id}
                    className="grid gap-3 border-t border-ink-100 px-5 py-4 transition-colors first:border-t-0 hover:bg-brand-50/40 sm:grid-cols-[2.2fr_1fr_1fr_1.2fr] sm:items-center"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11.5px] font-bold tabular ${
                          i === 0 ? "bg-brand-600 text-white" : "bg-ink-100 text-ink-500"
                        }`}
                      >
                        {formatNumber(i + 1, nf)}
                      </span>
                      <BankLogo initials={o.bank.logoInitials} color={o.bank.brandColor} size={36} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate text-[14px] font-bold text-ink-900">
                            {locale === "bn" ? o.bank.nameBn : o.bank.name}
                          </span>
                          {o.isShariah && <Badge tone="brand">{locale === "bn" ? "শরিয়াহ" : "Shariah"}</Badge>}
                        </div>
                        <div className="truncate text-[12px] text-ink-500">{locale === "bn" ? o.nameBn : o.name}</div>
                      </div>
                    </div>
                    <div className="flex items-baseline justify-between sm:block sm:text-right">
                      <span className="text-[11.5px] text-ink-400 sm:hidden">{t.fdr.rate}</span>
                      <span className="text-[20px] font-extrabold tabular text-brand-600">{formatPercent(o.rate, nf)}</span>
                    </div>
                    <div className="flex items-baseline justify-between text-[13px] tabular text-ink-600 sm:block sm:text-right">
                      <span className="text-[11.5px] text-ink-400 sm:hidden">{t.fdr.minDeposit}</span>
                      {formatBDT(o.minDeposit, nf)}
                    </div>
                    <div className="flex items-baseline justify-between sm:block sm:text-right">
                      <span className="text-[11.5px] text-ink-400 sm:hidden">{t.fdr.maturity}</span>
                      <span className="text-[14px] font-bold tabular text-ink-900">{formatBDT(maturity, nf)}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="border-t border-ink-100 bg-ink-50/60 px-5 py-3 text-[12px] text-ink-500">
              {locale === "bn"
                ? `১ বছর মেয়াদে ${formatBDT(100000, nf)} আমানতে সরল সুদে হিসাব, উৎসে কর বাদে।`
                : `Based on ${formatBDT(100000, nf)} for ${tenureLabel(12, locale, bnNumerals)} at simple interest, before source tax.`}
            </div>
          </div>
        </Container>
      </section>

      {/* ---------------- Best savings ---------------- */}
      <section className="border-y border-ink-200 bg-ink-50/50 py-14 sm:py-16">
        <Container>
          <SectionHeading
            eyebrow={t.nav.savings}
            title={t.home.topSavingsTitle}
            subtitle={t.home.topSavingsSubtitle}
            action={
              <Button href="/savings" variant="secondary" size="sm">
                {t.common.viewAll}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            }
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topSavings.map((s, i) => (
              <article key={s.id} className="card card-hover flex flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <BankLogo initials={s.bank.logoInitials} color={s.bank.brandColor} size={38} />
                    <div className="min-w-0">
                      <div className="truncate text-[13px] font-bold text-ink-900">
                        {locale === "bn" ? s.bank.nameBn : s.bank.shortName}
                      </div>
                      <div className="flex items-center gap-1 text-[11.5px] text-ink-400">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="tabular">{s.bank.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  {i === 0 && <Badge tone="brand">{t.common.best}</Badge>}
                </div>

                <h3 className="mt-3.5 text-[15px] font-bold leading-snug text-ink-900">
                  {locale === "bn" ? s.nameBn : s.name}
                </h3>

                <div className="mt-3 flex items-end gap-2">
                  <span className="text-[30px] font-extrabold leading-none tabular text-brand-600">
                    {formatPercent(s.interestRateMax, nf)}
                  </span>
                  <span className="pb-1 text-[12px] font-medium text-ink-400">{t.common.perYear}</span>
                </div>

                <dl className="mt-4 space-y-1.5 border-t border-ink-100 pt-3.5 text-[12.5px]">
                  <div className="flex justify-between">
                    <dt className="text-ink-500">{t.savings.openingBalance}</dt>
                    <dd className="font-semibold tabular text-ink-800">{formatBDT(s.minOpeningBalance, nf)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-500">{t.savings.maintenanceFee}</dt>
                    <dd className="font-semibold tabular text-ink-800">
                      {s.maintenanceFee ? formatBDT(s.maintenanceFee, nf) : "—"}
                    </dd>
                  </div>
                </dl>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {s.segment !== "GENERAL" && <Badge tone="blue">{t.bank.segment[s.segment]}</Badge>}
                  {s.isShariah && <Badge tone="brand">{t.savings.featureShariah}</Badge>}
                  {s.onlineAccountOpening && <Badge tone="neutral">{t.savings.featureOnline}</Badge>}
                </div>

                <Link
                  href={`/savings?bank=${s.bank.slug}`}
                  className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-brand-700 hover:underline"
                >
                  {t.common.viewDetails}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------- Featured Credit Cards ---------------- */}
      <section className="py-14 sm:py-16">
        <Container>
          <SectionHeading
            eyebrow={t.nav.cards}
            title={locale === "bn" ? "সেরা ক্রেডিট কার্ডসমূহ" : "Featured Credit Cards"}
            subtitle={t.cards.subtitle}
            action={
              <Button href="/cards" variant="secondary" size="sm">
                {t.common.viewAll}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            }
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {topCards.map((card) => (
              <article key={card.id} className="card card-hover flex flex-col justify-between p-5">
                <div>
                  <div
                    className="relative h-36 w-full overflow-hidden rounded-2xl p-4 text-white shadow-md"
                    style={{ background: `linear-gradient(135deg, ${card.cardColor} 0%, #090d16 100%)` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <BankLogo initials={card.bank.logoInitials} color={card.bank.brandColor} size={26} />
                        <span className="text-[11.5px] font-extrabold uppercase text-white/90">
                          {locale === "bn" ? card.bank.nameBn : card.bank.shortName}
                        </span>
                      </div>
                      <span className="rounded bg-white/20 px-2 py-0.5 text-[9.5px] font-extrabold uppercase">
                        {card.network}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                      <div className="min-w-0 pr-2">
                        <div className="truncate text-[13px] font-bold">{locale === "bn" ? card.nameBn : card.name}</div>
                        <div className="text-[10px] font-semibold uppercase text-white/60">
                          {t.bank.tier[card.tier] ?? card.tier}
                        </div>
                      </div>
                      {card.isShariah && (
                        <span className="rounded bg-emerald-500/30 px-1.5 py-0.5 text-[9.5px] font-bold text-emerald-200">
                          {locale === "bn" ? "শরিয়াহ" : "Shariah"}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex items-baseline justify-between">
                    <span className="text-[12px] text-ink-500">{t.cards.annualFee}</span>
                    <span className="text-[18px] font-extrabold tabular text-brand-600">
                      {card.annualFee === 0 ? (locale === "bn" ? "ফ্রি" : "Free") : formatBDT(card.annualFee, nf)}
                    </span>
                  </div>

                  <dl className="mt-3 space-y-1.5 border-t border-ink-100 pt-3 text-[12.5px]">
                    <div className="flex justify-between">
                      <dt className="text-ink-500">{t.cards.apr}</dt>
                      <dd className="font-semibold tabular text-ink-900">
                        {card.interestRateAnnual === 0
                          ? locale === "bn"
                            ? "সুদমুক্ত"
                            : "0% (Ujrah)"
                          : formatPercent(card.interestRateAnnual, nf)}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-ink-500">{t.cards.minIncome}</dt>
                      <dd className="font-semibold tabular text-ink-900">{formatBDT(card.minIncome, nf)}</dd>
                    </div>
                  </dl>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {card.airportLoungeAccess && (
                      <Badge tone="blue">
                        <Plane className="mr-1 h-3 w-3" />
                        {locale === "bn" ? "লাউঞ্জ" : "Lounge"}
                      </Badge>
                    )}
                    {card.zeroPctEmiAvailable && <Badge tone="neutral">0% EMI</Badge>}
                  </div>
                </div>

                <Link
                  href={`/cards?bank=${card.bank.slug}`}
                  className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-brand-700 hover:underline"
                >
                  {t.common.viewDetails}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------- Competitive Loans ---------------- */}
      <section className="border-t border-ink-200 bg-ink-50/50 py-14 sm:py-16">
        <Container>
          <SectionHeading
            eyebrow={t.nav.loans}
            title={locale === "bn" ? "জনপ্রিয় ব্যাংক ঋণসমূহ" : "Competitive Bank Loans"}
            subtitle={t.loans.subtitle}
            action={
              <Button href="/loans" variant="secondary" size="sm">
                {t.common.viewAll}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            }
          />
          <div className="grid gap-5 md:grid-cols-3">
            {topLoans.map((loan) => (
              <article key={loan.id} className="card card-hover flex flex-col justify-between p-5">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BankLogo initials={loan.bank.logoInitials} color={loan.bank.brandColor} size={32} />
                      <span className="text-[12.5px] font-bold text-ink-900">
                        {locale === "bn" ? loan.bank.nameBn : loan.bank.shortName}
                      </span>
                    </div>
                    <Badge tone="blue">{t.loans.types[loan.loanType] ?? loan.loanType}</Badge>
                  </div>

                  <h3 className="mt-3 text-[15px] font-bold text-ink-900">{locale === "bn" ? loan.nameBn : loan.name}</h3>

                  <div className="mt-2.5 flex items-baseline gap-1.5">
                    <span className="text-[24px] font-extrabold tabular text-brand-600">
                      {formatPercent(loan.interestRateMin, nf)}
                    </span>
                    <span className="text-[12px] font-medium text-ink-400">{t.common.perYear}</span>
                  </div>

                  <dl className="mt-3 space-y-1.5 border-t border-ink-100 pt-3 text-[12.5px]">
                    <div className="flex justify-between">
                      <dt className="text-ink-500">{t.loans.loanAmount}</dt>
                      <dd className="font-semibold tabular text-ink-800">
                        {formatBDTCompact(loan.minAmount, { locale, bnNumerals })} –{" "}
                        {formatBDTCompact(loan.maxAmount, { locale, bnNumerals })}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-ink-500">{t.loans.tenure}</dt>
                      <dd className="font-semibold tabular text-ink-800">
                        {formatNumber(loan.minTenureMonths / 12, nf)} – {formatNumber(loan.maxTenureMonths / 12, nf)}{" "}
                        {locale === "bn" ? "বছর" : "Years"}
                      </dd>
                    </div>
                  </dl>
                </div>

                <Link
                  href="/loans"
                  className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-brand-700 hover:underline"
                >
                  {t.common.viewDetails}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------- Calculators ---------------- */}
      <section className="py-14 sm:py-16">
        <Container>
          <SectionHeading eyebrow={t.nav.calculators} title={t.home.calcTitle} subtitle={t.home.calcSubtitle} />
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                href: "/calculators/fdr",
                icon: Calculator,
                title: t.calc.fdrTitle,
                body: t.calc.fdrSubtitle,
                tone: "brand" as const,
              },
              {
                href: "/calculators/emi",
                icon: TrendingUp,
                title: t.calc.emiTitle,
                body: t.calc.emiSubtitle,
                tone: "flag" as const,
              },
              {
                href: "/calculators/credit-card",
                icon: CreditCard,
                title: t.creditCalc.title,
                body: t.creditCalc.subtitle,
                tone: "brand" as const,
              },
            ].map((c) => (
              <Link key={c.href} href={c.href} className="card card-hover group flex flex-col justify-between p-6">
                <div>
                  <span
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${
                      c.tone === "brand" ? "bg-brand-50 text-brand-600" : "bg-flag-50 text-flag-600"
                    }`}
                  >
                    <c.icon className="h-5.5 w-5.5" />
                  </span>
                  <h3 className="mt-4 text-[16px] font-bold text-ink-900">{c.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-ink-500">{c.body}</p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-brand-700">
                  {t.common.apply}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------- Banks ---------------- */}
      <section className="border-y border-ink-200 bg-ink-50/50 py-14 sm:py-16">
        <Container>
          <SectionHeading
            eyebrow={t.nav.banks}
            title={t.home.banksTitle}
            subtitle={t.home.banksSubtitle}
            action={
              <Button href="/banks" variant="secondary" size="sm">
                {t.common.viewAll}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            }
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {banks.map((b) => (
              <Link key={b.id} href={`/banks/${b.slug}`} className="card card-hover flex flex-col items-center gap-2.5 p-4 text-center">
                <BankLogo initials={b.logoInitials} color={b.brandColor} size={42} />
                <span className="text-[12.5px] font-bold leading-tight text-ink-800">
                  {locale === "bn" ? b.nameBn : b.shortName}
                </span>
                {b.bestFdr > 0 && (
                  <span className="text-[11.5px] font-semibold tabular text-brand-600">
                    {t.fdr.rate} {formatPercent(b.bestFdr, nf)}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------- Why us ---------------- */}
      <section className="py-14 sm:py-16">
        <Container>
          <SectionHeading title={t.home.whyTitle} />
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: BadgeCheck, title: t.home.why1Title, body: t.home.why1Body },
              { icon: Calculator, title: t.home.why2Title, body: t.home.why2Body },
              { icon: Shield, title: t.home.why3Title, body: t.home.why3Body },
            ].map((w) => (
              <div key={w.title} className="card p-6">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                  <w.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-[15.5px] font-bold text-ink-900">{w.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-500">{w.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section id="faq" className="border-t border-ink-200 bg-ink-50/50 py-14 sm:py-16">
        <Container className="max-w-3xl">
          <SectionHeading title={t.home.faqTitle} />
          <div className="space-y-3">
            {t.faq.map((f) => (
              <details key={f.q} className="card group p-5 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-[15px] font-semibold text-ink-900">
                  {f.q}
                  <ChevronRight className="h-4 w-4 shrink-0 text-ink-400 transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-3 text-[14px] leading-relaxed text-ink-600">{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

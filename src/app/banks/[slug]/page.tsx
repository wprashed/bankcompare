import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, ChevronRight, ExternalLink, Globe, MapPin, Smartphone, Star, Plane, Sparkles } from "lucide-react";
import { Badge, Button, Container, SectionHeading } from "@/components/ui";
import { BankLogo } from "@/components/BankLogo";
import { JsonLd } from "@/components/JsonLd";
import { getI18n } from "@/lib/i18n/server";
import { prisma } from "@/lib/prisma";
import { formatBDT, formatNumber, formatPercent, tenureLabel } from "@/lib/format";
import { SITE_URL } from "@/lib/site";

export async function generateStaticParams() {
  const banks = await prisma.bank.findMany({ select: { slug: true } });
  return banks.map((b) => ({ slug: b.slug }));
}

async function getBank(slug: string) {
  return prisma.bank.findUnique({
    where: { slug },
    include: {
      savingsAccounts: { where: { isActive: true }, orderBy: { interestRateMax: "desc" } },
      fdrProducts: { where: { isActive: true }, include: { rates: { orderBy: { tenureMonths: "asc" } } } },
      creditCards: { where: { isActive: true }, orderBy: [{ popularity: "desc" }, { annualFee: "asc" }] },
      loans: { where: { isActive: true }, orderBy: { interestRateMin: "asc" } },
    },
  });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const bank = await getBank(slug);
  if (!bank) return { title: "Bank not found" };
  const best = Math.max(0, ...bank.fdrProducts.flatMap((p) => p.rates.map((r) => r.rate)));
  return {
    title: `${bank.name} — Savings & FDR Interest Rates ${new Date().getFullYear()}`,
    description: `${bank.name} savings account and fixed deposit rates. Top FDR rate ${best}% p.a. Compare with other banks in Bangladesh.`,
    alternates: { canonical: `/banks/${bank.slug}` },
  };
}

export default async function BankPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { t, locale, bnNumerals } = await getI18n();
  const bank = await getBank(slug);
  if (!bank) notFound();
  const nf = { bnNumerals };

  const name = locale === "bn" ? bank.nameBn : bank.name;
  const description = locale === "bn" ? bank.descriptionBn : bank.description;

  const bankLd = {
    "@context": "https://schema.org",
    "@type": "BankOrCreditUnion",
    name: bank.name,
    alternateName: bank.nameBn,
    url: bank.website,
    foundingDate: String(bank.establishedYear),
    address: { "@type": "PostalAddress", addressLocality: bank.headquarters, addressCountry: "BD" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: bank.rating,
      reviewCount: bank.reviewCount,
      bestRating: 5,
    },
    sameAs: [bank.website],
    subjectOf: { "@type": "WebPage", url: `${SITE_URL}/banks/${bank.slug}` },
  };

  return (
    <>
      <JsonLd data={bankLd} />

      <section className="border-b border-ink-200 bg-gradient-to-b from-brand-50/60 to-white">
        <Container className="py-9 sm:py-12">
          <nav className="mb-5 flex items-center gap-1.5 text-[12.5px] text-ink-400" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-brand-700">
              {t.nav.home}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/banks" className="hover:text-brand-700">
              {t.nav.banks}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-ink-600">{bank.shortName}</span>
          </nav>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <BankLogo initials={bank.logoInitials} color={bank.brandColor} size={64} />
            <div className="flex-1">
              <h1 className="text-[26px] font-extrabold leading-tight tracking-tight text-ink-900 sm:text-[34px]">{name}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge tone={bank.isShariah ? "brand" : "neutral"}>{t.bank.category[bank.category]}</Badge>
                <span className="inline-flex items-center gap-1 text-[13px] text-ink-500">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold tabular text-ink-800">{bank.rating.toFixed(1)}</span>
                  <span className="tabular">
                    ({formatNumber(bank.reviewCount, nf)} {t.bank.reviews})
                  </span>
                </span>
              </div>
              <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-ink-500">{description}</p>
            </div>
            <Button href={bank.website} external variant="secondary">
              {t.bank.visitSite}
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </div>

          <dl className="mt-7 grid grid-cols-2 gap-4 border-t border-ink-200 pt-6 sm:grid-cols-5">
            <Fact icon={Building2} label={t.bank.established} value={String(bank.establishedYear)} bn={bnNumerals} />
            <Fact icon={MapPin} label={t.bank.branches} value={formatNumber(bank.branchCount, nf)} />
            <Fact icon={Globe} label={t.bank.atms} value={formatNumber(bank.atmCount, nf)} />
            <Fact icon={Smartphone} label={t.bank.app} value={bank.mobileAppName ?? "—"} />
            <Fact icon={Building2} label={t.bank.swift} value={bank.swiftCode ?? "—"} />
          </dl>
        </Container>
      </section>

      <Container className="py-10">
        {/* Savings */}
        <SectionHeading eyebrow={t.nav.savings} title={t.savings.title} />
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[620px] border-collapse text-sm">
            <thead>
              <tr className="bg-ink-50 text-left text-[11.5px] uppercase tracking-wide text-ink-500">
                <th className="px-4 py-3 font-semibold">{t.common.products}</th>
                <th className="px-4 py-3 text-right font-semibold">{t.savings.interestRate}</th>
                <th className="px-4 py-3 text-right font-semibold">{t.savings.openingBalance}</th>
                <th className="px-4 py-3 text-right font-semibold">{t.savings.maintenanceFee}</th>
                <th className="px-4 py-3 font-semibold">{t.savings.payout}</th>
              </tr>
            </thead>
            <tbody>
              {bank.savingsAccounts.map((s) => (
                <tr key={s.id} className="border-t border-ink-100">
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-ink-900">{locale === "bn" ? s.nameBn : s.name}</div>
                    <div className="mt-0.5 flex flex-wrap gap-1.5">
                      {s.segment !== "GENERAL" && <Badge tone="blue">{t.bank.segment[s.segment]}</Badge>}
                      {s.isShariah && <Badge tone="brand">{t.savings.featureShariah}</Badge>}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right text-[16px] font-extrabold tabular text-brand-600">
                    {formatPercent(s.interestRateMax, nf)}
                  </td>
                  <td className="px-4 py-3.5 text-right tabular text-ink-700">{formatBDT(s.minOpeningBalance, nf)}</td>
                  <td className="px-4 py-3.5 text-right tabular text-ink-700">
                    {s.maintenanceFee ? formatBDT(s.maintenanceFee, nf) : "—"}
                  </td>
                  <td className="px-4 py-3.5 text-ink-700">{t.bank.payout[s.interestPayout]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FDR */}
        <div className="mt-12">
          <SectionHeading eyebrow={t.nav.fdr} title={t.fdr.title} />
          <div className="grid gap-4 lg:grid-cols-2">
            {bank.fdrProducts.map((p) => (
              <div key={p.id} className="card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[15px] font-bold text-ink-900">{locale === "bn" ? p.nameBn : p.name}</h3>
                    <p className="mt-1 text-[12.5px] text-ink-500">
                      {t.fdr.minDeposit}: <span className="font-semibold tabular">{formatBDT(p.minDeposit, nf)}</span>
                      {p.loanAgainstFdrPct ? (
                        <>
                          {" · "}
                          {t.fdr.loanAgainst}: <span className="font-semibold tabular">{formatPercent(p.loanAgainstFdrPct, nf)}</span>
                        </>
                      ) : null}
                    </p>
                  </div>
                  {p.isShariah && <Badge tone="brand">{t.savings.featureShariah}</Badge>}
                </div>
                <ul className="mt-4 divide-y divide-ink-100">
                  {p.rates.map((r) => (
                    <li key={r.id} className="flex items-center justify-between py-2">
                      <span className="text-[13px] text-ink-600">{tenureLabel(r.tenureMonths, locale, bnNumerals)}</span>
                      <span className="text-[15px] font-bold tabular text-brand-600">{formatPercent(r.rate, nf)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Credit Cards */}
        {bank.creditCards.length > 0 && (
          <div className="mt-12">
            <SectionHeading eyebrow={t.nav.cards} title={t.cards.title} />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {bank.creditCards.map((c) => (
                <div key={c.id} className="card p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="rounded bg-ink-100 px-2 py-0.5 text-[10px] font-bold uppercase text-ink-700">
                        {c.network} · {t.bank.tier[c.tier] ?? c.tier}
                      </span>
                      <h3 className="mt-2 text-[15px] font-bold text-ink-900">{locale === "bn" ? c.nameBn : c.name}</h3>
                    </div>
                    {c.isShariah && <Badge tone="brand">{locale === "bn" ? "শরিয়াহ" : "Shariah"}</Badge>}
                  </div>

                  <div className="mt-3 flex items-baseline justify-between border-t border-ink-100 pt-3">
                    <span className="text-[12px] text-ink-500">{t.cards.annualFee}</span>
                    <span className="text-[17px] font-extrabold tabular text-brand-600">
                      {c.annualFee === 0 ? (locale === "bn" ? "ফ্রি" : "Free") : formatBDT(c.annualFee, nf)}
                    </span>
                  </div>

                  {c.feeWaiverCondition && (
                    <div className="mt-1 flex items-center gap-1 text-[11.5px] text-emerald-700">
                      <Sparkles className="h-3 w-3 shrink-0 text-amber-500" />
                      <span className="truncate">{locale === "bn" ? c.feeWaiverConditionBn : c.feeWaiverCondition}</span>
                    </div>
                  )}

                  <dl className="mt-3 space-y-1 text-[12px]">
                    <div className="flex justify-between">
                      <dt className="text-ink-500">{t.cards.apr}</dt>
                      <dd className="font-semibold tabular text-ink-900">
                        {c.interestRateAnnual === 0
                          ? locale === "bn"
                            ? "সুদমুক্ত"
                            : "0% (Ujrah)"
                          : formatPercent(c.interestRateAnnual, nf)}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-ink-500">{t.cards.minIncome}</dt>
                      <dd className="font-semibold tabular text-ink-900">{formatBDT(c.minIncome, nf)}</dd>
                    </div>
                  </dl>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {c.airportLoungeAccess && (
                      <Badge tone="blue">
                        <Plane className="mr-1 h-3 w-3" />
                        {locale === "bn" ? "লাউঞ্জ সুবিধা" : "Lounge"}
                      </Badge>
                    )}
                    {c.zeroPctEmiAvailable && (
                      <Badge tone="neutral">0% EMI</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loans */}
        {bank.loans.length > 0 && (
          <div className="mt-12">
            <SectionHeading eyebrow={t.nav.loans} title={t.loans.title} />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {bank.loans.map((l) => (
                <div key={l.id} className="card p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Badge tone="blue" className="text-[10.5px]">
                        {t.loans.types[l.loanType] ?? l.loanType}
                      </Badge>
                      <h3 className="mt-2 text-[15px] font-bold text-ink-900">{locale === "bn" ? l.nameBn : l.name}</h3>
                    </div>
                    {l.isShariah && <Badge tone="brand">{locale === "bn" ? "শরিয়াহ" : "Shariah"}</Badge>}
                  </div>

                  <div className="mt-3 flex items-baseline gap-1.5 border-t border-ink-100 pt-3">
                    <span className="text-[20px] font-extrabold tabular text-brand-600">
                      {formatPercent(l.interestRateMin, nf)}
                    </span>
                    {l.interestRateMax > l.interestRateMin && (
                      <span className="text-[13px] font-semibold tabular text-ink-400">
                        – {formatPercent(l.interestRateMax, nf)}
                      </span>
                    )}
                    <span className="text-[11.5px] font-medium text-ink-500">{t.common.perYear}</span>
                  </div>

                  <dl className="mt-3 space-y-1 text-[12px]">
                    <div className="flex justify-between">
                      <dt className="text-ink-500">{t.loans.loanAmount}</dt>
                      <dd className="font-semibold tabular text-ink-900">
                        {formatBDT(l.minAmount, nf)} – {formatBDT(l.maxAmount, nf)}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-ink-500">{t.loans.tenure}</dt>
                      <dd className="font-semibold tabular text-ink-900">
                        {formatNumber(l.minTenureMonths / 12, nf)} – {formatNumber(l.maxTenureMonths / 12, nf)}{" "}
                        {locale === "bn" ? "বছর" : "Years"}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-ink-500">{t.loans.minIncome}</dt>
                      <dd className="font-semibold tabular text-ink-900">{formatBDT(l.minIncome, nf)}</dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 flex flex-wrap gap-3">
          <Button href="/savings">{t.home.ctaSavings}</Button>
          <Button href="/fdr" variant="secondary">
            {t.home.ctaFdr}
          </Button>
          {bank.creditCards.length > 0 && (
            <Button href={`/cards?bank=${bank.slug}`} variant="secondary">
              {t.nav.cards}
            </Button>
          )}
          {bank.loans.length > 0 && (
            <Button href="/loans" variant="secondary">
              {t.nav.loans}
            </Button>
          )}
        </div>
      </Container>
    </>
  );
}

function Fact({
  icon: Icon,
  label,
  value,
  bn,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  bn?: boolean;
}) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-[11.5px] font-medium uppercase tracking-wide text-ink-400">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </dt>
      <dd className="mt-1 text-[15px] font-bold tabular text-ink-900">{bn ? value : value}</dd>
    </div>
  );
}

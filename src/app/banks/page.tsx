import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronRight, Star } from "lucide-react";
import { Badge, Container } from "@/components/ui";
import { BankLogo } from "@/components/BankLogo";
import { getI18n } from "@/lib/i18n/server";
import { getBanks } from "@/lib/queries";
import { formatNumber, formatPercent } from "@/lib/format";

export const metadata: Metadata = {
  title: "Banks in Bangladesh — Rates, Branches & Products Compared",
  description:
    "Profiles of the top banks in Bangladesh: savings and FDR rates, branch and ATM counts, mobile apps and customer ratings.",
  alternates: { canonical: "/banks" },
};

export default async function BanksPage() {
  const { t, locale, bnNumerals } = await getI18n();
  const banks = await getBanks();
  const nf = { bnNumerals };

  return (
    <>
      <section className="border-b border-ink-200 bg-gradient-to-b from-brand-50/60 to-white">
        <Container className="py-9 sm:py-12">
          <nav className="mb-4 flex items-center gap-1.5 text-[12.5px] text-ink-400" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-brand-700">
              {t.nav.home}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-ink-600">{t.nav.banks}</span>
          </nav>
          <h1 className="text-[28px] font-extrabold leading-tight tracking-tight text-ink-900 sm:text-[36px]">
            {t.home.banksTitle}
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-500">{t.home.banksSubtitle}</p>
        </Container>
      </section>

      <Container className="py-9">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {banks.map((b) => (
            <Link key={b.id} href={`/banks/${b.slug}`} className="card card-hover flex flex-col p-5">
              <div className="flex items-start gap-3">
                <BankLogo initials={b.logoInitials} color={b.brandColor} size={46} />
                <div className="min-w-0 flex-1">
                  <h2 className="text-[15px] font-bold leading-tight text-ink-900">
                    {locale === "bn" ? b.nameBn : b.name}
                  </h2>
                  <div className="mt-1 flex items-center gap-1.5 text-[12px] text-ink-500">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="tabular">{b.rating.toFixed(1)}</span>
                    <span className="text-ink-300">·</span>
                    <span className="tabular">
                      {formatNumber(b.reviewCount, nf)} {t.bank.reviews}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge tone={b.isShariah ? "brand" : "neutral"}>{t.bank.category[b.category] ?? b.category}</Badge>
                {b.bestFdr > 0 && <Badge tone="flag">FDR {formatPercent(b.bestFdr, nf)}</Badge>}
              </div>

              <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-ink-100 pt-3.5 text-center">
                <div>
                  <dt className="text-[11px] text-ink-400">{t.bank.branches}</dt>
                  <dd className="text-[13px] font-bold tabular text-ink-800">{formatNumber(b.branchCount, nf)}</dd>
                </div>
                <div>
                  <dt className="text-[11px] text-ink-400">{t.bank.atms}</dt>
                  <dd className="text-[13px] font-bold tabular text-ink-800">{formatNumber(b.atmCount, nf)}</dd>
                </div>
                <div>
                  <dt className="text-[11px] text-ink-400">{t.bank.products}</dt>
                  <dd className="text-[13px] font-bold tabular text-ink-800">
                    {formatNumber(b.savingsCount + b.fdrCount, nf)}
                  </dd>
                </div>
              </dl>

              <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-brand-700">
                {t.common.viewDetails}
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
}

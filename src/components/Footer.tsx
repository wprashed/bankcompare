import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Container } from "./ui";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function Footer({ t, verifiedLabel }: { t: Dictionary; verifiedLabel: string }) {
  const year = new Date().getFullYear();
  return (
    <footer className="no-print mt-20 border-t border-ink-200 bg-ink-50/60">
      <Container className="py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600">
                <span className="h-3.5 w-3.5 rounded-full bg-flag-500" />
              </span>
              <span className="text-[17px] font-extrabold tracking-tight text-ink-900">
                {t.brand.name}
                <span className="text-brand-600">{t.brand.suffix}</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-[13.5px] leading-relaxed text-ink-500">{t.footer.aboutBody}</p>
            <p className="mt-4 text-[12.5px] font-medium text-ink-400">{verifiedLabel}</p>
          </div>

          <FooterCol
            title={t.footer.products}
            links={[
              { href: "/savings", label: t.nav.savings },
              { href: "/fdr", label: t.nav.fdr },
              { href: "/cards", label: t.nav.cards },
              { href: "/loans", label: t.nav.loans },
              { href: "/banks", label: t.nav.banks },
            ]}
          />
          <FooterCol
            title={t.footer.tools}
            links={[
              { href: "/calculators/fdr", label: t.nav.fdrCalculator },
              { href: "/calculators/emi", label: t.nav.emiCalculator },
              { href: "/calculators/credit-card", label: t.nav.creditCalculator },
            ]}
          />
          <FooterCol
            title={t.footer.company}
            links={[
              { href: "/#faq", label: t.home.faqTitle },
              { href: "/privacy", label: t.footer.privacy },
              { href: "/terms", label: t.footer.terms },
            ]}
          />
        </div>

        <div className="mt-10 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
          <AlertTriangle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-600" />
          <p className="text-[13px] leading-relaxed text-amber-900">
            <span className="font-bold">{t.footer.disclaimerTitle}: </span>
            {t.footer.disclaimerBody}
          </p>
        </div>

        <div className="mt-8 border-t border-ink-200 pt-6 text-[13px] text-ink-400">
          © {year} {t.brand.name}
          {t.brand.suffix}. {t.footer.rights}
        </div>
      </Container>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h3 className="text-[13px] font-bold uppercase tracking-wider text-ink-800">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link href={l.href} className="text-[14px] text-ink-500 transition-colors hover:text-brand-700">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

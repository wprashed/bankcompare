import Link from "next/link";
import { Compass } from "lucide-react";
import { Button, Container } from "@/components/ui";
import { getI18n } from "@/lib/i18n/server";

export default async function NotFound() {
  const { t, locale } = await getI18n();
  const bn = locale === "bn";

  return (
    <Container className="grid min-h-[60vh] max-w-2xl place-items-center py-16 text-center">
      <div>
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
          <Compass className="h-6 w-6" />
        </span>
        <p className="mt-6 text-[13px] font-bold uppercase tracking-[0.18em] text-flag-500">404</p>
        <h1 className="mt-2 text-[30px] font-extrabold tracking-tight text-ink-900 sm:text-[36px]">
          {bn ? "পাতাটি খুঁজে পাওয়া যায়নি" : "We couldn't find that page"}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-ink-500">
          {bn
            ? "লিংকটি পুরোনো হতে পারে অথবা পণ্যটি আর তালিকায় নেই। নিচের যেকোনো তুলনা থেকে শুরু করুন।"
            : "The link may be out of date, or the product is no longer listed. Start from one of the comparisons below."}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button href="/savings">{t.nav.savings}</Button>
          <Button href="/fdr" variant="secondary">
            {t.nav.fdr}
          </Button>
          <Button href="/banks" variant="secondary">
            {t.nav.banks}
          </Button>
        </div>
        <Link href="/" className="mt-6 inline-block text-[13.5px] font-semibold text-brand-700 hover:underline">
          ← {t.nav.home}
        </Link>
      </div>
    </Container>
  );
}

import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { getI18n } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms governing the use of BankCompare BD.",
  alternates: { canonical: "/terms" },
};

export default async function TermsPage() {
  const { t, locale } = await getI18n();
  const bn = locale === "bn";
  return (
    <Container className="max-w-3xl py-12">
      <h1 className="text-[30px] font-extrabold tracking-tight text-ink-900">{t.footer.terms}</h1>
      <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-ink-600">
        <p>{t.footer.disclaimerBody}</p>
        <p>
          {bn
            ? "প্রকাশিত হার ব্যাংকের নিজস্ব তালিকা থেকে সংগৃহীত এবং যাচাইয়ের তারিখসহ দেওয়া হয়। ব্যাংক যেকোনো সময় হার পরিবর্তন করতে পারে।"
            : "Rates are compiled from banks' own published schedules and stamped with a verification date. Banks may change rates at any time without notice."}
        </p>
        <p>
          {bn
            ? "এই সাইটের তথ্যের ভিত্তিতে নেওয়া কোনো সিদ্ধান্তের দায় ব্যবহারকারীর।"
            : "Any decision you make based on information from this site remains your own responsibility."}
        </p>
      </div>
    </Container>
  );
}

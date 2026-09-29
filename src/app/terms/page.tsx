import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { getI18n } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Terms of Service | BankBhai",
  description: "Terms governing the use of BankBhai financial comparison platform.",
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
            ? "প্রকাশিত হার ব্যাংকের নিজস্ব তালিকা থেকে সংগৃহীত এবং যাচাইয়ের তারিখসহ দেওয়া হয়। ব্যাংক যেকোনো সময় তাদের সুদ হার ও অফার পরিবর্তন করতে পারে।"
            : "Rates are compiled from banks' own published schedules and stamped with a verification date. Banks may revise rates at any time in accordance with Bangladesh Bank policies."}
        </p>
        <p>
          {bn
            ? "এই সাইটের তথ্যের ভিত্তিতে নেওয়া কোনো সিদ্ধান্তের জন্য সংশ্লিষ্ট আর্থিক প্রতিষ্ঠানের সাথে চূড়ান্ত চুক্তি যাচাই করার পরামর্শ দেওয়া হচ্ছে।"
            : "Any financial decision made based on the aggregator data remains subject to direct verification with the respective bank."}
        </p>
      </div>
    </Container>
  );
}

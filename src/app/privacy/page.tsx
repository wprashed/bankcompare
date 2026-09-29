import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { getI18n } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How BankCompare BD handles your data.",
  alternates: { canonical: "/privacy" },
};

export default async function PrivacyPage() {
  const { t, locale } = await getI18n();
  const bn = locale === "bn";
  return (
    <Container className="max-w-3xl py-12">
      <h1 className="text-[30px] font-extrabold tracking-tight text-ink-900">{t.footer.privacy}</h1>
      <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-ink-600">
        <p>
          {bn
            ? "ব্যাংককম্পেয়ার বিডি ব্যবহারের জন্য কোনো অ্যাকাউন্ট খোলার প্রয়োজন নেই এবং আমরা আপনার আর্থিক তথ্য সংগ্রহ করি না। ক্যালকুলেটরে দেওয়া সব সংখ্যা শুধুমাত্র আপনার ব্রাউজারে প্রক্রিয়া করা হয়।"
            : "BankCompare BD does not require an account and we do not collect your financial information. Everything you type into our calculators is processed in your browser only."}
        </p>
        <p>
          {bn
            ? "ভাষা পছন্দ মনে রাখতে আমরা শুধুমাত্র প্রয়োজনীয় কুকি ব্যবহার করি। কোনো বিজ্ঞাপন ট্র্যাকার নেই।"
            : "We use a single functional cookie to remember your language preference. There are no advertising trackers."}
        </p>
        <p>
          {bn
            ? "আমরা ব্যাংক নই এবং কোনো আর্থিক পণ্য বিক্রি করি না। বাহ্যিক লিংকগুলো সংশ্লিষ্ট ব্যাংকের নিজস্ব ওয়েবসাইটে নিয়ে যায়।"
            : "We are not a bank and we do not sell financial products. Outbound links take you to each bank's own website."}
        </p>
      </div>
    </Container>
  );
}

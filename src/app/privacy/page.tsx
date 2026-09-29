import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { getI18n } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Privacy Policy | BankBhai",
  description: "How BankBhai handles your data.",
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
            ? "ব্যাংকভাই ব্যবহারের জন্য কোনো অ্যাকাউন্ট খোলার বাধ্যবাধকতা নেই এবং আমরা আপনার সংবেদনশীল আর্থিক তথ্য সংগ্রহ করি না। ক্যালকুলেটরে দেওয়া সব সংখ্যা শুধুমাত্র আপনার নিজস্ব ব্রাউজারে সুরক্ষিতভাবে প্রক্রিয়া করা হয়।"
            : "BankBhai does not require an account and we do not collect your personal financial passwords or bank credentials. Everything you type into our calculators is processed client-side in your browser only."}
        </p>
        <p>
          {bn
            ? "ভাষা ও সংখ্যার পছন্দ মনে রাখতে আমরা শুধুমাত্র প্রয়োজনীয় কার্যকারী কুকি ব্যবহার করি। কোনো তৃতীয় পক্ষের বিজ্ঞাপন ট্র্যাকার নেই।"
            : "We use functional cookies to remember your language and numeral preferences. There are no intrusive third-party advertising trackers."}
        </p>
        <p>
          {bn
            ? "আমরা ব্যাংক নই এবং কোনো আর্থিক পণ্য সরাসরি বিক্রি করি না। বাহ্যিক লিংকগুলো সংশ্লিষ্ট ব্যাংকের নিজস্ব ভেরিফায়েড ওয়েবসাইটে নিয়ে যায়।"
            : "We are an independent financial comparison platform and not a lending institution. Outbound links connect you directly to each bank's official website."}
        </p>
      </div>
    </Container>
  );
}

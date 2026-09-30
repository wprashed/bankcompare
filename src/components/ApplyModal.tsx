"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { formatBdt } from "@/lib/format";
import { getBankApplyUrl } from "@/lib/bankUrls";

export type ApplyModalProduct = {
  name: string;
  nameBn?: string;
  bankName: string;
  bankSlug: string;
  productType: "CARD" | "LOAN" | "DPS" | "FDR";
  productSlug: string;
  bankWebsite?: string;
};

interface ApplyModalProps {
  product: ApplyModalProduct | null;
  onClose: () => void;
}

export function ApplyModal({ product, onClose }: ApplyModalProps) {
  const { lang } = useLanguage();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Dhaka");
  const [monthlyIncome, setMonthlyIncome] = useState(50000);
  const [employmentType, setEmploymentType] = useState("SALARIED");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successRef, setSuccessRef] = useState<string | null>(null);

  if (!product) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError(lang === "bn" ? "দয়া করে আপনার নাম ও ফোন নাম্বার দিন" : "Please provide your name and phone number");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          city,
          monthlyIncome,
          employmentType,
          productType: product?.productType,
          productSlug: product?.productSlug,
          productName: product?.name,
          bankSlug: product?.bankSlug,
          bankName: product?.bankName,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }
      setSuccessRef(data.refNumber);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-5 text-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
              {lang === "bn" ? "আবেদন ফরম" : "Fast-Track Application"}
            </span>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-xl font-bold p-1 leading-none rounded-lg hover:bg-white/10 transition-colors"
            >
              ✕
            </button>
          </div>
          <h3 className="text-lg font-bold mt-2">
            {lang === "bn" && product.nameBn ? product.nameBn : product.name}
          </h3>
          <p className="text-xs text-emerald-100 mt-0.5">{product.bankName}</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {successRef ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center text-3xl mx-auto">
                ✓
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                {lang === "bn" ? "আবেদন সফলভাবে গৃহীত হয়েছে!" : "Application Submitted Successfully!"}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {lang === "bn"
                  ? "আপনার রেফারেন্স নাম্বার নিচে দেওয়া হলো। সংশ্লিষ্ট ব্যাংক প্রতিনিধি আগামী ২৪ ঘণ্টার মধ্যে আপনার সাথে যোগাযোগ করবেন।"
                  : "Your application reference number is below. A bank representative will reach out to you within 24 hours."}
              </p>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 inline-block font-mono text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {successRef}
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm"
                >
                  {lang === "bn" ? "ঠিক আছে" : "Close"}
                </button>
                <a
                  href={getBankApplyUrl(product.bankWebsite, product.bankSlug, product.productType)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors shadow-sm text-sm"
                >
                  <span>{lang === "bn" ? "ব্যাংকের ওয়েবসাইটে যান" : "Visit Bank Website"}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs">
                <span className="text-slate-600 dark:text-slate-300">
                  {lang === "bn" ? "সরাসরি ব্যাংকের অফিসিয়াল পোর্টালে আবেদন করতে চান?" : "Prefer applying directly on official bank portal?"}
                </span>
                <a
                  href={getBankApplyUrl(product.bankWebsite, product.bankSlug, product.productType)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 hover:underline shrink-0"
                >
                  <span>{lang === "bn" ? "ওয়েবসাইটে যান" : "Go to Bank URL"}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              {error && (
                <div className="p-3 text-xs bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-lg border border-rose-200 dark:border-rose-800">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === "bn" ? "আপনার পুরো নাম *" : "Full Name *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tanvir Ahmed"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === "bn" ? "মোবাইল নাম্বার *" : "Phone Number *"}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="017xxxxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === "bn" ? "ইমেইল (ঐচ্ছিক)" : "Email (Optional)"}
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === "bn" ? "শহর" : "City"}
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Dhaka">Dhaka (ঢাকা)</option>
                    <option value="Chittagong">Chattogram (চট্টগ্রাম)</option>
                    <option value="Sylhet">Sylhet (সিলেট)</option>
                    <option value="Rajshahi">Rajshahi (রাজশাহী)</option>
                    <option value="Khulna">Khulna (খুলনা)</option>
                    <option value="Other">Other City</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === "bn" ? "পেশা" : "Employment Type"}
                  </label>
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="SALARIED">Salaried Employee</option>
                    <option value="BUSINESS">Business Owner</option>
                    <option value="FREELANCER">Freelancer / IT Professional</option>
                    <option value="NRB">Non-Resident Bangladeshi (NRB)</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {lang === "bn" ? "মাসিক আয়" : "Monthly Income"}
                  </label>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {formatBdt(monthlyIncome, lang)}
                  </span>
                </div>
                <input
                  type="range"
                  min={20000}
                  max={300000}
                  step={5000}
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {lang === "bn" ? "বাতিল" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md transition-colors disabled:opacity-50"
                >
                  {loading
                    ? (lang === "bn" ? "প্রক্রিয়াকরণ হচ্ছে..." : "Submitting...")
                    : (lang === "bn" ? "আবেদন জমা দিন" : "Submit Application")}
                </button>
              </div>

              <p className="text-[11px] text-slate-400 text-center mt-2">
                🔒 {lang === "bn" ? "আপনার তথ্য সম্পূর্ণ নিরাপদ ও গোপনীয় রাখা হবে।" : "Your contact details are strictly kept private & encrypted."}
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

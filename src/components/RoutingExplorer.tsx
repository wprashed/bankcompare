"use client";

import { useState, useMemo } from "react";
import { useLanguage } from "@/lib/i18n";
import { BankRoutingRow } from "@/lib/queries";

interface RoutingExplorerProps {
  initialRoutings: BankRoutingRow[];
}

export function RoutingExplorer({ initialRoutings }: RoutingExplorerProps) {
  const { lang } = useLanguage();
  const [search, setSearch] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const districts = useMemo(() => {
    const set = new Set(initialRoutings.map((r) => r.district));
    return ["ALL", ...Array.from(set)];
  }, [initialRoutings]);

  const filtered = useMemo(() => {
    return initialRoutings.filter((r) => {
      if (selectedDistrict !== "ALL" && r.district !== selectedDistrict) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchBank = r.bankName.toLowerCase().includes(q) || r.bankNameBn.toLowerCase().includes(q);
        const matchBranch = r.branchName.toLowerCase().includes(q) || r.branchNameBn.toLowerCase().includes(q);
        const matchRouting = r.routingNumber.includes(q);
        const matchSwift = r.swiftCode ? r.swiftCode.toLowerCase().includes(q) : false;
        if (!matchBank && !matchBranch && !matchRouting && !matchSwift) return false;
      }
      return true;
    });
  }, [initialRoutings, selectedDistrict, search]);

  function handleCopy(routingNumber: string, id: string) {
    navigator.clipboard.writeText(routingNumber);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-96">
            <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder={lang === "bn" ? "শাখা, ব্যাংক বা ৯-সংখ্যার রাউটিং নম্বর খুঁজুন..." : "Search branch, bank, or 9-digit routing number..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* District Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {districts.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDistrict(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedDistrict === d
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {d === "ALL" ? (lang === "bn" ? "সকল জেলা" : "All Districts") : d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Counter */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          {lang === "bn"
            ? `মোট ${filtered.length} টি শাখার রাউটিং নম্বর প্রদর্শিত হচ্ছে`
            : `Displaying ${filtered.length} bank branch routing codes`}
        </span>
      </div>

      {/* Directory Table / Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-5 py-3.5">{lang === "bn" ? "ব্যাংকের নাম" : "Bank"}</th>
                <th className="px-5 py-3.5">{lang === "bn" ? "শাখা ও জেলা" : "Branch & District"}</th>
                <th className="px-5 py-3.5">{lang === "bn" ? "রাউটিং নম্বর (৯ ডিজিট)" : "Routing Number"}</th>
                <th className="px-5 py-3.5">{lang === "bn" ? "সুইফট কোড" : "SWIFT / BIC"}</th>
                <th className="px-5 py-3.5 text-right">{lang === "bn" ? "অ্যাকশন" : "Action"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-4 font-bold text-slate-900 dark:text-white">
                    {lang === "bn" ? item.bankNameBn : item.bankName}
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                      {lang === "bn" ? item.branchNameBn : item.branchName}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      📍 {lang === "bn" ? item.districtBn : item.district}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                      {item.routingNumber}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono text-slate-500">
                    {item.swiftCode || "—"}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => handleCopy(item.routingNumber, item.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        copiedId === item.id
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {copiedId === item.id
                        ? (lang === "bn" ? "কপি হয়েছে!" : "Copied! ✓")
                        : (lang === "bn" ? "কপি করুন" : "Copy")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

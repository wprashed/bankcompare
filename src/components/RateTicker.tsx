import { ArrowDownRight, ArrowUpRight, Radio } from "lucide-react";
import type { RateChangeRow } from "@/lib/queries";
import { formatPercent, relativeDays } from "@/lib/format";
import type { Locale } from "@/lib/i18n/config";

export function RateTicker({
  changes,
  locale,
  bnNumerals,
  label,
}: {
  changes: RateChangeRow[];
  locale: Locale;
  bnNumerals: boolean;
  label: string;
}) {
  if (!changes.length) return null;
  const items = [...changes, ...changes]; // duplicated for a seamless loop

  return (
    <div className="no-print border-y border-ink-200 bg-ink-900">
      <div className="mx-auto flex max-w-full items-center">
        <div className="z-10 flex shrink-0 items-center gap-2 bg-flag-500 py-2.5 pl-4 pr-5 text-[12px] font-bold uppercase tracking-wider text-white sm:pl-6">
          <Radio className="h-3.5 w-3.5 animate-pulse" />
          {label}
        </div>
        <div className="marquee-wrap relative overflow-hidden">
          <div className="marquee-track">
            {items.map((c, i) => {
              const up = c.newRate >= c.oldRate;
              return (
                <div key={c.id + i} className="flex shrink-0 items-center gap-2 px-5 py-2.5 text-[13px] text-white/90">
                  <span className="font-semibold text-white">
                    {locale === "bn" ? c.bank.nameBn : c.bank.shortName}
                  </span>
                  <span className="text-white/60">{c.productName}</span>
                  <span
                    className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[12px] font-bold tabular ${
                      up ? "bg-brand-500/25 text-brand-200" : "bg-flag-500/25 text-flag-200"
                    }`}
                  >
                    {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {formatPercent(c.newRate, { bnNumerals })}
                  </span>
                  <span className="text-white/40">
                    {formatPercent(c.oldRate, { bnNumerals })} · {relativeDays(new Date(c.changedAt), locale, bnNumerals)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

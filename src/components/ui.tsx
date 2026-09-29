import Link from "next/link";
import type { ReactNode } from "react";

export function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: "neutral" | "brand" | "flag" | "amber" | "blue";
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: "bg-ink-100 text-ink-600 ring-ink-200",
    brand: "bg-brand-50 text-brand-700 ring-brand-200",
    flag: "bg-flag-50 text-flag-700 ring-flag-200",
    amber: "bg-amber-50 text-amber-700 ring-amber-200",
    blue: "bg-sky-50 text-sky-700 ring-sky-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && (
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-brand-600">{eyebrow}</div>
        )}
        <h2 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-[28px]">{title}</h2>
        {subtitle && <p className="mt-2 text-[15px] leading-relaxed text-ink-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
  external,
  type,
  onClick,
}: {
  href?: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "flag";
  size?: "sm" | "md" | "lg";
  className?: string;
  external?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
}) {
  const variants: Record<string, string> = {
    primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-sm",
    flag: "bg-flag-500 text-white hover:bg-flag-600 shadow-sm",
    secondary: "bg-white text-ink-800 ring-1 ring-inset ring-ink-200 hover:bg-ink-50 hover:ring-ink-300",
    ghost: "text-brand-700 hover:bg-brand-50",
  };
  const sizes: Record<string, string> = {
    sm: "px-3 py-1.5 text-[13px]",
    md: "px-4 py-2.5 text-sm",
    lg: "px-5 py-3 text-[15px]",
  };
  const cls = `inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer nofollow" className={cls}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type ?? "button"} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

export function Stat({ value, label, accent }: { value: string; label: string; accent?: boolean }) {
  return (
    <div>
      <div className={`text-2xl font-bold tabular tracking-tight sm:text-[26px] ${accent ? "text-flag-500" : "text-brand-600"}`}>
        {value}
      </div>
      <div className="mt-0.5 text-[13px] font-medium text-ink-500">{label}</div>
    </div>
  );
}

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>;
}

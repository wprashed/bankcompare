import React from "react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  inverted?: boolean;
  href?: string;
}

export function LogoIcon({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-all duration-300 group-hover:scale-105 ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="bb-grad-primary" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="60%" stopColor="#047857" />
          <stop offset="100%" stopColor="#064e3b" />
        </linearGradient>
        <linearGradient id="bb-grad-mint" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="bb-grad-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <filter id="bb-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#064e3b" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Rounded Squircle Shield Container with subtle border */}
      <rect
        x="1.5"
        y="1.5"
        width="45"
        height="45"
        rx="13"
        fill="url(#bb-grad-primary)"
        stroke="rgba(255, 255, 255, 0.2)"
        strokeWidth="1.5"
      />

      {/* Modern stylized geometric interlocking "B" + Growth pillars */}
      {/* Vertical Spine (Solid Trust & Stability) */}
      <rect x="12" y="11" width="5.5" height="26" rx="2.75" fill="#FFFFFF" />

      {/* Upper Loop of 'B' (Rates growth curve) */}
      <path
        d="M 17 11 H 27.5 C 31 11 33.5 13.5 33.5 17 C 33.5 20.5 31 23 27.5 23 H 17"
        stroke="#FFFFFF"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Lower Loop of 'B' (Fintech Innovation / Peak Return) with Gold Glow */}
      <path
        d="M 17 23 H 29 C 33 23 35.5 25.5 35.5 29.5 C 35.5 33.5 33 37 29 37 H 17"
        stroke="url(#bb-grad-gold)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter="url(#bb-glow)"
      />

      {/* Golden Compass Spark / Beacon */}
      <circle cx="35" cy="12" r="2.5" fill="#FDE047" />
    </svg>
  );
}

export function Logo({
  className = "",
  size = "md",
  showText = true,
  inverted = false,
  href = "/",
}: LogoProps) {
  const iconSize = size === "sm" ? 32 : size === "lg" ? 44 : 38;
  const textSize = size === "sm" ? "text-[17px]" : size === "lg" ? "text-2xl" : "text-[20px]";

  const content = (
    <div className={`group inline-flex items-center gap-2.5 select-none ${className}`}>
      <LogoIcon size={iconSize} />
      {showText && (
        <div className="flex flex-col leading-none">
          <div className={`font-black tracking-tight flex items-center gap-1.5 ${textSize}`}>
            <span className={inverted ? "text-white" : "text-slate-900"}>
              Bank<span className="text-emerald-600">Bhai</span>
            </span>
            <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-300/80 tracking-widest shadow-2xs">
              BD
            </span>
          </div>
          <span
            className={`text-[9.5px] font-bold tracking-widest uppercase mt-0.5 ${
              inverted ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Smart Banking Guide
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="focus:outline-none" aria-label="BankBhai BD Home">
        {content}
      </Link>
    );
  }

  return content;
}

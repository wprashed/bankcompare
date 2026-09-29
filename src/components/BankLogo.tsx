/**
 * Deterministic, dependency-free bank mark.
 * Uses the bank's brand colour + initials so no external image request is needed
 * (keeps LCP fast and avoids hotlinking bank logos).
 */
export function BankLogo({
  initials,
  color,
  size = 44,
  rounded = "rounded-xl",
  className = "",
}: {
  initials: string;
  color: string;
  size?: number;
  rounded?: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center font-bold text-white ${rounded} ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: `linear-gradient(135deg, ${color} 0%, ${shade(color, -18)} 100%)`,
        letterSpacing: "0.02em",
      }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

function shade(hex: string, percent: number) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const num = parseInt(full, 16);
  const amt = Math.round(2.55 * percent);
  const r = Math.min(255, Math.max(0, (num >> 16) + amt));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amt));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

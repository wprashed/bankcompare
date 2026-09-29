import type { Locale } from "./i18n/config";

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function toBnDigits(input: string): string {
  return input.replace(/\d/g, (d) => BN_DIGITS[Number(d)]);
}

/** Indian/Bangladeshi grouping: 12,34,567 */
export function groupBD(n: number): string {
  const neg = n < 0;
  const [intPart, decPart] = Math.abs(n).toFixed(2).split(".");
  let out = "";
  if (intPart.length <= 3) {
    out = intPart;
  } else {
    const last3 = intPart.slice(-3);
    const rest = intPart.slice(0, -3);
    out = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + last3;
  }
  const dec = decPart === "00" ? "" : "." + decPart;
  return (neg ? "-" : "") + out + dec;
}

export type FormatOpts = { locale?: Locale; bnNumerals?: boolean; decimals?: 0 | 2 };

/** ৳ 12,34,567 */
export function formatBDT(amount: number, opts: FormatOpts = {}): string {
  const { bnNumerals = false, decimals = 0 } = opts;
  const rounded = decimals === 0 ? Math.round(amount) : amount;
  let s = groupBD(rounded);
  if (decimals === 0) s = s.split(".")[0];
  return "৳" + (bnNumerals ? toBnDigits(s) : s);
}

/** Compact: ৳12.5 Lakh / ৳1.2 Cr */
export function formatBDTCompact(amount: number, opts: FormatOpts = {}): string {
  const { bnNumerals = false, locale = "en" } = opts;
  const abs = Math.abs(amount);
  let value = amount;
  let unit = "";
  if (abs >= 10000000) {
    value = amount / 10000000;
    unit = locale === "bn" ? " কোটি" : " Cr";
  } else if (abs >= 100000) {
    value = amount / 100000;
    unit = locale === "bn" ? " লাখ" : " Lakh";
  } else if (abs >= 1000) {
    value = amount / 1000;
    unit = locale === "bn" ? " হাজার" : "K";
  }
  const str = unit ? String(Number(value.toFixed(value < 10 ? 2 : 1))) : groupBD(amount).split(".")[0];
  return "৳" + (bnNumerals ? toBnDigits(str) : str) + unit;
}

export function formatPercent(rate: number, opts: FormatOpts = {}): string {
  const { bnNumerals = false } = opts;
  const s = rate.toFixed(2) + "%";
  return bnNumerals ? toBnDigits(s) : s;
}

export function formatBdt(amount: number, lang: "en" | "bn" = "en"): string {
  return formatBDT(amount, { locale: lang, bnNumerals: lang === "bn" });
}

export function formatNumber(n: number, opts: FormatOpts = {}): string {
  const s = groupBD(n).split(".")[0];
  return opts.bnNumerals ? toBnDigits(s) : s;
}

/** DD/MM/YYYY */
export function formatDate(date: Date | string, opts: FormatOpts = {}): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const s = `${String(d.getUTCDate()).padStart(2, "0")}/${String(d.getUTCMonth() + 1).padStart(2, "0")}/${d.getUTCFullYear()}`;
  return opts.bnNumerals ? toBnDigits(s) : s;
}

export function tenureLabel(months: number, locale: Locale = "en", bnNumerals = false): string {
  const n = (x: number) => (bnNumerals ? toBnDigits(String(x)) : String(x));
  if (months % 12 === 0 && months >= 12) {
    const y = months / 12;
    return locale === "bn" ? `${n(y)} বছর` : `${n(y)} Year${y > 1 ? "s" : ""}`;
  }
  return locale === "bn" ? `${n(months)} মাস` : `${n(months)} Month${months > 1 ? "s" : ""}`;
}

export function relativeDays(date: Date, locale: Locale = "en", bnNumerals = false): string {
  const days = Math.max(0, Math.round((Date.now() - date.getTime()) / 86400000));
  const n = (x: number) => (bnNumerals ? toBnDigits(String(x)) : String(x));
  if (days === 0) return locale === "bn" ? "আজ" : "today";
  if (days === 1) return locale === "bn" ? "গতকাল" : "yesterday";
  return locale === "bn" ? `${n(days)} দিন আগে` : `${n(days)} days ago`;
}

/* ---------------- Financial maths ---------------- */

/** Simple-interest FDR maturity (Bangladeshi banks quote p.a. simple interest for FDR). */
export function fdrSimpleMaturity(principal: number, annualRate: number, months: number) {
  const interest = principal * (annualRate / 100) * (months / 12);
  return { interest, maturity: principal + interest };
}

/** Quarterly-compounded FDR maturity (used when interest is reinvested). */
export function fdrCompoundMaturity(principal: number, annualRate: number, months: number, perYear = 4) {
  const n = perYear;
  const t = months / 12;
  const maturity = principal * Math.pow(1 + annualRate / 100 / n, n * t);
  return { interest: maturity - principal, maturity };
}

/** Bangladesh: 10% source tax on interest with TIN, 15% without. */
export function applyTax(interest: number, hasTin: boolean) {
  const rate = hasTin ? 0.1 : 0.15;
  const tax = interest * rate;
  return { tax, net: interest - tax, rate: rate * 100 };
}

/** Standard reducing-balance EMI. */
export function calcEMI(principal: number, annualRate: number, months: number) {
  const r = annualRate / 100 / 12;
  if (r === 0) return { emi: principal / months, totalPayment: principal, totalInterest: 0 };
  const emi = (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  const totalPayment = emi * months;
  return { emi, totalPayment, totalInterest: totalPayment - principal };
}

/** Credit card minimum payment & payoff calculation */
export function calcCreditCardPayoff(balance: number, apr: number, monthlyPayment: number) {
  const monthlyRate = apr / 100 / 12;
  const minPayment = Math.max(500, balance * 0.05); // BB standard: 5% or ৳500
  const payment = Math.max(monthlyPayment, minPayment);

  if (balance <= 0) {
    return { months: 0, totalInterest: 0, totalPayment: 0, isPayable: true };
  }

  const monthlyInterest = balance * monthlyRate;
  if (payment <= monthlyInterest) {
    return { months: Infinity, totalInterest: Infinity, totalPayment: Infinity, isPayable: false };
  }

  let remaining = balance;
  let totalInterest = 0;
  let months = 0;
  const maxMonths = 360;

  while (remaining > 0.01 && months < maxMonths) {
    months++;
    const interest = remaining * monthlyRate;
    totalInterest += interest;
    remaining = remaining + interest - payment;
    if (remaining < 0) remaining = 0;
  }

  return {
    months,
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(balance + totalInterest),
    minPayment: Math.round(minPayment),
    isPayable: true,
  };
}

/** Credit limit and loan eligibility estimation based on Bangladesh Bank debt-burden ratio guidelines */
export function estimateCreditEligibility(monthlyIncome: number, existingEmis = 0, dbrRatio = 0.5) {
  const maxAllowableEmi = Math.max(0, monthlyIncome * dbrRatio - existingEmis);
  // Estimated personal loan max (36 months @ 12%)
  const { emi: baseEmiPerLakh } = calcEMI(100000, 12, 36);
  const estimatedPersonalLoanMax = Math.min(2000000, Math.floor((maxAllowableEmi / baseEmiPerLakh) * 100000));
  // Estimated credit card limit: typically 1.5x to 2.5x of gross monthly income
  const estimatedCreditCardLimit = Math.max(30000, Math.min(1000000, Math.round(monthlyIncome * 2)));

  return {
    disposableIncomeForEmi: Math.round(maxAllowableEmi),
    estimatedCreditCardLimit,
    estimatedPersonalLoanMax,
  };
}


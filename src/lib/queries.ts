import { prisma } from "./prisma";

/* ------------ Plain, serialisable shapes passed to client components ------------ */

export type BankLite = {
  id: string;
  slug: string;
  name: string;
  nameBn: string;
  shortName: string;
  category: string;
  isShariah: boolean;
  brandColor: string;
  logoInitials: string;
  rating: number;
  reviewCount: number;
  branchCount: number;
  atmCount: number;
  website: string;
};

export type SavingsRow = {
  id: string;
  slug: string;
  name: string;
  nameBn: string;
  interestRate: number;
  interestRateMax: number;
  minOpeningBalance: number;
  minBalanceForInterest: number;
  maintenanceFee: number;
  debitCardAnnualFee: number;
  freeChequebook: boolean;
  freeDebitCard: boolean;
  interestPayout: string;
  onlineAccountOpening: boolean;
  segment: string;
  isShariah: boolean;
  features: string[];
  featuresBn: string[];
  popularity: number;
  effectiveFrom: string;
  bank: BankLite;
};

export type FdrOffer = {
  id: string;
  productId: string;
  slug: string;
  name: string;
  nameBn: string;
  tenureMonths: number;
  rate: number;
  minDeposit: number;
  interestPayout: string;
  prematureEncashment: boolean;
  autoRenewal: boolean;
  loanAgainstFdrPct: number | null;
  isShariah: boolean;
  features: string[];
  featuresBn: string[];
  effectiveFrom: string;
  bank: BankLite;
};

export type CreditCardRow = {
  id: string;
  slug: string;
  name: string;
  nameBn: string;
  network: string;
  tier: string;
  annualFee: number;
  feeWaiverCondition: string | null;
  feeWaiverConditionBn: string | null;
  interestRateMonthly: number;
  interestRateAnnual: number;
  interestFreeDays: number;
  minIncome: number;
  isDualCurrency: boolean;
  airportLoungeAccess: boolean;
  loungeDetails: string | null;
  loungeDetailsBn: string | null;
  rewardType: string;
  rewardSummary: string;
  rewardSummaryBn: string;
  zeroPctEmiAvailable: boolean;
  maxEmiMonths: number;
  contactless: boolean;
  isShariah: boolean;
  cardColor: string;
  features: string[];
  featuresBn: string[];
  popularity: number;
  effectiveFrom: string;
  bank: BankLite;
};

export type LoanRow = {
  id: string;
  slug: string;
  name: string;
  nameBn: string;
  loanType: string;
  interestRateMin: number;
  interestRateMax: number;
  minAmount: number;
  maxAmount: number;
  minTenureMonths: number;
  maxTenureMonths: number;
  processingFeePct: number;
  minIncome: number;
  isShariah: boolean;
  features: string[];
  featuresBn: string[];
  popularity: number;
  effectiveFrom: string;
  bank: BankLite;
};

export type RateChangeRow = {
  id: string;
  productType: string;
  productName: string;
  oldRate: number;
  newRate: number;
  changedAt: string;
  bank: Pick<BankLite, "shortName" | "name" | "nameBn" | "brandColor" | "slug">;
};

const bankSelect = {
  id: true,
  slug: true,
  name: true,
  nameBn: true,
  shortName: true,
  category: true,
  isShariah: true,
  brandColor: true,
  logoInitials: true,
  rating: true,
  reviewCount: true,
  branchCount: true,
  atmCount: true,
  website: true,
} as const;

const parseJson = (s: string): string[] => {
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
};

/* --------------------------------- Queries --------------------------------- */

export async function getSavingsRows(): Promise<SavingsRow[]> {
  const rows = await prisma.savingsAccount.findMany({
    where: { isActive: true },
    include: { bank: { select: bankSelect } },
    orderBy: [{ interestRateMax: "desc" }, { popularity: "desc" }],
  });
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    nameBn: r.nameBn,
    interestRate: r.interestRate,
    interestRateMax: r.interestRateMax,
    minOpeningBalance: r.minOpeningBalance,
    minBalanceForInterest: r.minBalanceForInterest,
    maintenanceFee: r.maintenanceFee,
    debitCardAnnualFee: r.debitCardAnnualFee,
    freeChequebook: r.freeChequebook,
    freeDebitCard: r.freeDebitCard,
    interestPayout: r.interestPayout,
    onlineAccountOpening: r.onlineAccountOpening,
    segment: r.segment,
    isShariah: r.isShariah,
    features: parseJson(r.features),
    featuresBn: parseJson(r.featuresBn),
    popularity: r.popularity,
    effectiveFrom: r.effectiveFrom.toISOString(),
    bank: r.bank,
  }));
}

export async function getFdrOffers(): Promise<FdrOffer[]> {
  const products = await prisma.fdrProduct.findMany({
    where: { isActive: true },
    include: { bank: { select: bankSelect }, rates: { orderBy: { tenureMonths: "asc" } } },
  });
  const offers: FdrOffer[] = [];
  for (const p of products) {
    for (const r of p.rates) {
      offers.push({
        id: r.id,
        productId: p.id,
        slug: p.slug,
        name: p.name,
        nameBn: p.nameBn,
        tenureMonths: r.tenureMonths,
        rate: r.rate,
        minDeposit: Math.max(p.minDeposit, r.minAmount),
        interestPayout: p.interestPayout,
        prematureEncashment: p.prematureEncashment,
        autoRenewal: p.autoRenewal,
        loanAgainstFdrPct: p.loanAgainstFdrPct,
        isShariah: p.isShariah,
        features: parseJson(p.features),
        featuresBn: parseJson(p.featuresBn),
        effectiveFrom: p.effectiveFrom.toISOString(),
        bank: p.bank,
      });
    }
  }
  return offers.sort((a, b) => b.rate - a.rate);
}

/** Best rate per bank for a given tenure (default 12 months) */
export async function getTopFdrByTenure(tenureMonths = 12, limit = 10): Promise<FdrOffer[]> {
  const offers = await getFdrOffers();
  const best = new Map<string, FdrOffer>();
  for (const o of offers.filter((x) => x.tenureMonths === tenureMonths)) {
    const current = best.get(o.bank.id);
    if (!current || o.rate > current.rate) best.set(o.bank.id, o);
  }
  return [...best.values()].sort((a, b) => b.rate - a.rate).slice(0, limit);
}

export async function getTopSavings(limit = 6): Promise<SavingsRow[]> {
  const rows = await getSavingsRows();
  return rows.slice(0, limit);
}

export async function getCreditCardRows(): Promise<CreditCardRow[]> {
  const rows = await prisma.creditCard.findMany({
    where: { isActive: true },
    include: { bank: { select: bankSelect } },
    orderBy: [{ popularity: "desc" }, { annualFee: "asc" }],
  });
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    nameBn: r.nameBn,
    network: r.network,
    tier: r.tier,
    annualFee: r.annualFee,
    feeWaiverCondition: r.feeWaiverCondition,
    feeWaiverConditionBn: r.feeWaiverConditionBn,
    interestRateMonthly: r.interestRateMonthly,
    interestRateAnnual: r.interestRateAnnual,
    interestFreeDays: r.interestFreeDays,
    minIncome: r.minIncome,
    isDualCurrency: r.isDualCurrency,
    airportLoungeAccess: r.airportLoungeAccess,
    loungeDetails: r.loungeDetails,
    loungeDetailsBn: r.loungeDetailsBn,
    rewardType: r.rewardType,
    rewardSummary: r.rewardSummary,
    rewardSummaryBn: r.rewardSummaryBn,
    zeroPctEmiAvailable: r.zeroPctEmiAvailable,
    maxEmiMonths: r.maxEmiMonths,
    contactless: r.contactless,
    isShariah: r.isShariah,
    cardColor: r.cardColor,
    features: parseJson(r.features),
    featuresBn: parseJson(r.featuresBn),
    popularity: r.popularity,
    effectiveFrom: r.effectiveFrom.toISOString(),
    bank: r.bank,
  }));
}

export async function getTopCreditCards(limit = 6): Promise<CreditCardRow[]> {
  const cards = await getCreditCardRows();
  return cards.slice(0, limit);
}

export async function getLoanRows(): Promise<LoanRow[]> {
  const rows = await prisma.loanProduct.findMany({
    where: { isActive: true },
    include: { bank: { select: bankSelect } },
    orderBy: [{ interestRateMin: "asc" }, { popularity: "desc" }],
  });
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    nameBn: r.nameBn,
    loanType: r.loanType,
    interestRateMin: r.interestRateMin,
    interestRateMax: r.interestRateMax,
    minAmount: r.minAmount,
    maxAmount: r.maxAmount,
    minTenureMonths: r.minTenureMonths,
    maxTenureMonths: r.maxTenureMonths,
    processingFeePct: r.processingFeePct,
    minIncome: r.minIncome,
    isShariah: r.isShariah,
    features: parseJson(r.features),
    featuresBn: parseJson(r.featuresBn),
    popularity: r.popularity,
    effectiveFrom: r.effectiveFrom.toISOString(),
    bank: r.bank,
  }));
}

export async function getTopLoans(limit = 6): Promise<LoanRow[]> {
  const loans = await getLoanRows();
  return loans.slice(0, limit);
}

export async function getBanks(): Promise<
  (BankLite & {
    savingsCount: number;
    fdrCount: number;
    cardCount: number;
    loanCount: number;
    bestFdr: number;
  })[]
> {
  const banks = await prisma.bank.findMany({
    select: {
      ...bankSelect,
      _count: {
        select: {
          savingsAccounts: true,
          fdrProducts: true,
          creditCards: true,
          loans: true,
        },
      },
      fdrProducts: { select: { rates: { select: { rate: true, tenureMonths: true } } } },
    },
    orderBy: { name: "asc" },
  });
  return banks.map(({ _count, fdrProducts, ...b }) => ({
    ...b,
    savingsCount: _count.savingsAccounts,
    fdrCount: _count.fdrProducts,
    cardCount: _count.creditCards,
    loanCount: _count.loans,
    bestFdr: Math.max(
      0,
      ...fdrProducts.flatMap((p) => p.rates.filter((r) => r.tenureMonths === 12).map((r) => r.rate))
    ),
  }));
}

export async function getRateChanges(limit = 8): Promise<RateChangeRow[]> {
  const rows = await prisma.rateChange.findMany({
    take: limit,
    orderBy: { changedAt: "desc" },
    include: { bank: { select: { shortName: true, name: true, nameBn: true, brandColor: true, slug: true } } },
  });
  return rows.map((r) => ({
    id: r.id,
    productType: r.productType,
    productName: r.productName,
    oldRate: r.oldRate,
    newRate: r.newRate,
    changedAt: r.changedAt.toISOString(),
    bank: r.bank,
  }));
}

export async function getStats() {
  const [banks, savings, fdr, slabs, cards, loans, topFdr, topSavings, minLoan] = await Promise.all([
    prisma.bank.count(),
    prisma.savingsAccount.count(),
    prisma.fdrProduct.count(),
    prisma.fdrRate.count(),
    prisma.creditCard.count(),
    prisma.loanProduct.count(),
    prisma.fdrRate.aggregate({ _max: { rate: true } }),
    prisma.savingsAccount.aggregate({ _max: { interestRateMax: true } }),
    prisma.loanProduct.aggregate({ _min: { interestRateMin: true } }),
  ]);
  return {
    banks,
    savings,
    fdr,
    slabs,
    cards,
    loans,
    products: savings + fdr + cards + loans,
    maxFdrRate: topFdr._max.rate ?? 0,
    maxSavingsRate: topSavings._max.interestRateMax ?? 0,
    minLoanRate: minLoan._min.interestRateMin ?? 9.5,
  };
}


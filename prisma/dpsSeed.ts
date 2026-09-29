export type DpsSeed = {
  slug: string;
  bankSlug: string;
  name: string;
  nameBn: string;
  minMonthlyDeposit: number;
  maxMonthlyDeposit: number;
  interestRate: number;
  tenureYears: string;
  isShariah?: boolean;
  features: string[];
  featuresBn: string[];
  popularity?: number;
};

export const DPS_PRODUCTS_DATA: DpsSeed[] = [
  {
    slug: "brac-dps-super-scheme",
    bankSlug: "brac-bank",
    name: "BRAC Bank Super DPS Scheme",
    nameBn: "ব্র্যাক ব্যাংক সুপার ডিপিএস স্কিম",
    minMonthlyDeposit: 500,
    maxMonthlyDeposit: 50000,
    interestRate: 9.5,
    tenureYears: "1,2,3,5,7,10",
    features: [
      "Auto debit from savings account",
      "Flexible monthly installment from ৳500 to ৳50,000",
      "Loan against DPS up to 90% after 1 year",
      "Competitive 9.5% compound annual return",
    ],
    featuresBn: [
      "সেভিংস অ্যাকাউন্ট থেকে স্বয়ংক্রিয় টাকা কর্তন",
      "৫০০ টাকা থেকে ৫০,০০০ টাকা পর্যন্ত কিস্তির সুবিধা",
      "১ বছর পর ডিপিএসের বিপরীতে ৯০% পর্যন্ত ঋণ",
      "বার্ষিক ৯.৫% হারে চক্রবৃদ্ধি মুনাফা",
    ],
    popularity: 98,
  },
  {
    slug: "ibbl-mudaraba-dps",
    bankSlug: "islami-bank-bangladesh",
    name: "IBBL Mudaraba Special Deposit Pension Scheme",
    nameBn: "আইবিবিএল মুদারাবা বিশেষ সঞ্চয় পেনশন স্কিম",
    minMonthlyDeposit: 500,
    maxMonthlyDeposit: 50000,
    interestRate: 9.25,
    tenureYears: "3,5,10",
    isShariah: true,
    features: [
      "100% Shariah compliant (Mudaraba profit principle)",
      "Auto installment deposit from CellFin app",
      "Safe and ethical retirement fund creation",
    ],
    featuresBn: [
      "শতভাগ শরীয়াহ সম্মত (মুদারাবা মুনাফা নীতিমালা)",
      "সেলফিন অ্যাপের মাধ্যমে ঘরে বসেই কিস্তি জমা",
      "সুদমুক্ত হালাল অবসর সঞ্চয় তহবিল গঠন",
    ],
    popularity: 97,
  },
  {
    slug: "city-high-yield-dps",
    bankSlug: "the-city-bank",
    name: "City Bank High Yield DPS",
    nameBn: "সিটি ব্যাংক হাই ইল্ড ডিপিএস",
    minMonthlyDeposit: 1000,
    maxMonthlyDeposit: 50000,
    interestRate: 9.75,
    tenureYears: "1,3,5,7,10",
    features: [
      "Highest market-aligned return at 9.75%",
      "Standing order instruction with zero processing fee",
      "Credit card bill waiver points linked with DPS",
    ],
    featuresBn: [
      "বাজারের অন্যতম সর্বোচ্চ ৯.৭৫% মুনাফা হার",
      "স্ট্যান্ডিং ইন্সট্রাকশনে কোনো অতিরিক্ত ফি নেই",
      "সিটি টাচ অ্যাপ থেকে সম্পূর্ণ ডিজিটাল ট্র্যাকিং",
    ],
    popularity: 96,
  },
  {
    slug: "ebl-millionaire-scheme",
    bankSlug: "eastern-bank",
    name: "EBL Millionaire & Lakhopoti DPS",
    nameBn: "ইবিএল মিলিয়নেয়ার ও লাখপতি ডিপিএস",
    minMonthlyDeposit: 1000,
    maxMonthlyDeposit: 50000,
    interestRate: 9.5,
    tenureYears: "3,5,7,10",
    features: [
      "Targeted goal to achieve ৳10 Lakh or ৳1 Crore with fixed monthly installments",
      "Free life insurance coverage up to BDT 5,00,000",
      "Instant overdraft up to 90% of deposited value",
    ],
    featuresBn: [
      "নির্দিষ্ট কিস্তিতে ১০ লাখ বা ১ কোটি টাকা জমার লক্ষ্যমাত্রা",
      "৫ লাখ টাকা পর্যন্ত বিনামূল্যে জীবনবীমা সুবিধা",
      "জমার ৯০% পর্যন্ত তাৎক্ষণিক ওভারড্রাফট ঋণ",
    ],
    popularity: 95,
  },
  {
    slug: "mtb-kotipoti-scheme",
    bankSlug: "mutual-trust-bank",
    name: "MTB Kotipoti Scheme",
    nameBn: "এমটিবি কোটিপতি স্কিম ডিপিএস",
    minMonthlyDeposit: 1000,
    maxMonthlyDeposit: 50000,
    interestRate: 9.75,
    tenureYears: "3,5,7,10",
    features: [
      "Fastest path to 1 Crore BDT maturity",
      "Auto SMS confirmation on installment payment",
      "Loan facility available on simplified terms",
    ],
    featuresBn: [
      "মেয়াদান্তে এক কোটি টাকা অর্জনের সুবর্ণ সুযোগ",
      "কিস্তি জমার পর তাৎক্ষণিক কনফার্মেশন এসএমএস",
      "সহজ শর্তে ঋণ গ্রহণের বিশেষ সুবিধা",
    ],
    popularity: 93,
  },
  {
    slug: "dbbl-deposit-pension",
    bankSlug: "dutch-bangla-bank",
    name: "DBBL Deposit Plus Scheme (DPS)",
    nameBn: "ডিবিবিএল ডিপোজিট প্লাস স্কিম (ডিপিএস)",
    minMonthlyDeposit: 500,
    maxMonthlyDeposit: 25000,
    interestRate: 9.0,
    tenureYears: "3,5,8,10",
    features: [
      "Available across all DBBL branches, fast tracks and sub-branches",
      "Deposit from Rocket mobile wallet or NexusPay",
      "Reliable and secure long term growth",
    ],
    featuresBn: [
      "সারাদেশে সব শাখা ও ফাস্ট ট্র্যাকে সহজ সেবা",
      "রকেট ওয়ালেট অথবা নেক্সাসপে থেকে কিস্তি জমার সুবিধা",
      "দীর্ঘমেয়াদে নিরাপদ ও নির্ভরযোগ্য বিনিয়োগ",
    ],
    popularity: 94,
  },
  {
    slug: "prime-bank-dps",
    bankSlug: "prime-bank",
    name: "Prime Bank Double Return DPS",
    nameBn: "প্রাইম ব্যাংক ডাবল রিটার্ন ডিপিএস",
    minMonthlyDeposit: 1000,
    maxMonthlyDeposit: 50000,
    interestRate: 9.5,
    tenureYears: "2,3,5,7,10",
    features: [
      "Competitive 9.5% annual rate",
      "Flexible maturity dates",
      "Quick loan processing against deposit",
    ],
    featuresBn: [
      "প্রতিযোগিতামূলক ৯.৫% বাৎসরিক সুদ হার",
      "সুবিধাজনক মেয়াদের পছন্দ",
      "ডিপোজিটের বিপরীতে দ্রুত ঋণ অনুমোদন",
    ],
    popularity: 88,
  },
  {
    slug: "ucb-sanchay-dps",
    bankSlug: "united-commercial-bank",
    name: "UCB Sanchay DPS Scheme",
    nameBn: "ইউসিবি সঞ্চয় ডিপিএস স্কিম",
    minMonthlyDeposit: 500,
    maxMonthlyDeposit: 50000,
    interestRate: 9.5,
    tenureYears: "1,2,3,5,7,10",
    features: [
      "High yield savings",
      "Digital tracking via UCBnet & Upay",
      "Hassle-free nominee claims",
    ],
    featuresBn: [
      "আকর্ষণীয় মুনাফা",
      "ইউসিবি-নেট ও উপায়ের মাধ্যমে ব্যালেন্স দেখা",
      "সহজ নমিনি ক্লেইম প্রক্রিয়া",
    ],
    popularity: 90,
  },
];

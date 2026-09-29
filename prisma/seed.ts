/**
 * Seed: top 10 Bangladeshi banks with savings + FDR products.
 *
 * Rates are indicative figures compiled from public bank schedule-of-charges /
 * deposit-rate pages (2025–26 cycle). Always verify with the bank before acting.
 * `effectiveFrom` carries the "last verified" date shown in the UI.
 */
import { PrismaClient } from "@prisma/client";
import { CREDIT_CARDS_DATA, LOANS_DATA } from "./creditSeed";
import { EXTENDED_BANKS } from "./extendedBanks";
import { EXTENDED_CREDIT_CARDS } from "./extendedCreditCards";
import { CARD_DEALS_DATA } from "./dealsSeed";
import { DPS_PRODUCTS_DATA } from "./dpsSeed";
import { ROUTING_NUMBERS_DATA } from "./routingSeed";

const prisma = new PrismaClient();

const VERIFIED = new Date("2026-09-01T00:00:00Z");

type SavingsSeed = {
  slug: string;
  name: string;
  nameBn: string;
  interestRate: number;
  interestRateMax?: number;
  minOpeningBalance: number;
  minBalanceForInterest?: number;
  maintenanceFee?: number;
  debitCardAnnualFee?: number;
  freeChequebook?: boolean;
  freeDebitCard?: boolean;
  interestPayout?: string;
  dailyBalanceInterest?: boolean;
  onlineAccountOpening?: boolean;
  segment?: string;
  isShariah?: boolean;
  features: string[];
  featuresBn: string[];
  popularity?: number;
};

type FdrSeed = {
  slug: string;
  name: string;
  nameBn: string;
  minDeposit: number;
  maxDeposit?: number;
  interestPayout?: string;
  prematureEncashment?: boolean;
  autoRenewal?: boolean;
  loanAgainstFdrPct?: number;
  isShariah?: boolean;
  features: string[];
  featuresBn: string[];
  /** [tenureMonths, rate] */
  rates: [number, number][];
};

type BankSeed = {
  slug: string;
  name: string;
  nameBn: string;
  shortName: string;
  category: string;
  isShariah?: boolean;
  establishedYear: number;
  headquarters: string;
  branchCount: number;
  atmCount: number;
  website: string;
  swiftCode: string;
  brandColor: string;
  logoInitials: string;
  rating: number;
  reviewCount: number;
  mobileAppName: string;
  description: string;
  descriptionBn: string;
  savings: SavingsSeed[];
  fdr: FdrSeed[];
};

const BANKS: BankSeed[] = [
  {
    slug: "islami-bank-bangladesh",
    name: "Islami Bank Bangladesh PLC",
    nameBn: "ইসলামী ব্যাংক বাংলাদেশ পিএলসি",
    shortName: "Islami Bank",
    category: "ISLAMIC",
    isShariah: true,
    establishedYear: 1983,
    headquarters: "Dilkusha C/A, Dhaka",
    branchCount: 394,
    atmCount: 2700,
    website: "https://www.islamibankbd.com",
    swiftCode: "IBBLBDDH",
    brandColor: "#00693E",
    logoInitials: "IB",
    rating: 4.2,
    reviewCount: 1840,
    mobileAppName: "CellFin",
    description:
      "The largest Shariah-compliant bank in Bangladesh and the country's biggest private bank by deposits, with the widest branch and agent-banking footprint.",
    descriptionBn:
      "বাংলাদেশের বৃহত্তম শরিয়াহভিত্তিক ব্যাংক এবং আমানতের দিক থেকে দেশের সর্ববৃহৎ বেসরকারি ব্যাংক, যার শাখা ও এজেন্ট ব্যাংকিং নেটওয়ার্ক সবচেয়ে বিস্তৃত।",
    savings: [
      {
        slug: "ibbl-mudaraba-savings",
        name: "Mudaraba Savings Account (MSA)",
        nameBn: "মুদারাবা সঞ্চয়ী হিসাব",
        interestRate: 2.75,
        interestRateMax: 3.5,
        minOpeningBalance: 500,
        minBalanceForInterest: 5000,
        maintenanceFee: 300,
        debitCardAnnualFee: 500,
        freeChequebook: true,
        interestPayout: "HALF_YEARLY",
        onlineAccountOpening: true,
        segment: "GENERAL",
        isShariah: true,
        popularity: 98,
        features: [
          "Profit on Mudaraba (profit-sharing) basis",
          "Open instantly from the CellFin app",
          "Nationwide agent banking access",
          "Free internet banking",
        ],
        featuresBn: [
          "মুদারাবা (লাভ-লোকসান অংশীদারিত্ব) ভিত্তিতে মুনাফা",
          "সেলফিন অ্যাপ থেকে তাৎক্ষণিক হিসাব খোলা",
          "সারাদেশে এজেন্ট ব্যাংকিং সুবিধা",
          "ফ্রি ইন্টারনেট ব্যাংকিং",
        ],
      },
      {
        slug: "ibbl-mudaraba-students-savings",
        name: "Mudaraba Students Savings Account",
        nameBn: "মুদারাবা স্টুডেন্টস সেভিংস হিসাব",
        interestRate: 3.0,
        interestRateMax: 3.0,
        minOpeningBalance: 100,
        minBalanceForInterest: 100,
        maintenanceFee: 0,
        freeChequebook: true,
        freeDebitCard: true,
        segment: "STUDENT",
        isShariah: true,
        popularity: 72,
        features: ["No maintenance fee", "Opens with ৳100", "Free debit card", "School banking benefits"],
        featuresBn: ["কোনো রক্ষণাবেক্ষণ ফি নেই", "১০০ টাকায় হিসাব খোলা", "ফ্রি ডেবিট কার্ড", "স্কুল ব্যাংকিং সুবিধা"],
      },
      {
        slug: "ibbl-mudaraba-nrb-savings",
        name: "Mudaraba NRB Savings Account",
        nameBn: "মুদারাবা এনআরবি সঞ্চয়ী হিসাব",
        interestRate: 3.25,
        interestRateMax: 3.25,
        minOpeningBalance: 1000,
        minBalanceForInterest: 1000,
        maintenanceFee: 0,
        freeChequebook: true,
        onlineAccountOpening: true,
        segment: "NRB",
        isShariah: true,
        popularity: 64,
        features: ["Free inward remittance", "No maintenance fee", "Higher profit rate for expatriates"],
        featuresBn: ["ফ্রি রেমিট্যান্স গ্রহণ", "কোনো রক্ষণাবেক্ষণ ফি নেই", "প্রবাসীদের জন্য বেশি মুনাফা"],
      },
    ],
    fdr: [
      {
        slug: "ibbl-mudaraba-term-deposit",
        name: "Mudaraba Term Deposit Receipt (MTDR)",
        nameBn: "মুদারাবা মেয়াদী আমানত",
        minDeposit: 10000,
        interestPayout: "MATURITY",
        loanAgainstFdrPct: 90,
        isShariah: true,
        features: [
          "Shariah-compliant profit sharing",
          "Auto renewal at maturity",
          "Investment facility up to 90% of deposit",
        ],
        featuresBn: [
          "শরিয়াহসম্মত মুনাফা বণ্টন",
          "মেয়াদপূর্তিতে স্বয়ংক্রিয় নবায়ন",
          "আমানতের ৯০% পর্যন্ত বিনিয়োগ সুবিধা",
        ],
        rates: [
          [1, 5.0],
          [3, 8.25],
          [6, 8.5],
          [12, 8.75],
          [24, 8.5],
          [36, 8.5],
        ],
      },
    ],
  },
  {
    slug: "brac-bank",
    name: "BRAC Bank PLC",
    nameBn: "ব্র্যাক ব্যাংক পিএলসি",
    shortName: "BRAC Bank",
    category: "PRIVATE",
    establishedYear: 2001,
    headquarters: "Gulshan, Dhaka",
    branchCount: 187,
    atmCount: 330,
    website: "https://www.bracbank.com",
    swiftCode: "BRAKBDDH",
    brandColor: "#D6001C",
    logoInitials: "BB",
    rating: 4.5,
    reviewCount: 2610,
    mobileAppName: "Astha",
    description:
      "Bangladesh's leading SME and retail bank, consistently ranked among the strongest lenders on capital adequacy and asset quality.",
    descriptionBn:
      "বাংলাদেশের শীর্ষস্থানীয় এসএমই ও রিটেইল ব্যাংক, মূলধন পর্যাপ্ততা ও সম্পদমানে ধারাবাহিকভাবে সবচেয়ে শক্তিশালী ব্যাংকগুলোর একটি।",
    savings: [
      {
        slug: "brac-triple-benefit-savings",
        name: "Triple Benefit Savings Account",
        nameBn: "ট্রিপল বেনিফিট সেভিংস অ্যাকাউন্ট",
        interestRate: 4.0,
        interestRateMax: 4.0,
        minOpeningBalance: 1000,
        minBalanceForInterest: 50000,
        maintenanceFee: 400,
        debitCardAnnualFee: 800,
        freeChequebook: true,
        interestPayout: "MONTHLY",
        onlineAccountOpening: true,
        segment: "GENERAL",
        popularity: 95,
        features: [
          "Monthly interest credit",
          "Fee waiver above ৳50,000 average balance",
          "Free Astha app banking",
          "Unlimited ATM withdrawals at BRAC ATMs",
        ],
        featuresBn: [
          "প্রতি মাসে মুনাফা প্রদান",
          "৫০,০০০ টাকার বেশি গড় স্থিতিতে ফি মওকুফ",
          "ফ্রি আস্থা অ্যাপ ব্যাংকিং",
          "ব্র্যাক এটিএমে সীমাহীন উত্তোলন",
        ],
      },
      {
        slug: "brac-savings-classic",
        name: "Savings Classic Account",
        nameBn: "সেভিংস ক্লাসিক অ্যাকাউন্ট",
        interestRate: 2.5,
        interestRateMax: 3.0,
        minOpeningBalance: 500,
        minBalanceForInterest: 5000,
        maintenanceFee: 300,
        debitCardAnnualFee: 800,
        freeChequebook: false,
        segment: "GENERAL",
        popularity: 80,
        features: ["Low opening balance", "Daily balance interest", "Nationwide branch access"],
        featuresBn: ["কম প্রারম্ভিক জমা", "দৈনিক স্থিতির ভিত্তিতে সুদ", "সারাদেশে শাখা সুবিধা"],
      },
      {
        slug: "brac-aporajita-savings",
        name: "Aporajita Savings Account (Women)",
        nameBn: "অপরাজিতা সেভিংস অ্যাকাউন্ট (নারী)",
        interestRate: 3.5,
        interestRateMax: 3.5,
        minOpeningBalance: 500,
        minBalanceForInterest: 10000,
        maintenanceFee: 200,
        freeDebitCard: true,
        freeChequebook: true,
        onlineAccountOpening: true,
        segment: "WOMEN",
        popularity: 77,
        features: ["Designed for women entrepreneurs", "Free debit card", "Discounted locker charges"],
        featuresBn: ["নারী উদ্যোক্তাদের জন্য", "ফ্রি ডেবিট কার্ড", "লকার চার্জে ছাড়"],
      },
      {
        slug: "brac-virtual-savings",
        name: "Virtual Savings Account",
        nameBn: "ভার্চুয়াল সেভিংস অ্যাকাউন্ট",
        interestRate: 4.0,
        interestRateMax: 4.0,
        minOpeningBalance: 0,
        minBalanceForInterest: 50000,
        maintenanceFee: 0,
        freeDebitCard: true,
        interestPayout: "MONTHLY",
        onlineAccountOpening: true,
        segment: "DIGITAL",
        popularity: 88,
        features: [
          "100% digital onboarding via Astha",
          "Multicurrency virtual card",
          "No maintenance fee above ৳50,000 average balance",
          "QR and e-commerce payments",
        ],
        featuresBn: [
          "আস্থা অ্যাপে শতভাগ ডিজিটাল হিসাব খোলা",
          "মাল্টিকারেন্সি ভার্চুয়াল কার্ড",
          "৫০,০০০ টাকার বেশি গড় স্থিতিতে ফি নেই",
          "কিউআর ও ই-কমার্স পেমেন্ট",
        ],
      },
    ],
    fdr: [
      {
        slug: "brac-fixed-deposit",
        name: "BRAC Bank Fixed Deposit",
        nameBn: "ব্র্যাক ব্যাংক ফিক্সড ডিপোজিট",
        minDeposit: 50000,
        interestPayout: "MATURITY",
        loanAgainstFdrPct: 90,
        features: ["Open from the Astha app", "Auto renewal", "Secured overdraft up to 90%", "Partial encashment"],
        featuresBn: ["আস্থা অ্যাপ থেকে খোলা যায়", "স্বয়ংক্রিয় নবায়ন", "৯০% পর্যন্ত সিকিউরড ওভারড্রাফট", "আংশিক নগদায়ন"],
        rates: [
          [1, 5.5],
          [3, 8.5],
          [6, 8.75],
          [12, 9.0],
          [24, 8.5],
          [36, 8.25],
        ],
      },
      {
        slug: "brac-interest-first-fd",
        name: "Interest First Fixed Deposit",
        nameBn: "ইন্টারেস্ট ফার্স্ট ফিক্সড ডিপোজিট",
        minDeposit: 100000,
        interestPayout: "MONTHLY",
        prematureEncashment: false,
        features: ["Full interest paid upfront at booking", "Minimum ৳1,00,000", "1-year tenure"],
        featuresBn: ["হিসাব খোলার সময়েই সম্পূর্ণ মুনাফা", "সর্বনিম্ন ১,০০,০০০ টাকা", "১ বছর মেয়াদ"],
        rates: [
          [12, 8.6],
          [24, 8.3],
        ],
      },
    ],
  },
  {
    slug: "dutch-bangla-bank",
    name: "Dutch-Bangla Bank PLC",
    nameBn: "ডাচ-বাংলা ব্যাংক পিএলসি",
    shortName: "DBBL",
    category: "PRIVATE",
    establishedYear: 1996,
    headquarters: "Motijheel, Dhaka",
    branchCount: 239,
    atmCount: 5000,
    website: "https://www.dutchbanglabank.com",
    swiftCode: "DBBLBDDH",
    brandColor: "#0057A6",
    logoInitials: "DB",
    rating: 4.3,
    reviewCount: 3120,
    mobileAppName: "Nexus Pay / Rocket",
    description:
      "Operator of the country's largest ATM network and the Rocket mobile financial service, with a sector-leading low-cost deposit base.",
    descriptionBn:
      "দেশের বৃহত্তম এটিএম নেটওয়ার্ক ও রকেট মোবাইল ব্যাংকিং সেবার পরিচালক, যার স্বল্প খরচের আমানত ভিত্তি খাতে শীর্ষস্থানীয়।",
    savings: [
      {
        slug: "dbbl-savings-deposit",
        name: "Savings Deposit Account",
        nameBn: "সেভিংস ডিপোজিট অ্যাকাউন্ট",
        interestRate: 2.5,
        interestRateMax: 3.0,
        minOpeningBalance: 500,
        minBalanceForInterest: 5000,
        maintenanceFee: 300,
        debitCardAnnualFee: 460,
        freeChequebook: true,
        onlineAccountOpening: true,
        segment: "GENERAL",
        popularity: 93,
        features: [
          "Access to 5,000+ DBBL ATMs",
          "Free Nexus Pay app",
          "Free internet banking",
          "Low opening balance",
        ],
        featuresBn: [
          "৫,০০০+ ডিবিবিএল এটিএম সুবিধা",
          "ফ্রি নেক্সাস পে অ্যাপ",
          "ফ্রি ইন্টারনেট ব্যাংকিং",
          "কম প্রারম্ভিক জমা",
        ],
      },
      {
        slug: "dbbl-excel-savings",
        name: "Excel Savings Account",
        nameBn: "এক্সেল সেভিংস অ্যাকাউন্ট",
        interestRate: 3.0,
        interestRateMax: 4.0,
        minOpeningBalance: 25000,
        minBalanceForInterest: 25000,
        maintenanceFee: 300,
        freeChequebook: true,
        freeDebitCard: true,
        interestPayout: "HALF_YEARLY",
        segment: "GENERAL",
        popularity: 70,
        features: ["Tiered rate on higher balances", "Free debit card", "Priority counter service"],
        featuresBn: ["বেশি স্থিতিতে বেশি হার", "ফ্রি ডেবিট কার্ড", "অগ্রাধিকার কাউন্টার সেবা"],
      },
      {
        slug: "dbbl-school-savers",
        name: "School Savers Account",
        nameBn: "স্কুল সেভার্স অ্যাকাউন্ট",
        interestRate: 3.5,
        interestRateMax: 3.5,
        minOpeningBalance: 100,
        minBalanceForInterest: 100,
        maintenanceFee: 0,
        freeChequebook: true,
        segment: "STUDENT",
        popularity: 61,
        features: ["For students under 18", "No maintenance fee", "Guardian-operated"],
        featuresBn: ["১৮ বছরের কম শিক্ষার্থীদের জন্য", "কোনো রক্ষণাবেক্ষণ ফি নেই", "অভিভাবক পরিচালিত"],
      },
    ],
    fdr: [
      {
        slug: "dbbl-term-deposit",
        name: "DBBL Term Deposit",
        nameBn: "ডিবিবিএল মেয়াদী আমানত",
        minDeposit: 10000,
        loanAgainstFdrPct: 90,
        features: ["Popular 13-month special tenure", "Auto renewal", "Loan against deposit up to 90%"],
        featuresBn: ["জনপ্রিয় ১৩ মাস মেয়াদ", "স্বয়ংক্রিয় নবায়ন", "আমানতের ৯০% পর্যন্ত ঋণ"],
        rates: [
          [1, 5.0],
          [3, 8.0],
          [6, 8.25],
          [12, 8.5],
          [13, 8.75],
          [24, 8.25],
          [36, 8.0],
        ],
      },
    ],
  },
  {
    slug: "the-city-bank",
    name: "The City Bank PLC",
    nameBn: "দি সিটি ব্যাংক পিএলসি",
    shortName: "City Bank",
    category: "PRIVATE",
    establishedYear: 1983,
    headquarters: "Gulshan, Dhaka",
    branchCount: 132,
    atmCount: 380,
    website: "https://www.citybankplc.com",
    swiftCode: "CIBLBDDH",
    brandColor: "#E4002B",
    logoInitials: "CB",
    rating: 4.4,
    reviewCount: 1990,
    mobileAppName: "Citytouch",
    description:
      "A digital-forward commercial bank with the country's largest credit-card portfolio (American Express issuer) and strong return on equity.",
    descriptionBn:
      "ডিজিটাল-কেন্দ্রিক বাণিজ্যিক ব্যাংক, দেশের বৃহত্তম ক্রেডিট কার্ড পোর্টফোলিও (অ্যামেক্স ইস্যুয়ার) এবং শক্তিশালী মুনাফা।",
    savings: [
      {
        slug: "city-general-savings",
        name: "City General Savings Account",
        nameBn: "সিটি জেনারেল সেভিংস অ্যাকাউন্ট",
        interestRate: 3.5,
        interestRateMax: 3.5,
        minOpeningBalance: 1000,
        minBalanceForInterest: 5000,
        maintenanceFee: 400,
        debitCardAnnualFee: 600,
        freeChequebook: true,
        onlineAccountOpening: true,
        segment: "GENERAL",
        popularity: 86,
        features: ["Citytouch digital banking", "Daily balance interest", "Discounts at partner merchants"],
        featuresBn: ["সিটিটাচ ডিজিটাল ব্যাংকিং", "দৈনিক স্থিতিতে সুদ", "পার্টনার মার্চেন্টে ছাড়"],
      },
      {
        slug: "city-basic-savings",
        name: "City Basic Savings Account",
        nameBn: "সিটি বেসিক সেভিংস অ্যাকাউন্ট",
        interestRate: 4.5,
        interestRateMax: 4.5,
        minOpeningBalance: 500,
        minBalanceForInterest: 1000,
        maintenanceFee: 200,
        freeChequebook: true,
        segment: "GENERAL",
        popularity: 84,
        features: ["Highest flat savings rate at City Bank", "Low minimum balance", "Free e-statement"],
        featuresBn: ["সিটি ব্যাংকের সর্বোচ্চ ফ্ল্যাট হার", "কম ন্যূনতম স্থিতি", "ফ্রি ই-স্টেটমেন্ট"],
      },
      {
        slug: "city-alo-savings-delight",
        name: "City Alo Savings Delight (Women)",
        nameBn: "সিটি আলো সেভিংস ডিলাইট (নারী)",
        interestRate: 3.5,
        interestRateMax: 4.5,
        minOpeningBalance: 100000,
        minBalanceForInterest: 100000,
        maintenanceFee: 400,
        freeDebitCard: true,
        segment: "WOMEN",
        popularity: 68,
        features: ["Slab rate up to 4.50% above ৳30 lakh", "Women-focused lifestyle privileges", "Free debit card"],
        featuresBn: ["৩০ লাখের বেশি স্থিতিতে ৪.৫০% পর্যন্ত", "নারীদের জন্য লাইফস্টাইল সুবিধা", "ফ্রি ডেবিট কার্ড"],
      },
    ],
    fdr: [
      {
        slug: "city-fixed-deposit",
        name: "City Bank Fixed Deposit",
        nameBn: "সিটি ব্যাংক ফিক্সড ডিপোজিট",
        minDeposit: 50000,
        loanAgainstFdrPct: 90,
        features: ["Book instantly on Citytouch", "Competitive 1-year rate", "Auto renewal with interest"],
        featuresBn: ["সিটিটাচে তাৎক্ষণিক খোলা", "প্রতিযোগিতামূলক ১ বছরের হার", "মুনাফাসহ স্বয়ংক্রিয় নবায়ন"],
        rates: [
          [1, 5.5],
          [3, 8.5],
          [6, 8.75],
          [12, 9.25],
          [24, 8.75],
          [36, 8.5],
        ],
      },
    ],
  },
  {
    slug: "eastern-bank",
    name: "Eastern Bank PLC",
    nameBn: "ইস্টার্ন ব্যাংক পিএলসি",
    shortName: "EBL",
    category: "PRIVATE",
    establishedYear: 1992,
    headquarters: "Gulshan, Dhaka",
    branchCount: 87,
    atmCount: 220,
    website: "https://www.ebl.com.bd",
    swiftCode: "EBLDBDDH",
    brandColor: "#0B4EA2",
    logoInitials: "EB",
    rating: 4.6,
    reviewCount: 1520,
    mobileAppName: "EBL Skybanking",
    description:
      "A premium urban bank known for service quality, low non-performing loans and one of the strongest returns on equity in the sector.",
    descriptionBn:
      "সেবার মান, কম খেলাপি ঋণ এবং খাতের অন্যতম সর্বোচ্চ মুনাফার জন্য পরিচিত একটি প্রিমিয়াম শহুরে ব্যাংক।",
    savings: [
      {
        slug: "ebl-repeat-savings",
        name: "EBL Repeat Savings Account",
        nameBn: "ইবিএল রিপিট সেভিংস অ্যাকাউন্ট",
        interestRate: 3.0,
        interestRateMax: 4.0,
        minOpeningBalance: 10000,
        minBalanceForInterest: 25000,
        maintenanceFee: 500,
        debitCardAnnualFee: 700,
        freeChequebook: true,
        interestPayout: "MONTHLY",
        onlineAccountOpening: true,
        segment: "GENERAL",
        popularity: 79,
        features: ["Monthly interest payout", "Skybanking app", "Airport lounge offers on premium tiers"],
        featuresBn: ["মাসিক মুনাফা প্রদান", "স্কাইব্যাংকিং অ্যাপ", "প্রিমিয়াম গ্রাহকদের লাউঞ্জ সুবিধা"],
      },
      {
        slug: "ebl-confidence-savings",
        name: "EBL Confidence (Senior Citizen)",
        nameBn: "ইবিএল কনফিডেন্স (প্রবীণ নাগরিক)",
        interestRate: 4.0,
        interestRateMax: 4.0,
        minOpeningBalance: 5000,
        minBalanceForInterest: 10000,
        maintenanceFee: 300,
        freeChequebook: true,
        freeDebitCard: true,
        segment: "SENIOR",
        popularity: 58,
        features: ["For customers aged 55+", "Priority branch service", "Free debit card and chequebook"],
        featuresBn: ["৫৫+ বয়সী গ্রাহকদের জন্য", "অগ্রাধিকার শাখা সেবা", "ফ্রি ডেবিট কার্ড ও চেকবই"],
      },
    ],
    fdr: [
      {
        slug: "ebl-fixed-deposit",
        name: "EBL Fixed Deposit",
        nameBn: "ইবিএল ফিক্সড ডিপোজিট",
        minDeposit: 50000,
        loanAgainstFdrPct: 90,
        features: ["Open via Skybanking", "Flexible tenures from 1 month", "Loan facility against deposit"],
        featuresBn: ["স্কাইব্যাংকিংয়ে খোলা যায়", "১ মাস থেকে নমনীয় মেয়াদ", "আমানতের বিপরীতে ঋণ সুবিধা"],
        rates: [
          [1, 5.25],
          [3, 8.25],
          [6, 8.5],
          [12, 9.0],
          [24, 8.6],
          [36, 8.4],
        ],
      },
    ],
  },
  {
    slug: "prime-bank",
    name: "Prime Bank PLC",
    nameBn: "প্রাইম ব্যাংক পিএলসি",
    shortName: "Prime Bank",
    category: "PRIVATE",
    establishedYear: 1995,
    headquarters: "Gulshan, Dhaka",
    branchCount: 146,
    atmCount: 175,
    website: "https://www.primebank.com.bd",
    swiftCode: "PRBLBDDH",
    brandColor: "#EC1C24",
    logoInitials: "PB",
    rating: 4.3,
    reviewCount: 980,
    mobileAppName: "MyPrime",
    description:
      "A well-capitalised commercial bank with strong provisioning coverage, a broad retail deposit range and a dedicated Islamic banking window.",
    descriptionBn:
      "শক্তিশালী মূলধন ও প্রভিশন কাভারেজসম্পন্ন বাণিজ্যিক ব্যাংক, বিস্তৃত রিটেইল আমানত পণ্য ও ইসলামিক ব্যাংকিং উইন্ডোসহ।",
    savings: [
      {
        slug: "prime-savings-account",
        name: "Prime Savings Account",
        nameBn: "প্রাইম সেভিংস অ্যাকাউন্ট",
        interestRate: 3.0,
        interestRateMax: 3.5,
        minOpeningBalance: 500,
        minBalanceForInterest: 10000,
        maintenanceFee: 300,
        debitCardAnnualFee: 600,
        freeChequebook: true,
        onlineAccountOpening: true,
        segment: "GENERAL",
        popularity: 74,
        features: ["Opens with just ৳500", "Daily interest accrual", "Half-yearly interest payout"],
        featuresBn: ["মাত্র ৫০০ টাকায় হিসাব", "দৈনিক ভিত্তিতে সুদ গণনা", "ছয় মাস অন্তর সুদ প্রদান"],
      },
      {
        slug: "prime-first-account",
        name: "Prime First Account (Student)",
        nameBn: "প্রাইম ফার্স্ট অ্যাকাউন্ট (শিক্ষার্থী)",
        interestRate: 3.5,
        interestRateMax: 3.5,
        minOpeningBalance: 0,
        minBalanceForInterest: 0,
        maintenanceFee: 0,
        freeDebitCard: true,
        freeChequebook: true,
        segment: "STUDENT",
        popularity: 63,
        features: ["No minimum balance", "Free debit card and internet banking", "For students under 18"],
        featuresBn: ["কোনো ন্যূনতম স্থিতি নেই", "ফ্রি ডেবিট কার্ড ও ইন্টারনেট ব্যাংকিং", "১৮ বছরের কম শিক্ষার্থীদের জন্য"],
      },
      {
        slug: "prime-neera-savings",
        name: "Neera Savings Account (Women)",
        nameBn: "নীরা সেভিংস অ্যাকাউন্ট (নারী)",
        interestRate: 3.25,
        interestRateMax: 3.25,
        minOpeningBalance: 1000,
        minBalanceForInterest: 10000,
        maintenanceFee: 200,
        freeDebitCard: true,
        segment: "WOMEN",
        popularity: 55,
        features: ["Women-only banking privileges", "Free debit card", "Preferential loan pricing"],
        featuresBn: ["শুধু নারীদের জন্য সুবিধা", "ফ্রি ডেবিট কার্ড", "ঋণে অগ্রাধিকারমূলক হার"],
      },
    ],
    fdr: [
      {
        slug: "prime-fixed-deposit",
        name: "Prime Bank Fixed Deposit",
        nameBn: "প্রাইম ব্যাংক ফিক্সড ডিপোজিট",
        minDeposit: 25000,
        loanAgainstFdrPct: 90,
        features: ["Among the most competitive 6–12 month rates", "Auto renewal", "Monthly income option available"],
        featuresBn: ["৬–১২ মাসে প্রতিযোগিতামূলক হার", "স্বয়ংক্রিয় নবায়ন", "মাসিক আয় সুবিধা"],
        rates: [
          [1, 5.5],
          [3, 8.75],
          [6, 9.0],
          [12, 9.25],
          [24, 8.75],
          [36, 8.5],
        ],
      },
      {
        slug: "prime-monthly-benefit-deposit",
        name: "Monthly Benefit Deposit Scheme",
        nameBn: "মাসিক মুনাফা আমানত প্রকল্প",
        minDeposit: 100000,
        interestPayout: "MONTHLY",
        features: ["Fixed monthly income", "3 or 5 year tenure", "Minimum ৳1,00,000"],
        featuresBn: ["নির্দিষ্ট মাসিক আয়", "৩ বা ৫ বছর মেয়াদ", "সর্বনিম্ন ১,০০,০০০ টাকা"],
        rates: [
          [36, 8.6],
          [60, 8.75],
        ],
      },
    ],
  },
  {
    slug: "pubali-bank",
    name: "Pubali Bank PLC",
    nameBn: "পূবালী ব্যাংক পিএলসি",
    shortName: "Pubali Bank",
    category: "PRIVATE",
    establishedYear: 1959,
    headquarters: "Motijheel, Dhaka",
    branchCount: 495,
    atmCount: 210,
    website: "https://www.pubalibangla.com",
    swiftCode: "PUBABDDH",
    brandColor: "#00843D",
    logoInitials: "PU",
    rating: 4.1,
    reviewCount: 860,
    mobileAppName: "Pi (Pubali Internet)",
    description:
      "The largest private-sector branch network in Bangladesh, with deep rural reach and consistently high FDR rates.",
    descriptionBn:
      "বাংলাদেশের বৃহত্তম বেসরকারি শাখা নেটওয়ার্ক, গ্রামীণ এলাকায় ব্যাপক উপস্থিতি এবং ধারাবাহিকভাবে উচ্চ এফডিআর হার।",
    savings: [
      {
        slug: "pubali-savings-account",
        name: "Pubali Savings Bank Account",
        nameBn: "পূবালী সঞ্চয়ী হিসাব",
        interestRate: 2.0,
        interestRateMax: 2.25,
        minOpeningBalance: 500,
        minBalanceForInterest: 5000,
        maintenanceFee: 300,
        debitCardAnnualFee: 460,
        freeChequebook: true,
        segment: "GENERAL",
        popularity: 71,
        features: ["Largest private branch network", "Low opening balance", "Rural and semi-urban coverage"],
        featuresBn: ["বৃহত্তম বেসরকারি শাখা নেটওয়ার্ক", "কম প্রারম্ভিক জমা", "গ্রামীণ ও উপশহর কাভারেজ"],
      },
      {
        slug: "pubali-swadhin-sanchaya",
        name: "Pubali Swadhin Sanchaya",
        nameBn: "পূবালী স্বাধীন সঞ্চয়",
        interestRate: 4.5,
        interestRateMax: 5.0,
        minOpeningBalance: 100000,
        minBalanceForInterest: 100000,
        maintenanceFee: 300,
        interestPayout: "QUARTERLY",
        segment: "GENERAL",
        popularity: 66,
        features: ["High-balance savings with near-FDR returns", "Quarterly payout", "Cheque facility retained"],
        featuresBn: ["উচ্চ স্থিতিতে এফডিআর-সদৃশ রিটার্ন", "ত্রৈমাসিক প্রদান", "চেক সুবিধা বহাল"],
      },
    ],
    fdr: [
      {
        slug: "pubali-fixed-deposit",
        name: "Pubali Fixed Deposit Receipt",
        nameBn: "পূবালী ফিক্সড ডিপোজিট রিসিট",
        minDeposit: 10000,
        loanAgainstFdrPct: 90,
        features: ["100-day special tenure", "Low ৳10,000 minimum", "Available at 495 branches"],
        featuresBn: ["১০০ দিনের বিশেষ মেয়াদ", "সর্বনিম্ন ১০,০০০ টাকা", "৪৯৫ শাখায় সুবিধা"],
        rates: [
          [1, 5.0],
          [3, 8.5],
          [6, 8.75],
          [12, 9.0],
          [24, 8.75],
          [36, 8.5],
        ],
      },
    ],
  },
  {
    slug: "sonali-bank",
    name: "Sonali Bank PLC",
    nameBn: "সোনালী ব্যাংক পিএলসি",
    shortName: "Sonali Bank",
    category: "STATE_OWNED",
    establishedYear: 1972,
    headquarters: "Motijheel, Dhaka",
    branchCount: 1230,
    atmCount: 500,
    website: "https://www.sonalibank.com.bd",
    swiftCode: "BSONBDDH",
    brandColor: "#0B7A3C",
    logoInitials: "SB",
    rating: 3.6,
    reviewCount: 2240,
    mobileAppName: "Sonali eSheba",
    description:
      "The largest state-owned commercial bank, handling government salary, pension and treasury business through the widest branch network in the country.",
    descriptionBn:
      "বৃহত্তম রাষ্ট্রায়ত্ত বাণিজ্যিক ব্যাংক, দেশের সবচেয়ে বিস্তৃত শাখা নেটওয়ার্কের মাধ্যমে সরকারি বেতন, পেনশন ও ট্রেজারি কার্যক্রম পরিচালনা করে।",
    savings: [
      {
        slug: "sonali-savings-account",
        name: "Sonali Savings Account",
        nameBn: "সোনালী সঞ্চয়ী হিসাব",
        interestRate: 4.5,
        interestRateMax: 5.0,
        minOpeningBalance: 500,
        minBalanceForInterest: 1000,
        maintenanceFee: 200,
        debitCardAnnualFee: 345,
        freeChequebook: true,
        segment: "GENERAL",
        popularity: 90,
        features: [
          "1,200+ branches nationwide",
          "Government salary and pension disbursement",
          "State-owned, sovereign backing",
        ],
        featuresBn: ["সারাদেশে ১,২০০+ শাখা", "সরকারি বেতন ও পেনশন বিতরণ", "রাষ্ট্রায়ত্ত, সরকারি নিশ্চয়তা"],
      },
      {
        slug: "sonali-school-banking",
        name: "Sonali School Banking Account",
        nameBn: "সোনালী স্কুল ব্যাংকিং হিসাব",
        interestRate: 4.0,
        interestRateMax: 4.0,
        minOpeningBalance: 100,
        minBalanceForInterest: 100,
        maintenanceFee: 0,
        freeChequebook: true,
        segment: "STUDENT",
        popularity: 52,
        features: ["Opens with ৳100", "No maintenance fee", "Available at every branch"],
        featuresBn: ["১০০ টাকায় হিসাব খোলা", "কোনো রক্ষণাবেক্ষণ ফি নেই", "সব শাখায় সুবিধা"],
      },
    ],
    fdr: [
      {
        slug: "sonali-fixed-deposit",
        name: "Sonali Bank Fixed Deposit",
        nameBn: "সোনালী ব্যাংক স্থায়ী আমানত",
        minDeposit: 10000,
        loanAgainstFdrPct: 80,
        features: ["Government-owned security", "Available at 1,200+ branches", "Low minimum deposit"],
        featuresBn: ["সরকারি মালিকানাধীন নিরাপত্তা", "১,২০০+ শাখায় সুবিধা", "কম ন্যূনতম আমানত"],
        rates: [
          [3, 8.0],
          [6, 8.25],
          [12, 8.5],
          [24, 8.25],
          [36, 8.0],
        ],
      },
    ],
  },
  {
    slug: "standard-chartered-bangladesh",
    name: "Standard Chartered Bank Bangladesh",
    nameBn: "স্ট্যান্ডার্ড চার্টার্ড ব্যাংক বাংলাদেশ",
    shortName: "StanChart",
    category: "FOREIGN",
    establishedYear: 1905,
    headquarters: "Gulshan, Dhaka",
    branchCount: 21,
    atmCount: 55,
    website: "https://www.sc.com/bd",
    swiftCode: "SCBLBDDX",
    brandColor: "#0473EA",
    logoInitials: "SC",
    rating: 4.4,
    reviewCount: 1130,
    mobileAppName: "SC Mobile",
    description:
      "The country's oldest and largest foreign bank, focused on premium banking, wealth management and multinational corporate clients.",
    descriptionBn:
      "দেশের প্রাচীনতম ও বৃহত্তম বিদেশি ব্যাংক, প্রিমিয়াম ব্যাংকিং, সম্পদ ব্যবস্থাপনা ও বহুজাতিক করপোরেট গ্রাহকদের সেবা দেয়।",
    savings: [
      {
        slug: "sc-savers-account",
        name: "Savers Account",
        nameBn: "সেভার্স অ্যাকাউন্ট",
        interestRate: 2.5,
        interestRateMax: 3.0,
        minOpeningBalance: 25000,
        minBalanceForInterest: 25000,
        maintenanceFee: 600,
        debitCardAnnualFee: 1000,
        freeChequebook: false,
        onlineAccountOpening: true,
        segment: "GENERAL",
        popularity: 57,
        features: ["Global network access", "SC Mobile app", "International debit card"],
        featuresBn: ["বৈশ্বিক নেটওয়ার্ক সুবিধা", "এসসি মোবাইল অ্যাপ", "আন্তর্জাতিক ডেবিট কার্ড"],
      },
      {
        slug: "sc-priority-savings",
        name: "Priority Banking Savings",
        nameBn: "প্রায়োরিটি ব্যাংকিং সেভিংস",
        interestRate: 3.0,
        interestRateMax: 3.5,
        minOpeningBalance: 3000000,
        minBalanceForInterest: 3000000,
        maintenanceFee: 0,
        freeChequebook: true,
        freeDebitCard: true,
        segment: "GENERAL",
        popularity: 40,
        features: ["Relationship manager", "Airport lounge access", "Global Priority recognition"],
        featuresBn: ["রিলেশনশিপ ম্যানেজার", "এয়ারপোর্ট লাউঞ্জ সুবিধা", "গ্লোবাল প্রায়োরিটি স্বীকৃতি"],
      },
    ],
    fdr: [
      {
        slug: "sc-fixed-deposit",
        name: "Standard Chartered Fixed Deposit",
        nameBn: "স্ট্যান্ডার্ড চার্টার্ড ফিক্সড ডিপোজিট",
        minDeposit: 100000,
        loanAgainstFdrPct: 90,
        features: ["Booking via SC Mobile", "Foreign-bank counterparty strength", "Flexible tenures"],
        featuresBn: ["এসসি মোবাইলে খোলা যায়", "বিদেশি ব্যাংকের নিরাপত্তা", "নমনীয় মেয়াদ"],
        rates: [
          [3, 7.5],
          [6, 7.75],
          [12, 8.0],
          [24, 7.75],
        ],
      },
    ],
  },
  {
    slug: "bank-asia",
    name: "Bank Asia PLC",
    nameBn: "ব্যাংক এশিয়া পিএলসি",
    shortName: "Bank Asia",
    category: "PRIVATE",
    establishedYear: 1999,
    headquarters: "Gulshan, Dhaka",
    branchCount: 136,
    atmCount: 165,
    website: "https://www.bankasia-bd.com",
    swiftCode: "BALBBDDH",
    brandColor: "#00A651",
    logoInitials: "BA",
    rating: 4.0,
    reviewCount: 740,
    mobileAppName: "Smart App",
    description:
      "A technology-focused commercial bank and the country's largest agent-banking operator, with an Islamic banking window alongside conventional products.",
    descriptionBn:
      "প্রযুক্তিনির্ভর বাণিজ্যিক ব্যাংক ও দেশের বৃহত্তম এজেন্ট ব্যাংকিং পরিচালক, প্রচলিত পণ্যের পাশাপাশি ইসলামিক ব্যাংকিং উইন্ডোসহ।",
    savings: [
      {
        slug: "bank-asia-savings",
        name: "Bank Asia Savings Account",
        nameBn: "ব্যাংক এশিয়া সঞ্চয়ী হিসাব",
        interestRate: 2.0,
        interestRateMax: 3.0,
        minOpeningBalance: 500,
        minBalanceForInterest: 5000,
        maintenanceFee: 300,
        debitCardAnnualFee: 500,
        freeChequebook: true,
        onlineAccountOpening: true,
        segment: "GENERAL",
        popularity: 62,
        features: ["Largest agent banking network", "Smart App banking", "Low opening balance"],
        featuresBn: ["বৃহত্তম এজেন্ট ব্যাংকিং নেটওয়ার্ক", "স্মার্ট অ্যাপ ব্যাংকিং", "কম প্রারম্ভিক জমা"],
      },
      {
        slug: "bank-asia-smart-saver",
        name: "Bank Asia Smart Saver",
        nameBn: "ব্যাংক এশিয়া স্মার্ট সেভার",
        interestRate: 3.0,
        interestRateMax: 6.0,
        minOpeningBalance: 100000,
        minBalanceForInterest: 100000,
        maintenanceFee: 300,
        interestPayout: "QUARTERLY",
        segment: "GENERAL",
        popularity: 69,
        features: ["Tiered slabs up to 6.00%", "Interest on average balance", "Full cheque and card access"],
        featuresBn: ["৬.০০% পর্যন্ত ধাপভিত্তিক হার", "গড় স্থিতিতে সুদ", "সম্পূর্ণ চেক ও কার্ড সুবিধা"],
      },
      {
        slug: "bank-asia-islamic-savings",
        name: "Islamic Mudaraba Savings",
        nameBn: "ইসলামিক মুদারাবা সঞ্চয়ী",
        interestRate: 2.75,
        interestRateMax: 3.25,
        minOpeningBalance: 500,
        minBalanceForInterest: 5000,
        maintenanceFee: 300,
        isShariah: true,
        segment: "GENERAL",
        popularity: 48,
        features: ["Shariah-compliant window", "Profit-sharing basis", "Same branch network"],
        featuresBn: ["শরিয়াহসম্মত উইন্ডো", "মুনাফা বণ্টন ভিত্তিতে", "একই শাখা নেটওয়ার্ক"],
      },
    ],
    fdr: [
      {
        slug: "bank-asia-fixed-deposit",
        name: "Bank Asia Fixed Deposit",
        nameBn: "ব্যাংক এশিয়া ফিক্সড ডিপোজিট",
        minDeposit: 25000,
        loanAgainstFdrPct: 90,
        features: ["Among the highest 1-year rates", "Agent banking access", "Auto renewal"],
        featuresBn: ["১ বছরে অন্যতম সর্বোচ্চ হার", "এজেন্ট ব্যাংকিং সুবিধা", "স্বয়ংক্রিয় নবায়ন"],
        rates: [
          [1, 5.5],
          [3, 8.75],
          [6, 9.0],
          [12, 9.25],
          [24, 8.75],
          [36, 8.5],
        ],
      },
    ],
  },
];

/** Recent rate movements shown in the "rate watch" ticker */
const RATE_CHANGES: {
  bankSlug: string;
  productType: string;
  productName: string;
  oldRate: number;
  newRate: number;
  daysAgo: number;
}[] = [
  { bankSlug: "bank-asia", productType: "FDR", productName: "Bank Asia Fixed Deposit (1Y)", oldRate: 9.0, newRate: 9.25, daysAgo: 4 },
  { bankSlug: "the-city-bank", productType: "FDR", productName: "City Bank Fixed Deposit (1Y)", oldRate: 9.0, newRate: 9.25, daysAgo: 9 },
  { bankSlug: "brac-bank", productType: "SAVINGS", productName: "Triple Benefit Savings Account", oldRate: 3.75, newRate: 4.0, daysAgo: 12 },
  { bankSlug: "dutch-bangla-bank", productType: "FDR", productName: "DBBL Term Deposit (13M)", oldRate: 9.0, newRate: 8.75, daysAgo: 16 },
  { bankSlug: "prime-bank", productType: "FDR", productName: "Prime Bank Fixed Deposit (6M)", oldRate: 8.75, newRate: 9.0, daysAgo: 21 },
  { bankSlug: "standard-chartered-bangladesh", productType: "FDR", productName: "Standard Chartered FD (1Y)", oldRate: 8.25, newRate: 8.0, daysAgo: 27 },
  { bankSlug: "islami-bank-bangladesh", productType: "FDR", productName: "Mudaraba Term Deposit (1Y)", oldRate: 8.5, newRate: 8.75, daysAgo: 33 },
];

async function main() {
  console.log("🌱 Seeding BankCompare BD…");

  await prisma.rateChange.deleteMany();
  await prisma.fdrRate.deleteMany();
  await prisma.fdrProduct.deleteMany();
  await prisma.savingsAccount.deleteMany();
  await prisma.creditCard.deleteMany();
  await prisma.loanProduct.deleteMany();
  await prisma.dpsProduct.deleteMany();
  await prisma.cardDeal.deleteMany();
  await prisma.bankRouting.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.bank.deleteMany();

  const ALL_BANKS = [...BANKS, ...EXTENDED_BANKS];

  for (const b of ALL_BANKS) {
    const bank = await prisma.bank.create({
      data: {
        slug: b.slug,
        name: b.name,
        nameBn: b.nameBn,
        shortName: b.shortName,
        category: b.category,
        isShariah: b.isShariah ?? false,
        establishedYear: b.establishedYear,
        headquarters: b.headquarters,
        branchCount: b.branchCount,
        atmCount: b.atmCount,
        website: b.website,
        swiftCode: b.swiftCode,
        brandColor: b.brandColor,
        logoInitials: b.logoInitials,
        rating: b.rating,
        reviewCount: b.reviewCount,
        mobileAppName: b.mobileAppName,
        description: b.description,
        descriptionBn: b.descriptionBn,
      },
    });

    for (const s of b.savings) {
      await prisma.savingsAccount.create({
        data: {
          slug: s.slug,
          bankId: bank.id,
          name: s.name,
          nameBn: s.nameBn,
          interestRate: s.interestRate,
          interestRateMax: s.interestRateMax ?? s.interestRate,
          minOpeningBalance: s.minOpeningBalance,
          minBalanceForInterest: s.minBalanceForInterest ?? 0,
          maintenanceFee: s.maintenanceFee ?? 0,
          debitCardAnnualFee: s.debitCardAnnualFee ?? 0,
          freeChequebook: s.freeChequebook ?? false,
          freeDebitCard: s.freeDebitCard ?? false,
          interestPayout: s.interestPayout ?? "HALF_YEARLY",
          dailyBalanceInterest: s.dailyBalanceInterest ?? true,
          onlineAccountOpening: s.onlineAccountOpening ?? false,
          segment: s.segment ?? "GENERAL",
          isShariah: s.isShariah ?? b.isShariah ?? false,
          features: JSON.stringify(s.features),
          featuresBn: JSON.stringify(s.featuresBn),
          popularity: s.popularity ?? 50,
          effectiveFrom: VERIFIED,
        },
      });
    }

    for (const f of b.fdr) {
      await prisma.fdrProduct.create({
        data: {
          slug: f.slug,
          bankId: bank.id,
          name: f.name,
          nameBn: f.nameBn,
          minDeposit: f.minDeposit,
          maxDeposit: f.maxDeposit ?? null,
          interestPayout: f.interestPayout ?? "MATURITY",
          prematureEncashment: f.prematureEncashment ?? true,
          autoRenewal: f.autoRenewal ?? true,
          loanAgainstFdrPct: f.loanAgainstFdrPct ?? null,
          isShariah: f.isShariah ?? b.isShariah ?? false,
          features: JSON.stringify(f.features),
          featuresBn: JSON.stringify(f.featuresBn),
          effectiveFrom: VERIFIED,
          rates: {
            create: f.rates.map(([tenureMonths, rate]) => ({
              tenureMonths,
              rate,
              minAmount: f.minDeposit,
            })),
          },
        },
      });
    }
  }

  const bankIdBySlug = new Map(
    (await prisma.bank.findMany({ select: { id: true, slug: true } })).map((b) => [b.slug, b.id])
  );

  const ALL_CREDIT_CARDS = [...CREDIT_CARDS_DATA, ...EXTENDED_CREDIT_CARDS];

  for (const group of ALL_CREDIT_CARDS) {
    const bankId = bankIdBySlug.get(group.bankSlug);
    if (!bankId) continue;
    for (const c of group.cards) {
      await prisma.creditCard.create({
        data: {
          slug: c.slug,
          bankId,
          name: c.name,
          nameBn: c.nameBn,
          network: c.network,
          tier: c.tier,
          annualFee: c.annualFee,
          feeWaiverCondition: c.feeWaiverCondition ?? null,
          feeWaiverConditionBn: c.feeWaiverConditionBn ?? null,
          interestRateMonthly: c.interestRateMonthly ?? 1.67,
          interestRateAnnual: c.interestRateAnnual ?? 20.0,
          interestFreeDays: c.interestFreeDays ?? 45,
          minIncome: c.minIncome,
          isDualCurrency: c.isDualCurrency ?? true,
          airportLoungeAccess: c.airportLoungeAccess ?? false,
          loungeDetails: c.loungeDetails ?? null,
          loungeDetailsBn: c.loungeDetailsBn ?? null,
          rewardType: c.rewardType ?? "REWARDS",
          rewardSummary: c.rewardSummary ?? "",
          rewardSummaryBn: c.rewardSummaryBn ?? "",
          zeroPctEmiAvailable: c.zeroPctEmiAvailable ?? true,
          maxEmiMonths: c.maxEmiMonths ?? 24,
          contactless: c.contactless ?? true,
          isShariah: c.isShariah ?? false,
          cardColor: c.cardColor ?? "#1e293b",
          features: JSON.stringify(c.features),
          featuresBn: JSON.stringify(c.featuresBn),
          popularity: c.popularity ?? 50,
          effectiveFrom: VERIFIED,
        },
      });
    }
  }

  for (const group of LOANS_DATA) {
    const bankId = bankIdBySlug.get(group.bankSlug);
    if (!bankId) continue;
    for (const l of group.loans) {
      await prisma.loanProduct.create({
        data: {
          slug: l.slug,
          bankId,
          name: l.name,
          nameBn: l.nameBn,
          loanType: l.loanType,
          interestRateMin: l.interestRateMin,
          interestRateMax: l.interestRateMax,
          minAmount: l.minAmount,
          maxAmount: l.maxAmount,
          minTenureMonths: l.minTenureMonths,
          maxTenureMonths: l.maxTenureMonths,
          processingFeePct: l.processingFeePct ?? 0.5,
          minIncome: l.minIncome,
          isShariah: l.isShariah ?? false,
          features: JSON.stringify(l.features),
          featuresBn: JSON.stringify(l.featuresBn),
          popularity: l.popularity ?? 50,
          effectiveFrom: VERIFIED,
        },
      });
    }
  }

  // Seed DPS Products
  for (const dps of DPS_PRODUCTS_DATA) {
    const bankId = bankIdBySlug.get(dps.bankSlug);
    if (!bankId) continue;
    await prisma.dpsProduct.create({
      data: {
        slug: dps.slug,
        bankId,
        name: dps.name,
        nameBn: dps.nameBn,
        minMonthlyDeposit: dps.minMonthlyDeposit,
        maxMonthlyDeposit: dps.maxMonthlyDeposit,
        interestRate: dps.interestRate,
        tenureYears: dps.tenureYears,
        isShariah: dps.isShariah ?? false,
        features: JSON.stringify(dps.features),
        featuresBn: JSON.stringify(dps.featuresBn),
        popularity: dps.popularity ?? 50,
      },
    });
  }

  // Seed Credit Card Deals
  for (const deal of CARD_DEALS_DATA) {
    await prisma.cardDeal.create({
      data: {
        slug: deal.slug,
        title: deal.title,
        titleBn: deal.titleBn,
        bankSlug: deal.bankSlug,
        bankName: deal.bankName,
        cardTier: deal.cardTier,
        category: deal.category,
        merchantName: deal.merchantName,
        discountDetails: deal.discountDetails,
        discountDetailsBn: deal.discountDetailsBn,
        city: deal.city,
        location: deal.location ?? null,
        bannerBadge: deal.bannerBadge ?? null,
        terms: deal.terms ?? null,
        termsBn: deal.termsBn ?? null,
        popularity: deal.popularity ?? 50,
      },
    });
  }

  // Seed Routing Numbers
  for (const r of ROUTING_NUMBERS_DATA) {
    await prisma.bankRouting.create({
      data: {
        bankSlug: r.bankSlug,
        bankName: r.bankName,
        bankNameBn: r.bankNameBn,
        branchName: r.branchName,
        branchNameBn: r.branchNameBn,
        district: r.district,
        districtBn: r.districtBn,
        routingNumber: r.routingNumber,
        swiftCode: r.swiftCode ?? null,
        address: r.address ?? null,
      },
    });
  }

  for (const rc of RATE_CHANGES) {
    const bankId = bankIdBySlug.get(rc.bankSlug);
    if (!bankId) continue;
    await prisma.rateChange.create({
      data: {
        bankId,
        productType: rc.productType,
        productId: rc.bankSlug,
        productName: rc.productName,
        oldRate: rc.oldRate,
        newRate: rc.newRate,
        changedAt: new Date(Date.now() - rc.daysAgo * 86400000),
      },
    });
  }

  const [banks, savings, fdr, rates, cards, loans, dpsCount, dealsCount, routingCount] = await Promise.all([
    prisma.bank.count(),
    prisma.savingsAccount.count(),
    prisma.fdrProduct.count(),
    prisma.fdrRate.count(),
    prisma.creditCard.count(),
    prisma.loanProduct.count(),
    prisma.dpsProduct.count(),
    prisma.cardDeal.count(),
    prisma.bankRouting.count(),
  ]);
  console.log(
    `✅ ${banks} banks · ${savings} savings · ${fdr} FDR · ${rates} rate slabs · ${cards} credit cards · ${loans} loans · ${dpsCount} DPS · ${dealsCount} card deals · ${routingCount} routing records`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

# BankBhai (ব্যাংকভাই)

Independent financial aggregator and intelligence platform for Bangladeshi banking products: savings accounts, fixed deposits (FDR), credit cards, B1G1 deals, loans, and calculators.
Built with Next.js 15 (App Router), TypeScript, Tailwind CSS v4 and Prisma.

**Features delivered:**
- **27 Scheduled Banks Monitored** (Commercial, Islamic, Multinational, and Specialized)
- **Savings Account Comparison** (filter + sort + 3-way side-by-side compare)
- **FDR Rate Comparison & Calculator** (10%/15% source tax, maturity schedule)
- **Credit Card Explorer & Comparison** (annual fees, fee waivers, airport lounge access, 0% EMI, rewards, side-by-side card compare matrix)
- **Buy-1-Get-1 Deals & Luxury Buffets Hub** (Westin, Le Méridien, InterContinental, Radisson, Sheraton, Amari)
- **Card Matcher Quiz** (find ideal card in 60 seconds based on income and benefits)
- **DPS Post-Tax Maturity Calculator** (compound interest, NBR source tax & excise duty deductions)
- **Retail Loans & Credit Facilities** (Personal, Home & Auto loans across all 27 banks with live interactive EMI simulator)
- **Bangladesh Bank 9-digit Routing Numbers & SWIFT Codes Directory**
- **Automated Weekly Data Updater** (SMART benchmark drifts, rate change audit logs, Sunday Vercel Cron)
- **Full EN / BN Localisation**, Bengali numerals, BDT lakh/crore formatting
- **SEO & Structured Data** (JSON-LD ItemLists, WebApplication, breadcrumbs, sitemap)

---

## Quick start

```bash
npm install            # install dependencies and run prisma generate
npm run db:push        # sync SQLite schema (dev.db)
npm run db:seed        # seed 10 banks · 27 savings · 12 FDR · 62 slabs · 18 credit cards · 18 loans
npm run dev            # start development server at http://localhost:3000
```

Other scripts:

| Script | Purpose |
| --- | --- |
| `npm run build` / `npm start` | Production build & server |
| `npm run db:studio` | Prisma Studio (browse/edit data) |
| `npm run lint` | ESLint |

Environment (`.env`):

```
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

---

## Project structure

```
prisma/
  schema.prisma          Bank, SavingsAccount, FdrProduct, FdrRate, RateChange
  seed.ts                Top-10 bank dataset (rates, fees, features, EN + BN copy)
  dev.db                 SQLite database (generated)
src/
  app/
    layout.tsx           Fonts, global metadata, Organization + WebSite JSON-LD
    page.tsx             Home: hero, rate ticker, top FDR, best savings, banks, FAQ
    savings/page.tsx     Savings comparison (SSR + BankAccount ItemList JSON-LD)
    fdr/page.tsx         FDR comparison + calculator (FinancialProduct JSON-LD)
    banks/page.tsx       Bank directory
    banks/[slug]/        Bank profile (SSG, BankOrCreditUnion JSON-LD)
    calculators/fdr|emi  Standalone calculator pages (WebApplication JSON-LD)
    sitemap.ts robots.ts SEO plumbing
    privacy/ terms/      Legal pages
  components/
    Header, Footer, LanguageToggle, RateTicker, BankLogo, JsonLd, ui
    SavingsExplorer      Filter/sort/compare engine for savings accounts
    FdrExplorer          Tenure-based FDR table with post-tax maturity
    FdrCalculator        Maturity + source-tax calculator
    EmiCalculator        Reducing-balance loan instalment calculator
  lib/
    prisma.ts            Prisma singleton
    queries.ts           Serialisable query layer used by server components
    format.ts            BDT formatting, Bengali numerals, DD/MM/YYYY, FDR/EMI maths
    i18n/                config · dictionaries (EN/BN) · server helpers
    site.ts              Canonical site URL
```

---

## Data model

| Model | Notes |
| --- | --- |
| `Bank` | Identity, category (`STATE_OWNED / PRIVATE / ISLAMIC / FOREIGN / SPECIALIZED`), branch & ATM counts, brand colour, rating, EN + BN description |
| `SavingsAccount` | Headline and top-slab rate, opening balance, balance needed for interest, fees, payout frequency, segment (`GENERAL / STUDENT / WOMEN / SENIOR / DIGITAL / NRB`), Shariah flag, feature lists in both languages |
| `FdrProduct` + `FdrRate` | One product → many tenure slabs (1, 3, 6, 12, 13, 24, 36, 60 months) with per-slab rate and minimum amount |
| `RateChange` | Audit trail of rate movements — powers the "Rate watch" ticker and the Phase 3 alert system |

SQLite is used for the MVP. To move to Postgres, change the `datasource` provider and run `prisma migrate deploy`; no application code changes are required.

### Rate data
Rates are indicative figures compiled from banks' published deposit-rate schedules for the 2025–26 cycle
(1-year FDR clusters around 8.00–9.25%, savings between 2.00% and 6.00% on tiered products).
Every product carries an `effectiveFrom` "last verified" date that is surfaced in the UI, and a disclaimer is shown on
every comparison page. **Verify with each bank before publishing commercially.**

---

## Features implemented

**Savings comparison** — search, minimum-rate slider, maximum opening balance, account-type and bank-type chips,
per-bank checkboxes, feature filters (Shariah, online opening, free card/chequebook, no maintenance fee), six sort
orders, a balance box that projects yearly interest net of fees, side-by-side comparison of up to three accounts,
URL-synced state (shareable/bookmarkable), mobile filter drawer.

**FDR comparison** — tenure tabs, deposit amount, live maturity and post-tax interest per bank, 10%/15% source-tax
toggle (TIN vs no TIN), sortable table on desktop with card layout on mobile, ineligible products dimmed when the
deposit is below the minimum, "best for this tenure" highlight.

**Calculators** — FDR maturity (simple or quarterly compounding, source tax, effective annual return, one-click
"use the best market rate") and EMI (reducing balance, loan-type presets, principal/interest split, print to PDF).

**Localisation** — full EN/BN dictionary, cookie-based locale so pages stay server-rendered, optional Bengali
numerals (১২৩), ৳ BDT formatting with lakh/crore grouping, DD/MM/YYYY dates, Noto Sans Bengali.

**SEO** — SSR on every comparison page, JSON-LD (Organization, WebSite+SearchAction, FAQPage, ItemList of
FinancialProduct/BankAccount, BankOrCreditUnion, BreadcrumbList, WebApplication), keyword-targeted titles and
descriptions, canonical URLs, `sitemap.xml`, `robots.txt`, no external image requests (bank marks are rendered
inline), ~102 kB first-load JS.

---

## Roadmap

- **Phase 2** — loans, credit cards, DPS; remaining calculators; all scheduled banks; blog.
- **Phase 3** — mobile banking (bKash/Nagad/Rocket), branch & ATM locator, admin panel (CRUD, CSV/Excel import, rate-change history, rich-text editor), accounts & reviews, rate alerts.
- **Phase 4** — personalised recommendations, analytics, PWA, public API, further performance work.

## Disclaimer

BankBhai is not a bank and does not sell financial products. Information is for general guidance only and is not
financial advice.

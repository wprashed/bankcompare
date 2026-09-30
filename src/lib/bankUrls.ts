/**
 * Bank application & direct portal URLs for Bangladeshi banks.
 * Maps bank slugs and product types to official application and product portals.
 */

const BANK_PRODUCT_URLS: Record<string, Partial<Record<string, string>>> = {
  "brac-bank": {
    CARD: "https://www.bracbank.com/en/retail/cards",
    LOAN: "https://www.bracbank.com/en/retail/loans",
    DPS: "https://www.bracbank.com/en/retail/deposit-products",
    FDR: "https://www.bracbank.com/en/retail/term-deposits",
    SAVINGS: "https://www.bracbank.com/en/retail/deposit-products",
  },
  "the-city-bank": {
    CARD: "https://www.citybankplc.com/cards",
    LOAN: "https://www.citybankplc.com/loans",
    DPS: "https://www.citybankplc.com/deposits",
    FDR: "https://www.citybankplc.com/deposits",
    SAVINGS: "https://www.citybankplc.com/deposits",
  },
  "eastern-bank": {
    CARD: "https://www.ebl.com.bd/cards",
    LOAN: "https://www.ebl.com.bd/retail-loans",
    DPS: "https://www.ebl.com.bd/deposit-products",
    FDR: "https://www.ebl.com.bd/deposit-products",
    SAVINGS: "https://www.ebl.com.bd/deposit-products",
  },
  "dutch-bangla-bank": {
    CARD: "https://www.dutchbanglabank.com/electronic-banking/credit-cards.html",
    LOAN: "https://www.dutchbanglabank.com/retail-banking/retail-lending.html",
    DPS: "https://www.dutchbanglabank.com/retail-banking/deposit-accounts.html",
    FDR: "https://www.dutchbanglabank.com/retail-banking/deposit-accounts.html",
    SAVINGS: "https://www.dutchbanglabank.com/retail-banking/deposit-accounts.html",
  },
  "standard-chartered-bangladesh": {
    CARD: "https://www.sc.com/bd/credit-cards/",
    LOAN: "https://www.sc.com/bd/borrow/",
    DPS: "https://www.sc.com/bd/save/",
    FDR: "https://www.sc.com/bd/save/",
    SAVINGS: "https://www.sc.com/bd/save/",
  },
  "islami-bank-bangladesh": {
    CARD: "https://www.islamibankbd.com/card/khidmah.php",
    LOAN: "https://www.islamibankbd.com/invest/retail.php",
    DPS: "https://www.islamibankbd.com/deposit/mudaraba.php",
    FDR: "https://www.islamibankbd.com/deposit/mudaraba_term.php",
    SAVINGS: "https://www.islamibankbd.com/deposit/mudaraba.php",
  },
  "prime-bank": {
    CARD: "https://www.primebank.com.bd/retail-banking/cards",
    LOAN: "https://www.primebank.com.bd/retail-banking/consumer-loans",
    DPS: "https://www.primebank.com.bd/retail-banking/deposits",
    FDR: "https://www.primebank.com.bd/retail-banking/deposits",
    SAVINGS: "https://www.primebank.com.bd/retail-banking/deposits",
  },
  "mutual-trust-bank": {
    CARD: "https://www.mutualtrustbank.com/retail-banking/cards/",
    LOAN: "https://www.mutualtrustbank.com/retail-banking/loans/",
    DPS: "https://www.mutualtrustbank.com/retail-banking/deposits/",
    FDR: "https://www.mutualtrustbank.com/retail-banking/deposits/",
    SAVINGS: "https://www.mutualtrustbank.com/retail-banking/deposits/",
  },
  "united-commercial-bank": {
    CARD: "https://www.ucb.com.bd/personal/cards",
    LOAN: "https://www.ucb.com.bd/personal/loans",
    DPS: "https://www.ucb.com.bd/personal/accounts",
    FDR: "https://www.ucb.com.bd/personal/accounts",
    SAVINGS: "https://www.ucb.com.bd/personal/accounts",
  },
  "dhaka-bank": {
    CARD: "https://www.dhakabankltd.com/cards/",
    LOAN: "https://www.dhakabankltd.com/retail-banking/loans/",
    DPS: "https://www.dhakabankltd.com/retail-banking/deposits/",
    FDR: "https://www.dhakabankltd.com/retail-banking/deposits/",
    SAVINGS: "https://www.dhakabankltd.com/retail-banking/deposits/",
  },
  "bank-asia": {
    CARD: "https://www.bankasia-bd.com/retail/cards",
    LOAN: "https://www.bankasia-bd.com/retail/loans",
    DPS: "https://www.bankasia-bd.com/retail/deposits",
    FDR: "https://www.bankasia-bd.com/retail/deposits",
    SAVINGS: "https://www.bankasia-bd.com/retail/deposits",
  },
  "southeast-bank": {
    CARD: "https://www.southeastbank.com.bd/cards.php",
    LOAN: "https://www.southeastbank.com.bd/retail_loans.php",
    DPS: "https://www.southeastbank.com.bd/retail_deposits.php",
    FDR: "https://www.southeastbank.com.bd/retail_deposits.php",
    SAVINGS: "https://www.southeastbank.com.bd/retail_deposits.php",
  },
  "pubali-bank": {
    CARD: "https://www.pubalibangla.com/cards.asp",
    LOAN: "https://www.pubalibangla.com/retail_loans.asp",
    DPS: "https://www.pubalibangla.com/deposit_products.asp",
    FDR: "https://www.pubalibangla.com/deposit_products.asp",
    SAVINGS: "https://www.pubalibangla.com/deposit_products.asp",
  },
  "sonali-bank": {
    CARD: "https://www.sonalibank.com.bd/card_service.php",
    LOAN: "https://www.sonalibank.com.bd/credit.php",
    DPS: "https://www.sonalibank.com.bd/deposit.php",
    FDR: "https://www.sonalibank.com.bd/deposit.php",
    SAVINGS: "https://www.sonalibank.com.bd/deposit.php",
  },
  "hsbc-bangladesh": {
    CARD: "https://www.hsbc.com.bd/1/2/personal-banking/cards",
    LOAN: "https://www.hsbc.com.bd/1/2/personal-banking/borrowing",
    DPS: "https://www.hsbc.com.bd/1/2/personal-banking/accounts",
    FDR: "https://www.hsbc.com.bd/1/2/personal-banking/accounts",
    SAVINGS: "https://www.hsbc.com.bd/1/2/personal-banking/accounts",
  },
  "trust-bank": {
    CARD: "https://www.tblbd.com/retail-banking/cards",
    LOAN: "https://www.tblbd.com/retail-banking/loans",
    DPS: "https://www.tblbd.com/retail-banking/deposits",
    FDR: "https://www.tblbd.com/retail-banking/deposits",
    SAVINGS: "https://www.tblbd.com/retail-banking/deposits",
  },
  "premier-bank": {
    CARD: "https://www.premierbankltd.com/retail/cards/",
    LOAN: "https://www.premierbankltd.com/retail/loans/",
    DPS: "https://www.premierbankltd.com/retail/deposits/",
    FDR: "https://www.premierbankltd.com/retail/deposits/",
    SAVINGS: "https://www.premierbankltd.com/retail/deposits/",
  },
  "jamuna-bank": {
    CARD: "https://www.jamunabankbd.com/cards",
    LOAN: "https://www.jamunabankbd.com/retail-loans",
    DPS: "https://www.jamunabankbd.com/retail-deposits",
    FDR: "https://www.jamunabankbd.com/retail-deposits",
    SAVINGS: "https://www.jamunabankbd.com/retail-deposits",
  },
  "mercantile-bank": {
    CARD: "https://www.mblbd.com/cards",
    LOAN: "https://www.mblbd.com/loans",
    DPS: "https://www.mblbd.com/deposits",
    FDR: "https://www.mblbd.com/deposits",
    SAVINGS: "https://www.mblbd.com/deposits",
  },
  "ific-bank": {
    CARD: "https://www.ificbank.com.bd/cards",
    LOAN: "https://www.ificbank.com.bd/loans",
    DPS: "https://www.ificbank.com.bd/deposits",
    FDR: "https://www.ificbank.com.bd/deposits",
    SAVINGS: "https://www.ificbank.com.bd/deposits",
  },
  "ab-bank": {
    CARD: "https://www.abbl.com/cards",
    LOAN: "https://www.abbl.com/loans",
    DPS: "https://www.abbl.com/deposits",
    FDR: "https://www.abbl.com/deposits",
    SAVINGS: "https://www.abbl.com/deposits",
  },
  "al-arafah-islami-bank": {
    CARD: "https://www.aibl.com.bd/tayyib-cards/",
    LOAN: "https://www.aibl.com.bd/investment-products/",
    DPS: "https://www.aibl.com.bd/deposit-products/",
    FDR: "https://www.aibl.com.bd/deposit-products/",
    SAVINGS: "https://www.aibl.com.bd/deposit-products/",
  },
  "shahjalal-islami-bank": {
    CARD: "https://www.sjibl.com/cards.html",
    LOAN: "https://www.sjibl.com/investment.html",
    DPS: "https://www.sjibl.com/deposit.html",
    FDR: "https://www.sjibl.com/deposit.html",
    SAVINGS: "https://www.sjibl.com/deposit.html",
  },
  "exim-bank": {
    CARD: "https://www.eximbankbd.com/cards",
    LOAN: "https://www.eximbankbd.com/retail-investment",
    DPS: "https://www.eximbankbd.com/deposit-schemes",
    FDR: "https://www.eximbankbd.com/deposit-schemes",
    SAVINGS: "https://www.eximbankbd.com/deposit-schemes",
  },
  "social-islami-bank": {
    CARD: "https://www.siblbd.com/cards",
    LOAN: "https://www.siblbd.com/investments",
    DPS: "https://www.siblbd.com/deposit-schemes",
    FDR: "https://www.siblbd.com/deposit-schemes",
    SAVINGS: "https://www.siblbd.com/deposit-schemes",
  },
  "national-bank": {
    CARD: "https://www.nblbd.com/products/cards",
    LOAN: "https://www.nblbd.com/products/loans",
    DPS: "https://www.nblbd.com/products/deposits",
    FDR: "https://www.nblbd.com/products/deposits",
    SAVINGS: "https://www.nblbd.com/products/deposits",
  },
  "ncc-bank": {
    CARD: "https://www.nccbank.com.bd/cards",
    LOAN: "https://www.nccbank.com.bd/loans",
    DPS: "https://www.nccbank.com.bd/deposits",
    FDR: "https://www.nccbank.com.bd/deposits",
    SAVINGS: "https://www.nccbank.com.bd/deposits",
  },
  "one-bank": {
    CARD: "https://www.onebankbd.com/cards",
    LOAN: "https://www.onebankbd.com/loans",
    DPS: "https://www.onebankbd.com/deposits",
    FDR: "https://www.onebankbd.com/deposits",
    SAVINGS: "https://www.onebankbd.com/deposits",
  },
  "first-security-islami-bank": {
    CARD: "https://www.fsiblbd.com/card-services/",
    LOAN: "https://www.fsiblbd.com/investment-products/",
    DPS: "https://www.fsiblbd.com/deposit-products/",
    FDR: "https://www.fsiblbd.com/deposit-products/",
    SAVINGS: "https://www.fsiblbd.com/deposit-products/",
  },
};

/**
 * Returns the direct official application / product URL for a given bank and product type.
 * Falls back to the bank's base website URL if a product-specific URL is not defined.
 */
export function getBankApplyUrl(
  bankWebsite: string | null | undefined,
  bankSlug: string,
  productType: "CARD" | "LOAN" | "DPS" | "FDR" | "SAVINGS" = "CARD"
): string {
  const direct = BANK_PRODUCT_URLS[bankSlug]?.[productType];
  if (direct) return direct;
  if (bankWebsite && bankWebsite.startsWith("http")) return bankWebsite;
  return `https://www.google.com/search?q=${encodeURIComponent(bankSlug.replace(/-/g, " ") + " " + productType.toLowerCase() + " apply online")}`;
}

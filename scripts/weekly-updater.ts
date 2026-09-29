import { runWeeklyDataSync } from "../src/lib/services/updater";

async function main() {
  console.log("🚀 Executing BankCompare BD Weekly Data Update...");
  try {
    const result = await runWeeklyDataSync();
    console.log("--------------------------------------------------");
    console.log(`✅ Status: ${result.success ? "SUCCESS" : "FAILED"}`);
    console.log(`🏦 Banks Re-checked: ${result.banksUpdated}`);
    console.log(`📈 Rate Changes Audited: ${result.rateChangesLogged}`);
    console.log(`💳 Card Deals Re-verified: ${result.dealsRefreshed}`);
    console.log("--------------------------------------------------");
    result.logs.forEach((log) => console.log(`   ${log}`));
    console.log("--------------------------------------------------");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error executing weekly updater:", error);
    process.exit(1);
  }
}

main();

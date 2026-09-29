import { NextResponse } from "next/server";
import { runWeeklyDataSync } from "@/lib/services/updater";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return handleSync(req);
}

export async function POST(req: Request) {
  return handleSync(req);
}

async function handleSync(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // Secure authentication check: Vercel Cron automatically attaches Authorization: Bearer <CRON_SECRET>
    if (cronSecret && process.env.NODE_ENV === "production") {
      if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized: Invalid CRON_SECRET." }, { status: 401 });
      }
    }

    const result = await runWeeklyDataSync();
    return NextResponse.json({
      message: "Weekly data update completed successfully.",
      ...result,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to execute weekly data sync";
    console.error("Weekly cron execution error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

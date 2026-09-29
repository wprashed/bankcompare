import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

export const alt = "BankBhai — Smart bank rate, credit card & loan comparison in Bangladesh";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  let topRate = 9.75;
  let bankCount = 27;
  try {
    const [agg, count] = await Promise.all([
      prisma.fdrRate.aggregate({ _max: { rate: true } }),
      prisma.bank.count(),
    ]);
    topRate = agg._max.rate ?? topRate;
    bankCount = count || bankCount;
  } catch {
    // fall back to defaults if the database is unavailable
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #090d16 0%, #064e3b 50%, #022c22 100%)",
          padding: 72,
          fontFamily: "sans-serif",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "#059669",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid rgba(255,255,255,0.2)",
            }}
          >
            <div style={{ display: "flex", width: 28, height: 28, borderRadius: 8, background: "#FBBF24" }} />
          </div>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 900, color: "#ffffff", letterSpacing: -0.5 }}>
            <span>Bank</span>
            <span style={{ display: "flex", color: "#34D399" }}>Bhai</span>
            <span
              style={{
                display: "flex",
                marginLeft: 12,
                fontSize: 16,
                fontWeight: 900,
                background: "rgba(52, 211, 153, 0.2)",
                color: "#6ee7b7",
                border: "1px solid rgba(52, 211, 153, 0.4)",
                padding: "4px 8px",
                borderRadius: 6,
                alignSelf: "center",
              }}
            >
              BD
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 64, fontWeight: 900, color: "#ffffff", lineHeight: 1.1, letterSpacing: -1.5 }}>
            Smart Banking Intelligence
          </div>
          <div style={{ display: "flex", fontSize: 64, fontWeight: 900, color: "#34D399", lineHeight: 1.1, letterSpacing: -1.5 }}>
            for Bangladesh
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#cbd5e1", marginTop: 16 }}>
            FDR Rates · Savings Accounts · Credit Cards & Deals · Loans · Post-Tax DPS
          </div>
        </div>

        <div style={{ display: "flex", gap: 56, alignItems: "flex-end" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 52, fontWeight: 900, color: "#FBBF24" }}>{`${topRate.toFixed(2)}%`}</div>
            <div style={{ display: "flex", fontSize: 20, color: "#94a3b8" }}>Top FDR Rate</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 52, fontWeight: 900, color: "#34D399" }}>{bankCount}</div>
            <div style={{ display: "flex", fontSize: 20, color: "#94a3b8" }}>Banks Tracked</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 52, fontWeight: 900, color: "#38bdf8" }}>100% Free</div>
            <div style={{ display: "flex", fontSize: 20, color: "#94a3b8" }}>Unbiased & Transparent</div>
          </div>
        </div>
      </div>
    ),
    size
  );
}

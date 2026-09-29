import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

export const alt = "BankCompare BD — Compare savings, FDR and loan rates in Bangladesh";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  let topRate = 9.25;
  let bankCount = 10;
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
          background: "linear-gradient(135deg, #ffffff 0%, #eefaf4 60%, #d5f3e4 100%)",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "#006a4e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ display: "flex", width: 26, height: 26, borderRadius: 999, background: "#f42a41" }} />
          </div>
          <div style={{ display: "flex", fontSize: 34, fontWeight: 800, color: "#12181b" }}>
            <span>BankCompare</span>
            <span style={{ display: "flex", color: "#006a4e" }}>BD</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 68, fontWeight: 800, color: "#12181b", lineHeight: 1.1, letterSpacing: -1.5 }}>
            Compare every bank
          </div>
          <div style={{ display: "flex", fontSize: 68, fontWeight: 800, color: "#006a4e", lineHeight: 1.1, letterSpacing: -1.5 }}>
            in Bangladesh
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#4c565d", marginTop: 20 }}>
            Savings accounts · FDR rates · Loans · Calculators
          </div>
        </div>

        <div style={{ display: "flex", gap: 56, alignItems: "flex-end" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 52, fontWeight: 800, color: "#f42a41" }}>{`${topRate.toFixed(2)}%`}</div>
            <div style={{ display: "flex", fontSize: 22, color: "#6b757d" }}>Top FDR rate</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 52, fontWeight: 800, color: "#006a4e" }}>{bankCount}</div>
            <div style={{ display: "flex", fontSize: 22, color: "#6b757d" }}>Banks tracked</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 52, fontWeight: 800, color: "#006a4e" }}>Free</div>
            <div style={{ display: "flex", fontSize: 22, color: "#6b757d" }}>No ads, no bias</div>
          </div>
        </div>
      </div>
    ),
    size
  );
}

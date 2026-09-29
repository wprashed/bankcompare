import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE}/savings`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${SITE}/fdr`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${SITE}/cards`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${SITE}/loans`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${SITE}/banks`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/calculators/fdr`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/calculators/emi`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/calculators/credit-card`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  let bankRoutes: MetadataRoute.Sitemap = [];
  try {
    const banks = await prisma.bank.findMany({ select: { slug: true, updatedAt: true } });
    bankRoutes = banks.map((b) => ({
      url: `${SITE}/banks/${b.slug}`,
      lastModified: b.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // database unavailable at build time — static routes still ship
  }

  return [...staticRoutes, ...bankRoutes];
}

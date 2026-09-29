import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, city, monthlyIncome, employmentType, productType, productSlug, productName, bankSlug, bankName, notes } = body;

    if (!name || !phone || !monthlyIncome) {
      return NextResponse.json({ error: "Name, phone number, and income are required." }, { status: 400 });
    }

    // Generate readable reference ID: e.g. BC-892415
    const refNumber = `BC-${Math.floor(100000 + Math.random() * 900000)}`;

    const lead = await prisma.lead.create({
      data: {
        refNumber,
        name: String(name).trim(),
        phone: String(phone).trim(),
        email: email ? String(email).trim() : null,
        city: city ? String(city).trim() : "Dhaka",
        monthlyIncome: Number(monthlyIncome),
        employmentType: employmentType || "SALARIED",
        productType: productType || "CARD",
        productSlug: productSlug || "general",
        productName: productName || "Banking Product",
        bankSlug: bankSlug || "general",
        bankName: bankName || "Partner Bank",
        notes: notes ? String(notes).trim() : null,
      },
    });

    return NextResponse.json({
      success: true,
      refNumber: lead.refNumber,
      message: "Application received! A bank representative will contact you within 24 hours.",
    });
  } catch (err: unknown) {
    console.error("Lead creation failed:", err);
    return NextResponse.json({ error: "Failed to submit application. Please try again." }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  try {
    const { userId, getToken } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const secretKey = process.env.KORAPAY_SECRET_KEY;
    const token = await getToken({ template: "convex" });
    if (!token) return NextResponse.json({ error: "Auth token unavailable" }, { status: 401 });

    const [user, settings] = await Promise.all([
      fetchQuery(api.users.getCurrentUserQuery, {}, { token }),
      fetchQuery(api.settings.getSettings, {}, { token }),
    ]);

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (user.plan === "pro") return NextResponse.json({ error: "Already on Pro" }, { status: 400 });

    // Dev fallback: if KoraPay isn't configured, upgrade directly
    if (!secretKey) {
      await fetchMutation(api.users.selfUpgradeToPro, {}, { token });
      return NextResponse.json({
        checkoutUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/upgrade/success`,
      });
    }

    const reference = `pro_${nanoid(12)}`;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;
    const amount = Number(process.env.KORAPAY_AMOUNT ?? "12");
    const currency = process.env.KORAPAY_CURRENCY ?? "USD";

    const customerName =
      settings?.displayName ?? settings?.companyName ?? user.name ?? user.email ?? "Customer";

    const requestBody: Record<string, unknown> = {
      reference,
      amount,
      currency,
      customer: { email: user.email, name: customerName },
      redirect_url: `${appUrl}/upgrade/success`,
      metadata: { clerk_user_id: userId, plan: "pro" },
    };

    if (convexSiteUrl) {
      requestBody.notification_url = `${convexSiteUrl}/webhooks/korapay`;
    } else {
      console.warn("NEXT_PUBLIC_CONVEX_SITE_URL not set — KoraPay webhook will not fire");
    }

    const res = await fetch("https://api.korapay.com/merchant/api/v1/charges/initialize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    const json = await res.json() as { status: boolean; message?: string; data?: { checkout_url?: string } };

    if (!json.status || !json.data?.checkout_url) {
      console.error("KoraPay initiate error — full response:", JSON.stringify(json));
      return NextResponse.json({ error: json.message ?? "Failed to create checkout" }, { status: 502 });
    }

    return NextResponse.json({ checkoutUrl: json.data.checkout_url });
  } catch (err) {
    console.error("payments/initiate error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

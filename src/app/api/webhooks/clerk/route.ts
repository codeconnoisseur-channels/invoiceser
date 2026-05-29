import { NextRequest, NextResponse } from "next/server";

// Clerk webhook events are handled directly by the Convex HTTP endpoint:
// https://different-vole-27.convex.site/webhooks/clerk
//
// Configure your Clerk webhook to point there, not to this route.
// This stub returns 200 so Clerk doesn't error if it's mistakenly pointed here.
export async function POST(_req: NextRequest) {
  return NextResponse.json(
    { message: "Use the Convex webhook endpoint instead." },
    { status: 200 }
  );
}

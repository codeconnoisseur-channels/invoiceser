"use node";

import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { Webhook } from "svix";
import { v } from "convex/values";

export const processKorapayWebhook = internalAction({
  args: { body: v.string(), signature: v.string() },
  handler: async (ctx, args) => {
    const encryptionKey = process.env.KORAPAY_ENCRYPTION_KEY;
    if (!encryptionKey) return { message: "Encryption key not configured", status: 500 };

    const crypto = await import("crypto");
    const expected = crypto
      .createHmac("sha256", encryptionKey)
      .update(args.body)
      .digest("hex");

    if (expected !== args.signature) {
      return { message: "Invalid signature", status: 400 };
    }

    let event: { event: string; data?: { status?: string; metadata?: { clerk_user_id?: string } } };
    try {
      event = JSON.parse(args.body);
    } catch {
      return { message: "Invalid JSON", status: 400 };
    }

    if (event.event === "charge.success" && event.data?.status === "success") {
      const clerkUserId = event.data?.metadata?.clerk_user_id;
      if (clerkUserId) {
        await ctx.runMutation(internal.users.upgradeUserByClerkId, { clerkId: clerkUserId });
      }
    }

    return { message: "OK", status: 200 };
  },
});

export const processClerkWebhook = internalAction({
  args: {
    body: v.string(),
    svixId: v.string(),
    svixTimestamp: v.string(),
    svixSignature: v.string(),
  },
  handler: async (ctx, args) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return { message: "Webhook secret not configured", status: 500 };
    }

    const wh = new Webhook(webhookSecret);
    let event: {
      type: string;
      data: {
        id: string;
        email_addresses: Array<{ email_address: string }>;
        first_name?: string;
        last_name?: string;
      };
    };
    try {
      event = wh.verify(args.body, {
        "svix-id": args.svixId,
        "svix-timestamp": args.svixTimestamp,
        "svix-signature": args.svixSignature,
      }) as typeof event;
    } catch {
      return { message: "Invalid signature", status: 400 };
    }

    if (event.type === "user.created" || event.type === "user.updated") {
      const { id, email_addresses, first_name, last_name } = event.data;
      const email = email_addresses[0]?.email_address ?? "";
      const name = [first_name, last_name].filter(Boolean).join(" ") || undefined;
      await ctx.runMutation(internal.users.syncUser, { clerkId: id, email, name });
    }

    if (event.type === "user.deleted") {
      await ctx.runMutation(internal.users.deleteUser, { clerkId: event.data.id });
    }

    return { message: "OK", status: 200 };
  },
});

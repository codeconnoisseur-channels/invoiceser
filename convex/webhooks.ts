"use node";

import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { Webhook } from "svix";
import { v } from "convex/values";

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

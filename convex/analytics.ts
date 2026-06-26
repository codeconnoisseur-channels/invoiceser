import { action } from "./_generated/server";
import { v } from "convex/values";

export const capture = action({
  args: {
    event: v.string(),
    clerkId: v.optional(v.string()),
    properties: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.POSTHOG_API_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";
    if (!apiKey) return;

    const body: Record<string, unknown> = {
      event: args.event,
      api_key: apiKey,
      distinct_id: args.clerkId || "anonymous",
      properties: args.properties ? JSON.parse(args.properties) : {},
    };

    try {
      await fetch(`${host}/capture/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch {
      // Analytics failures are non-critical
    }
  },
});

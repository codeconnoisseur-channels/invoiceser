import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/webhooks/clerk",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const svixId = req.headers.get("svix-id");
    const svixTimestamp = req.headers.get("svix-timestamp");
    const svixSignature = req.headers.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      return new Response("Missing svix headers", { status: 400 });
    }

    const body = await req.text();

    const result = await ctx.runAction(internal.webhooks.processClerkWebhook, {
      body,
      svixId,
      svixTimestamp,
      svixSignature,
    });

    return new Response(result.message, { status: result.status });
  }),
});

http.route({
  path: "/webhooks/korapay",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const signature = req.headers.get("x-korapay-signature");
    if (!signature) return new Response("Missing signature header", { status: 400 });

    const body = await req.text();
    const result = await ctx.runAction(internal.webhooks.processKorapayWebhook, { body, signature });
    return new Response(result.message, { status: result.status });
  }),
});

export default http;

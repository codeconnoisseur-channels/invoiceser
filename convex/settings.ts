import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser, getCurrentUserOrNull, getCurrentUserOrCreate } from "./lib/auth";

export const getSettings = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrNull(ctx);
    if (!user) return null;
    return ctx.db
      .query("settings")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();
  },
});

export const updateCompanySettings = mutation({
  args: {
    companyName: v.string(),
    displayName: v.optional(v.string()),
    logoStorageId: v.optional(v.id("_storage")),
    brandColor: v.optional(v.string()),
    defaultCurrency: v.string(),
    invoicePrefix: v.string(),
    defaultPaymentTerms: v.optional(v.string()),
    businessAddress: v.optional(v.string()),
    businessCity: v.optional(v.string()),
    businessCountry: v.optional(v.string()),
    businessPhone: v.optional(v.string()),
    businessEmail: v.optional(v.string()),
    businessWebsite: v.optional(v.string()),
    showBusinessAddress: v.optional(v.boolean()),
    showBusinessPhone: v.optional(v.boolean()),
    showBusinessEmail: v.optional(v.boolean()),
    showBusinessWebsite: v.optional(v.boolean()),
    hideBranding: v.optional(v.boolean()),
    invoiceFont: v.optional(v.string()),
    customEmailDomain: v.optional(v.string()),
    emailTemplate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrCreate(ctx);
    const settings = await ctx.db
      .query("settings")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();
    if (!settings) throw new Error("Settings not found");
    await ctx.db.patch(settings._id, { ...args, updatedAt: Date.now() });
  },
});

export const updateTaxSettings = mutation({
  args: {
    salesTaxLabel: v.optional(v.string()),
    salesTaxRate: v.optional(v.number()),
    salesTaxActive: v.boolean(),
    vatLabel: v.optional(v.string()),
    vatRate: v.optional(v.number()),
    vatActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const settings = await ctx.db
      .query("settings")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();
    if (!settings) throw new Error("Settings not found");
    await ctx.db.patch(settings._id, { ...args, updatedAt: Date.now() });
  },
});

export const updatePaymentInstructions = mutation({
  args: { paymentInstructions: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const settings = await ctx.db
      .query("settings")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();
    if (!settings) throw new Error("Settings not found");
    await ctx.db.patch(settings._id, {
      paymentInstructions: args.paymentInstructions,
      updatedAt: Date.now(),
    });
  },
});

export const updateReminderSettings = mutation({
  args: {
    autoReminderEnabled: v.boolean(),
    autoReminderDaysBefore: v.optional(v.number()),
    autoReminderDaysAfter: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const settings = await ctx.db
      .query("settings")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();
    if (!settings) throw new Error("Settings not found");
    await ctx.db.patch(settings._id, { ...args, updatedAt: Date.now() });
  },
});

export const updatePaymentDetails = mutation({
  args: {
    paymentBankName:      v.optional(v.string()),
    paymentAccountName:   v.optional(v.string()),
    paymentAccountNumber: v.optional(v.string()),
    paymentSortCode:      v.optional(v.string()),
    paymentIban:          v.optional(v.string()),
    paymentSwiftBic:      v.optional(v.string()),
    paymentLink:          v.optional(v.string()),
    paymentLinkLabel:     v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const settings = await ctx.db
      .query("settings")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();
    if (!settings) throw new Error("Settings not found");
    await ctx.db.patch(settings._id, { ...args, updatedAt: Date.now() });
  },
});

export const updatePaymentAccounts = mutation({
  args: {
    paymentAccounts: v.array(v.object({
      id: v.string(),
      label: v.string(),
      currency: v.optional(v.string()),
      bankName: v.optional(v.string()),
      accountHolder: v.optional(v.string()),
      accountNumber: v.optional(v.string()),
      sortCode: v.optional(v.string()),
      iban: v.optional(v.string()),
      swift: v.optional(v.string()),
      paymentLink: v.optional(v.string()),
      paymentLinkLabel: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const settings = await ctx.db
      .query("settings")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();
    if (!settings) throw new Error("Settings not found");
    await ctx.db.patch(settings._id, { paymentAccounts: args.paymentAccounts, updatedAt: Date.now() });
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await getCurrentUser(ctx);
    return ctx.storage.generateUploadUrl();
  },
});

export const getSettingsForPublicInvoice = query({
  args: { invoiceId: v.id("invoices") },
  handler: async (ctx, args) => {
    const invoice = await ctx.db.get(args.invoiceId);
    if (!invoice) return null;
    const settings = await ctx.db
      .query("settings")
      .withIndex("by_user", (q) => q.eq("userId", invoice.userId))
      .unique();
    if (!settings) return null;
    return {
      companyName:        settings.companyName,
      brandColor:         settings.brandColor,
      logoStorageId:      settings.logoStorageId,
      businessAddress:    settings.businessAddress,
      businessCity:       settings.businessCity,
      businessCountry:    settings.businessCountry,
      businessPhone:      settings.businessPhone,
      businessEmail:      settings.businessEmail,
      businessWebsite:    settings.businessWebsite,
      showBusinessAddress: settings.showBusinessAddress,
      showBusinessPhone:   settings.showBusinessPhone,
      showBusinessEmail:   settings.showBusinessEmail,
      showBusinessWebsite: settings.showBusinessWebsite,
      hideBranding:        settings.hideBranding,
      invoiceFont:         settings.invoiceFont,
    };
  },
});

export const getLogoUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return ctx.storage.getUrl(args.storageId);
  },
});

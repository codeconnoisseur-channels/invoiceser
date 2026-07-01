/**
 * Centralized environment variables with safe fallbacks.
 */

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");

export const SMTP_USER = process.env.SMTP_USER || "noreply@invoiceser.app";

export const DEFAULT_FROM_EMAIL = `Invoiceser <${SMTP_USER}>`;

export const KORAPAY_SECRET_KEY = process.env.KORAPAY_SECRET_KEY || "";
export const KORAPAY_AMOUNT = Number(process.env.KORAPAY_AMOUNT || "12");
export const KORAPAY_CURRENCY = process.env.KORAPAY_CURRENCY || "USD";

export const CONVEX_SITE_URL = process.env.NEXT_PUBLIC_CONVEX_SITE_URL || "";

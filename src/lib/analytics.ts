import posthog from "posthog-js";

let _initialized = false;

export function initPostHog() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (typeof window !== "undefined" && key && !_initialized) {
    if (
      !window.location.host.includes("127.0.0.1") &&
      !window.location.host.includes("localhost")
    ) {
      posthog.init(key, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
        person_profiles: "identified_only",
        capture_pageview: false,
        capture_pageleave: true,
      });
      _initialized = true;
    }
  }
}

export function captureEvent(event: string, properties?: Record<string, unknown>) {
  if (!_initialized) return;
  posthog.capture(event, properties);
}

export function identifyUser(clerkId: string, email: string, name?: string) {
  if (!_initialized) return;
  posthog.identify(clerkId, { email, name });
}

export function resetAnalytics() {
  if (!_initialized) return;
  posthog.reset();
}

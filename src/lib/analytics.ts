import posthog from "posthog-js";

let _initialized = false;

export function initPostHog() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (typeof window !== "undefined" && key && !_initialized) {
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
      person_profiles: "identified_only",
      capture_pageview: false,
    });
    _initialized = true;
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

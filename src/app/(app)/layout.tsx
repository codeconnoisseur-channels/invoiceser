import { Suspense } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AnalyticsProvider } from "@/components/providers/analytics-provider";
import { AppShell } from "@/components/layout/app-shell";
import { AnnouncementBanner } from "@/components/layout/announcement-banner";
import { OnboardingGuard } from "@/components/layout/onboarding-guard";
import { Toaster } from "sonner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/onboarding"
    >
      <ThemeProvider>
        <ConvexClientProvider>
          <Suspense fallback={null}>
            <AnalyticsProvider>
              <AppShell>
                <AnnouncementBanner />
                <OnboardingGuard>
                  <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">{children}</div>
                </OnboardingGuard>
              </AppShell>
            </AnalyticsProvider>
          </Suspense>
          <Toaster position="bottom-right" richColors theme="system" />
        </ConvexClientProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}

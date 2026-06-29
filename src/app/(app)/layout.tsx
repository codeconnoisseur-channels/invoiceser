import { Suspense } from "react";
import { ClerkProvider, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
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
      <ConvexClientProvider>
        <ClerkLoading>
          <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gray-950">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        </ClerkLoading>
        <ClerkLoaded>
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
        </ClerkLoaded>
        <Toaster position="bottom-right" richColors theme="system" />
      </ConvexClientProvider>
    </ClerkProvider>
  );
}

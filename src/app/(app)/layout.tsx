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
          <div className="min-h-screen flex items-center justify-center bg-[#faf7f3]">
            <div className="size-8 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin"></div>
          </div>
        </ClerkLoading>
        <ClerkLoaded>
          <Suspense fallback={null}>
            <AnalyticsProvider>
              <AppShell>
                <AnnouncementBanner />
                <OnboardingGuard>
                  <div className="app-page px-4 py-5 sm:px-6 lg:px-8 lg:py-7">{children}</div>
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

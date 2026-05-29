import { AppShell } from "@/components/layout/app-shell";
import { AnnouncementBanner } from "@/components/layout/announcement-banner";
import { OnboardingGuard } from "@/components/layout/onboarding-guard";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
      <AnnouncementBanner />
      <OnboardingGuard>
        <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">{children}</div>
      </OnboardingGuard>
    </AppShell>
  );
}

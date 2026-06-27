import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "Invoiceser - Professional Invoicing for Freelancers",
  description: "Create branded invoices in seconds. Add your logo, set custom colours, and include payment instructions.",
  keywords: ["invoicing", "freelancers", "billing software", "SaaS", "payments"],
  openGraph: {
    title: "Invoiceser - Professional Invoicing for Freelancers",
    description: "Create branded invoices in seconds. Add your logo, set custom colours, and include payment instructions.",
    type: "website",
    siteName: "Invoiceser",
  },
  twitter: {
    card: "summary_large_image",
    title: "Invoiceser - Professional Invoicing for Freelancers",
    description: "Create branded invoices in seconds. Add your logo, set custom colours, and include payment instructions.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} font-sans`}>
      <body suppressHydrationWarning className="font-sans antialiased bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 selection:bg-primary-500/30 selection:text-primary-900">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

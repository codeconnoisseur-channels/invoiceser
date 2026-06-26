import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Invoiceser",
  description: "Professional invoicing for freelancers and small businesses",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

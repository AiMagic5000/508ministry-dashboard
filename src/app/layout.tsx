import type { Metadata } from "next";
import "./globals.css";
import { DashboardLayout } from "@/components/layout";

export const metadata: Metadata = {
  title: "Harvest Hope Farm - Florida Farm Ministry Dashboard",
  description: "Transparent trust management for 508(c)(1)(A) faith-based farm ministry serving churches and shelters in Florida",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-light-200 text-light-900">
        <DashboardLayout>
          {children}
        </DashboardLayout>
      </body>
    </html>
  );
}

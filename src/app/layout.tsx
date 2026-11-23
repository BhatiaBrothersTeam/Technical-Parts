import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { getCategories } from "@/lib/data";
import { Footer } from "@/components/Footer";
import { RfqProvider } from "@/lib/rfq-context";
import { ToastProvider } from "@/lib/toast-context";

export const metadata: Metadata = {
  title: {
    default: "technicalparts.com | EPC Packages & Fabrication",
    template: "%s | technicalparts.com",
  },
  description:
    "BB Group's enquiry-led website for oil and gas EPC fabricated packages and C&J fabrication across the Middle East and beyond.",
};

export const revalidate = 300;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const categories = await getCategories();
  return (
    <html lang="en" dir="ltr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <RfqProvider>
          <ToastProvider>
            <Header categories={categories} />
            <main className="flex-1">{children}</main>
            <Footer />
          </ToastProvider>
        </RfqProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { siteUrl } from "@/lib/contact";
import { RfqProvider } from "@/lib/rfq-context";
import { ToastProvider } from "@/lib/toast-context";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "technicalparts.com | C&J Packages & EPC Packages",
    template: "%s | technicalparts.com",
  },
  description:
    "BB Group's enquiry-led website for C&J packages and EPC packages across the Middle East and beyond.",
  openGraph: {
    type: "website",
    siteName: "technicalparts.com",
    title: "technicalparts.com | C&J Packages & EPC Packages",
    description: "Browse C&J packages and send your RFQ or drawings for review.",
  },
};

const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const heading = Manrope({ subsets: ["latin"], variable: "--font-heading", display: "swap" });

export const revalidate = 30;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" dir="ltr" className={`${body.variable} ${heading.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <RfqProvider>
          <ToastProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <WhatsAppButton />
          </ToastProvider>
        </RfqProvider>
      </body>
    </html>
  );
}

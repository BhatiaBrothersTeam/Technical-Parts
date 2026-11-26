import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RfqProvider } from "@/lib/rfq-context";
import { ToastProvider } from "@/lib/toast-context";

export const metadata: Metadata = {
  title: {
    default: "technicalparts.com | C&J Fabrication & EPC Packages",
    template: "%s | technicalparts.com",
  },
  description:
    "BB Group's enquiry-led website for C&J fabricated packages and EPC packages across the Middle East and beyond.",
};

const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const heading = Manrope({ subsets: ["latin"], variable: "--font-heading", display: "swap" });

export const revalidate = 60;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" dir="ltr" className={`${body.variable} ${heading.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <RfqProvider>
          <ToastProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </ToastProvider>
        </RfqProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My RFQ",
  description: "Review your RFQ enquiry list and submit your request for a price. No cart, no checkout.",
};

export default function MyRfqLayout({ children }: LayoutProps<"/my-rfq">) {
  return children;
}

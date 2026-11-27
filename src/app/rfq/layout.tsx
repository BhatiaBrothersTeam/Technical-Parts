import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload RFQ",
  description:
    "Have an RFQ, BOQ or specification ready? Upload it directly — PDF, Excel, Word, JPG or PNG, up to 4MB in total.",
};

export default function RfqLayout({ children }: LayoutProps<"/rfq">) {
  return children;
}

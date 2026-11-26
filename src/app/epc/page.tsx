import type { Metadata } from "next";
import { getEpcCategories, getEpcProducts } from "@/lib/data";
import { ProductsBrowser } from "@/components/ProductsBrowser";
import { EnquiryForm } from "@/components/EnquiryForm";
import { PageHero } from "@/components/PageHero";
import { t } from "@/lib/locale";

export const metadata: Metadata = {
  title: "EPC Packages",
  description: t.products.metaDescription,
};

export default async function PackagesPage() {
  // C&J products belong to /fabrication and never appear in the EPC catalogue.
  const [products, categories] = await Promise.all([getEpcProducts(), getEpcCategories()]);

  return (
    <>
      <PageHero
        eyebrow="Division"
        title={t.products.title}
        subtitle={t.products.intro}
        crumbs={[{ label: t.products.title }]}
      />
      <div className="container-tp section-y">
        {products.length > 0 ? (
          <ProductsBrowser products={products} categories={categories} />
        ) : (
          <div className="grid lg:grid-cols-5 gap-10 items-start">
            <div className="lg:col-span-2">
              <p className="eyebrow mb-3">Catalogue</p>
              <h2 className="section-title mb-3">{t.products.emptyHeading}</h2>
              <p className="text-[var(--tp-neutral-600)]">{t.products.emptyCopy}</p>
            </div>
            <div className="lg:col-span-3">
              <EnquiryForm
                leadType="epc_enquiry"
                showProjectFields
                showTechnicalFields
                heading={t.doors.formHeading}
                submitLabel={t.doors.formHeading}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

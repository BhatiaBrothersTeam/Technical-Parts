import { Suspense } from "react";
import Link from "next/link";
import { t } from "@/lib/locale";
import { EnquiryForm } from "@/components/EnquiryForm";
import { PageHero } from "@/components/PageHero";
import { ProductsBrowser } from "@/components/ProductsBrowser";
import { IconShieldCheck } from "@/components/icons";
import type { Category, Industry, LeadType, Product } from "@/lib/types";

interface DoorPageHeroProps {
  title: string;
  intro: string;
  leadType: LeadType;
  ctaLabel: string;
  products?: Product[];
  categories?: Category[];
  industries?: Industry[];
  emptyHeading?: string;
  emptyCopy?: string;
}

/** Shared layout for the two division pages: banner, package list, enquiry form. */
export function DoorPageHero({
  title,
  intro,
  leadType,
  ctaLabel,
  products,
  categories,
  industries,
  emptyHeading,
  emptyCopy,
}: DoorPageHeroProps) {
  const hasProducts = !!products && products.length > 0;

  return (
    <>
      <PageHero title={title} subtitle={intro}>
        <a href="#enquiry" className="btn btn-accent">
          {ctaLabel} <span aria-hidden>&darr;</span>
        </a>
      </PageHero>

      {hasProducts ? (
        <section className="bg-[var(--tp-neutral-50)] py-10 md:py-14">
          <div className="container-tp">
            <Suspense fallback={null}>
              <ProductsBrowser products={products} categories={categories ?? []} industries={industries} />
            </Suspense>
          </div>
        </section>
      ) : (
        emptyHeading && (
          <section className="bg-[var(--tp-neutral-50)] section-y">
            <div className="container-tp text-center max-w-2xl">
              <span className="mx-auto h-14 w-14 rounded-2xl bg-tp-blue-light text-tp-blue flex items-center justify-center mb-4">
                <IconShieldCheck className="h-7 w-7" />
              </span>
              <h2 className="section-title mb-3">{emptyHeading}</h2>
              {emptyCopy && <p className="text-[var(--tp-neutral-600)]">{emptyCopy}</p>}
            </div>
          </section>
        )
      )}

      <section id="enquiry" className="section-y scroll-mt-20">
        <div className="container-tp max-w-3xl">
          <EnquiryForm
            leadType={leadType}
            heading={t.doors.formHeading}
            showProjectFields
            showTechnicalFields
            submitLabel={ctaLabel}
          />
          <p className="text-sm text-[var(--tp-neutral-600)] mt-4 text-center">
            Have drawings or a BOQ?{" "}
            <Link href="/rfq" className="link-blue">
              Upload them here
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}

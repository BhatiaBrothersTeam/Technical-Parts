import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CJ_BRAND, getIndustries, getProductsByBrand } from "@/lib/data";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Industries",
  description: "Industries served by technicalparts.com: Oil & Gas, Petrochemical, Power, Water & Wastewater, Manufacturing and Marine.",
};

const industryImages: Record<string, string> = {
  "oil-gas": "/images/photos/industry-oilgas.jpg",
  petrochemical: "/images/photos/industry-petrochemical.jpg",
  power: "/images/photos/industry-power.jpg",
  "water-wastewater": "/images/photos/industry-water.jpg",
  manufacturing: "/images/photos/industry-manufacturing.jpg",
  marine: "/images/photos/industry-marine.jpg",
};

export default async function IndustriesPage() {
  const industries = getIndustries();
  const products = await getProductsByBrand(CJ_BRAND);
  const countFor = (slug: string) => products.filter((p) => p.industries.includes(slug)).length;

  return (
    <>
      <PageHero
        title="Industries We Serve"
        subtitle="Choose an industry to see the C&J packages that serve it."
      />
      <div className="container-tp section-y">
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((industry) => {
            const count = countFor(industry.slug);
            const body = (
              <>
                <Image
                  src={industryImages[industry.slug]}
                  alt=""
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-tp-navy-dark/90 via-tp-navy/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 flex items-end justify-between gap-3">
                  <div>
                    <span className="block h-0.5 w-8 bg-tp-accent mb-2 group-hover:w-14 transition-all" />
                    <h2 className="text-lg font-extrabold text-white">{industry.name}</h2>
                    {count > 0 && (
                      <p className="text-sm text-white/80">
                        {count} {count === 1 ? "package" : "packages"}
                      </p>
                    )}
                  </div>
                  <span aria-hidden className="text-tp-accent text-xl transition-transform group-hover:translate-x-1">
                    &rarr;
                  </span>
                </div>
              </>
            );
            const cls = "group relative block aspect-[16/10] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow";
            return count > 0 ? (
              <Link key={industry.id} href={`/cj-packages?industry=${industry.slug}`} className={cls}>
                {body}
              </Link>
            ) : (
              <Link key={industry.id} href="/contact" className={cls}>
                {body}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

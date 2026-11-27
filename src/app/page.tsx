import Image from "next/image";
import Link from "next/link";
import { t } from "@/lib/locale";
import { CJ_BRAND, getDoors, getIndustries, getProductsByBrand } from "@/lib/data";
import { DoorCard } from "@/components/DoorCard";
import { IndustryCard } from "@/components/IndustryCard";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import { IconRig, IconBlueprint } from "@/components/icons";

const doorIcons: Record<string, typeof IconRig> = {
  epc: IconRig,
  cj: IconBlueprint,
};

const doorImages: Record<string, string> = {
  epc: "/images/photos/door-oilgas.jpg",
  cj: "/images/photos/capability.jpg",
};

const doorCtaLabels: Record<string, string> = {
  epc: t.home.doorCtas.epc,
  cj: t.home.doorCtas.cj,
};

const industryImages: Record<string, string> = {
  "oil-gas": "/images/photos/industry-oilgas.jpg",
  petrochemical: "/images/photos/industry-petrochemical.jpg",
  power: "/images/photos/industry-power.jpg",
  "water-wastewater": "/images/photos/industry-water.jpg",
  manufacturing: "/images/photos/industry-manufacturing.jpg",
  marine: "/images/photos/industry-marine.jpg",
};

export default async function HomePage() {
  const doors = getDoors();
  const industries = getIndustries();
  // The home page shows a few of the C&J range (the only packages uploaded so
  // far); EPC packages appear on /epc once they are added.
  const featured = (await getProductsByBrand(CJ_BRAND)).slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-tp-navy-dark text-white">
        <div className="absolute inset-0">
          <Image
            src="/images/photos/hero-refinery.jpg"
            alt="Industrial refinery at dusk"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-tp-navy-dark/55 md:bg-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-tp-navy-dark/95 via-tp-navy/70 md:via-tp-navy/65 to-tp-navy/30 md:to-transparent" />
        </div>

        <div className="container-tp relative py-20 md:py-28 lg:py-32">
          <p className="eyebrow eyebrow-light mb-5 fade-up">{t.home.heroKicker}</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] max-w-3xl text-white fade-up">
            {t.home.heroHeadline1}
            <br />
            {t.home.heroHeadline2}
            <br />
            <span className="text-tp-accent">{t.home.heroHeadline3}</span>
          </h1>
          <p className="mt-6 max-w-xl text-white/80 text-base md:text-lg fade-up">{t.home.heroCopy}</p>
          <div className="mt-9 flex flex-wrap gap-3 fade-up">
            <Link href="/rfq" className="btn btn-accent">
              {t.home.heroPrimaryCta} <span aria-hidden>&rarr;</span>
            </Link>
            <Link href="/cj-packages" className="btn btn-outline">
              {t.home.heroSecondaryCta}
            </Link>
          </div>
        </div>
      </section>

      {/* Two divisions */}
      <section className="section-y">
        <div className="container-tp">
          <SectionHeading eyebrow="Our divisions" title={t.home.doorsHeading} center />
          <div className="grid md:grid-cols-2 gap-6">
            {doors.map((door) => (
              <DoorCard
                key={door.id}
                icon={doorIcons[door.id]}
                image={doorImages[door.id]}
                title={door.title}
                description={door.intro}
                href={door.path}
                cta={doorCtaLabels[door.id]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured packages */}
      {featured.length > 0 && (
        <section className="section-y bg-[var(--tp-neutral-50)]">
          <div className="container-tp">
            <SectionHeading
              eyebrow="C&J Packages"
              title={t.home.featuredHeading}
              linkHref="/cj-packages"
              linkLabel={t.home.viewAllPackages}
            />
            <div className="grid grid-cols-1 min-[480px]:grid-cols-2 xl:grid-cols-4 gap-5">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Industries */}
      <section className="section-y">
        <div className="container-tp">
          <SectionHeading
            eyebrow="Sectors"
            title={t.home.industriesHeading}
            copy={t.home.industriesCopy}
            linkHref="/industries"
            linkLabel={t.home.viewAllIndustries}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {industries.map((industry) => (
              <IndustryCard
                key={industry.id}
                image={industryImages[industry.slug]}
                name={industry.name}
                href={`/cj-packages?industry=${industry.slug}`}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import { t } from "@/lib/locale";
import { CJ_BRAND, getCjCategories, getDoors, getIndustries, getProductsByBrand } from "@/lib/data";
import { DoorCard } from "@/components/DoorCard";
import { IndustryCard } from "@/components/IndustryCard";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import {
  IconRig,
  IconBlueprint,
  IconGlobe,
  IconShieldCheck,
  IconHeadset,
  IconUpload,
  IconGear,
} from "@/components/icons";

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

const trustIcons = [IconGear, IconBlueprint, IconShieldCheck];

export default async function HomePage() {
  const doors = getDoors();
  const industries = getIndustries();
  // The home page's package sections show the C&J range (the only packages
  // uploaded so far); EPC packages appear on /epc once they are added.
  const [allProducts, categories] = await Promise.all([getProductsByBrand(CJ_BRAND), getCjCategories()]);
  const featured = allProducts.slice(0, 4);

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
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-tp-navy-dark/80 to-transparent" />
        </div>

        <div className="container-tp relative pt-20 pb-36 md:pt-28 md:pb-44">
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
            <Link href="/fabrication" className="btn btn-outline">
              {t.home.heroSecondaryCta}
            </Link>
          </div>
        </div>
      </section>

      {/* Trust bar overlapping the hero */}
      <section className="relative z-10 -mt-20 md:-mt-24">
        <div className="container-tp">
          <div className="card shadow-lg grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[var(--tp-neutral-200)]">
            {t.home.trustBar.map((item, i) => {
              const Icon = trustIcons[i];
              return (
                <div key={item.title} className="flex items-center gap-4 p-6">
                  <div className="h-12 w-12 shrink-0 rounded-xl bg-tp-blue-light text-tp-blue flex items-center justify-center">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-tp-navy">{item.title}</p>
                    <p className="text-sm text-[var(--tp-neutral-600)]">{item.copy}</p>
                  </div>
                </div>
              );
            })}
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
              eyebrow="C&J packages"
              title={t.home.featuredHeading}
              linkHref="/fabrication"
              linkLabel={t.home.viewAllPackages}
            />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {categories.length > 0 && (
              <div className="mt-12">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--tp-neutral-600)] mb-4">
                  {t.home.groupsLabel}
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {categories.map((category) => {
                    const count = allProducts.filter((p) => p.category === category.slug).length;
                    return (
                      <Link
                        key={category.slug}
                        href={`/fabrication#${category.slug}`}
                        className="inline-flex items-center gap-2 rounded-full bg-white border border-[var(--tp-neutral-200)] px-4 py-2 text-sm font-semibold text-tp-navy shadow-sm hover:border-tp-blue hover:text-tp-blue transition-colors"
                      >
                        {category.name}
                        <span className="text-xs font-bold text-tp-blue bg-tp-blue-light rounded-full px-2 py-0.5">
                          {count}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Upload RFQ band */}
      <section className="page-banner">
        <div className="container-tp relative z-10 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="eyebrow eyebrow-light mb-3">Request a quote</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">{t.home.uploadHeading}</h2>
            <p className="text-3xl md:text-4xl font-extrabold text-tp-accent mb-4">{t.home.uploadSubheading}</p>
            <p className="text-white/75 max-w-md">{t.home.uploadCopy}</p>
            <Link
              href="/contact"
              className="inline-block mt-4 text-sm font-semibold text-white/90 hover:text-white underline underline-offset-4"
            >
              {t.home.uploadNeedHelp}
            </Link>
          </div>
          <Link
            href="/rfq"
            className="rounded-2xl border-2 border-dashed border-white/35 bg-white/[0.06] backdrop-blur flex flex-col items-center justify-center text-center p-10 hover:border-tp-accent hover:bg-white/10 transition-colors"
          >
            <span className="h-14 w-14 rounded-full bg-tp-accent text-tp-navy-dark flex items-center justify-center mb-4">
              <IconUpload className="h-7 w-7" />
            </span>
            <p className="font-semibold text-white">
              {t.home.uploadDropText}{" "}
              <span className="text-tp-accent underline underline-offset-4">{t.home.uploadBrowseText}</span>
            </p>
            <p className="text-xs text-white/60 mt-2">{t.home.uploadHelp}</p>
            <span className="btn btn-accent mt-6">{t.home.uploadCta}</span>
          </Link>
        </div>
      </section>

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
                href={`/industries#${industry.slug}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="section-y bg-[var(--tp-neutral-50)]">
        <div className="container-tp">
          <SectionHeading eyebrow="Why us" title={t.home.whyHeading} center />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.home.whyPoints.map((point, i) => {
              const Icon = [IconBlueprint, IconGear, IconHeadset, IconGlobe][i];
              return (
                <div key={point.title} className="card card-hover p-6">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-tp-blue to-tp-navy text-white flex items-center justify-center mb-4 shadow-md">
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="font-bold text-tp-navy mb-1">{point.title}</p>
                  <p className="text-sm text-[var(--tp-neutral-600)]">{point.copy}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Capability + support */}
      <section className="section-y">
        <div className="container-tp grid md:grid-cols-2 gap-6">
          <div className="relative overflow-hidden rounded-2xl min-h-[18rem] flex shadow-md">
            <Image
              src="/images/photos/capability.jpg"
              alt="Industrial fabrication and engineering"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-tp-navy-dark/95 via-tp-navy/80 to-tp-navy/30" />
            <div className="relative p-8 md:p-10 text-white flex flex-col justify-center max-w-md">
              <h2 className="text-2xl font-extrabold mb-2 text-white">{t.home.capabilitiesHeading}</h2>
              <p className="text-white/80 mb-6">{t.home.capabilitiesCopy}</p>
              <Link href="/fabrication" className="btn btn-accent self-start">
                {t.home.capabilitiesCta} <span aria-hidden>&rarr;</span>
              </Link>
            </div>
          </div>
          <div className="rounded-2xl p-8 md:p-10 bg-tp-blue-light border border-tp-blue/15 flex flex-col justify-center">
            <span className="h-12 w-12 rounded-xl bg-white text-tp-blue flex items-center justify-center shadow-sm mb-4">
              <IconHeadset className="h-6 w-6" />
            </span>
            <h2 className="text-2xl font-extrabold text-tp-navy mb-2">{t.home.supportHeading}</h2>
            <p className="text-[var(--tp-neutral-600)] mb-6">{t.home.supportCopy}</p>
            <Link href="/contact" className="btn btn-primary self-start">
              {t.home.supportCta}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

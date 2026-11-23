import Image from "next/image";
import Link from "next/link";
import { t } from "@/lib/locale";
import { getCategories, getDoors, getIndustries, getProducts, getProductsBySlugs } from "@/lib/data";
import { DoorCard } from "@/components/DoorCard";
import { IndustryCard } from "@/components/IndustryCard";
import { ProductCard } from "@/components/ProductCard";
import {
  IconRig,
  IconBlueprint,
  IconGlobe,
  IconShieldCheck,
  IconHeadset,
  IconUpload,
  IconFactory,
  IconGear,
  IconTool,
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

const featuredSlugs = [
  "process-power-underground-piping-packages",
  "oil-gas-separator-knockout-drums",
  "metering-packages-crude-gas",
  "storage-tanks-api-650",
];

const supportingIcons = [IconFactory, IconShieldCheck, IconGlobe, IconHeadset];

export default async function HomePage() {
  const doors = getDoors();
  const industries = getIndustries();
  const [categories, allProducts, featured] = await Promise.all([
    getCategories(),
    getProducts(),
    getProductsBySlugs(featuredSlugs, 4),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-tp-navy text-white">
        <div className="absolute inset-0">
          <Image
            src="/images/photos/hero-refinery.jpg"
            alt="Industrial refinery at dusk"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-tp-navy/95 via-tp-navy/70 to-tp-navy/20" />
        </div>

        <div className="hidden lg:flex absolute inset-y-0 end-8 items-center z-10">
          <span
            className="uppercase tracking-[0.3em] text-xs font-semibold text-white/70"
            style={{ writingMode: "vertical-rl" }}
          >
            {t.home.heroKicker}
          </span>
        </div>

        <div className="container-tp relative py-20 md:py-28">
          <p className="uppercase tracking-widest text-xs font-semibold text-tp-blue mb-4">
            {t.home.heroKicker}
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight max-w-2xl text-white">
            {t.home.heroHeadline1}
            <br />
            {t.home.heroHeadline2}
            <br />
            <span className="text-tp-blue">{t.home.heroHeadline3}</span>
          </h1>
          <p className="mt-5 max-w-xl text-white/80 text-base md:text-lg">{t.home.heroCopy}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/rfq" className="btn btn-primary">
              {t.home.heroPrimaryCta}
            </Link>
            <Link href="/fabrication" className="btn btn-outline">
              {t.home.heroSecondaryCta}
            </Link>
          </div>

          <div className="mt-14 grid sm:grid-cols-3 gap-6 max-w-3xl">
            {t.home.trustBar.map((item, i) => {
              const Icon = [IconGear, IconBlueprint, IconShieldCheck][i];
              return (
                <div key={item.title} className="flex items-start gap-3">
                  <Icon className="h-6 w-6 text-tp-blue shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-white/70">{item.copy}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Two divisions */}
      <section className="section-y bg-[var(--tp-neutral-50)]">
        <div className="container-tp">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">{t.home.doorsHeading}</h2>
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
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

      {/* Upload RFQ strip */}
      <section className="section-y">
        <div className="container-tp grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">{t.home.uploadHeading}</h2>
            <p className="text-2xl md:text-3xl font-bold text-tp-blue mb-3">{t.home.uploadSubheading}</p>
            <p className="text-[var(--tp-neutral-600)]">{t.home.uploadCopy}</p>
            <Link href="/contact" className="link-blue text-sm mt-3 inline-block">
              {t.home.uploadNeedHelp}
            </Link>
          </div>
          <Link
            href="/rfq"
            className="card border-dashed border-2 flex flex-col items-center justify-center text-center p-10 hover:border-tp-blue transition-colors"
          >
            <IconUpload className="h-9 w-9 text-tp-blue mb-3" />
            <p className="font-semibold text-tp-navy">
              {t.home.uploadDropText} <span className="link-blue">{t.home.uploadBrowseText}</span>
            </p>
            <p className="text-xs text-[var(--tp-neutral-600)] mt-2">{t.home.uploadHelp}</p>
            <span className="btn btn-primary mt-5">{t.home.uploadCta}</span>
          </Link>
        </div>
      </section>

      {/* Package groups + supporting points */}
      <section className="section-y bg-[var(--tp-neutral-50)]">
        <div className="container-tp grid md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-xl font-bold mb-6">{t.home.supportingHeading}</h2>
            <div className="grid grid-cols-2 gap-5">
              {t.home.supportingPoints.map((point, i) => {
                const Icon = supportingIcons[i] ?? IconTool;
                return (
                  <div key={point} className="flex items-center gap-2.5">
                    <Icon className="h-6 w-6 text-tp-blue shrink-0" />
                    <span className="text-sm font-medium text-tp-navy">{point}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wide text-[var(--tp-neutral-600)]">
                {t.home.groupsLabel}
              </h3>
              <Link href="/epc" className="link-blue text-sm">
                {t.home.viewAllPackages}
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {categories.slice(0, 6).map((category) => {
                const count = allProducts.filter((p) => p.category === category.slug).length;
                return (
                  <Link
                    key={category.slug}
                    href={`/epc/${category.slug}`}
                    className="card p-4 hover:border-tp-blue/40 hover:shadow-md transition-shadow"
                  >
                    <p className="text-sm font-bold text-tp-navy">{category.name}</p>
                    <p className="text-xs font-semibold text-tp-blue mt-1">
                      {count} {count === 1 ? "package" : "packages"}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Featured packages */}
      <section className="section-y">
        <div className="container-tp">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">{t.home.featuredHeading}</h2>
            <Link href="/epc" className="link-blue text-sm">
              {t.home.viewAllPackages}
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="section-y bg-[var(--tp-neutral-50)]">
        <div className="container-tp">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl md:text-3xl font-bold">{t.home.industriesHeading}</h2>
            <Link href="/industries" className="link-blue text-sm">
              {t.home.viewAllIndustries}
            </Link>
          </div>
          <p className="text-[var(--tp-neutral-600)] mb-8">{t.home.industriesCopy}</p>
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

      {/* Fabrication capability + support */}
      <section className="section-y">
        <div className="container-tp grid md:grid-cols-2 gap-6">
          <div className="card overflow-hidden grid sm:grid-cols-2">
            <div className="bg-tp-navy text-white p-8 flex flex-col justify-center">
              <h2 className="text-xl font-bold mb-2 text-white">{t.home.capabilitiesHeading}</h2>
              <p className="text-white/75 mb-5">{t.home.capabilitiesCopy}</p>
              <Link href="/fabrication" className="btn btn-outline self-start">
                {t.home.capabilitiesCta}
              </Link>
            </div>
            <div className="relative min-h-[220px] sm:min-h-full">
              <Image
                src="/images/photos/capability.jpg"
                alt="Industrial fabrication and engineering"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </div>
          </div>
          <div className="card p-8 bg-tp-blue-light flex flex-col justify-center">
            <h2 className="text-xl font-bold text-tp-navy mb-2">{t.home.supportHeading}</h2>
            <p className="text-[var(--tp-neutral-600)] mb-5">{t.home.supportCopy}</p>
            <Link href="/contact" className="btn btn-primary self-start">
              {t.home.supportCta}
            </Link>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="section-y bg-[var(--tp-neutral-50)]">
        <div className="container-tp">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">{t.home.whyHeading}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.home.whyPoints.map((point, i) => {
              const Icon = [IconBlueprint, IconGear, IconHeadset, IconGlobe][i];
              return (
                <div key={point.title} className="text-center">
                  <div className="h-12 w-12 rounded-full bg-tp-blue-light text-tp-blue flex items-center justify-center mx-auto mb-3">
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="font-semibold text-tp-navy">{point.title}</p>
                  <p className="text-sm text-[var(--tp-neutral-600)]">{point.copy}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

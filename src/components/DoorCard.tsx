import Image from "next/image";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";

interface DoorCardProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  image: string;
  title: string;
  description: string;
  href: string;
  cta: string;
}

export function DoorCard({ icon: Icon, image, title, description, href, cta }: DoorCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex min-h-[22rem] overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition-shadow"
    >
      <Image
        src={image}
        alt=""
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-500"
        sizes="(max-width: 640px) 100vw, 50vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-tp-navy-dark via-tp-navy/70 to-tp-navy/10" />
      <div className="relative mt-auto p-7 md:p-8 text-white w-full">
        <div className="h-11 w-11 rounded-xl bg-white/15 backdrop-blur text-white flex items-center justify-center mb-4 ring-1 ring-white/20">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-2xl font-extrabold text-white mb-2">{title}</h3>
        <p className="text-sm text-white/80 mb-5 max-w-md">{description}</p>
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-tp-navy-dark bg-tp-accent rounded-lg px-4 py-2 group-hover:bg-[#ffb83d] transition-colors">
          {cta} <span aria-hidden className="transition-transform group-hover:translate-x-1">&rarr;</span>
        </span>
      </div>
    </Link>
  );
}

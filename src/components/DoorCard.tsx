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
    <div className="card overflow-hidden flex flex-col hover:shadow-md hover:border-tp-blue/40 transition-shadow">
      <div className="relative aspect-[4/3]">
        <Image src={image} alt="" fill className="object-cover" sizes="(max-width: 640px) 50vw, 25vw" />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="h-10 w-10 rounded-lg bg-tp-blue-light text-tp-blue flex items-center justify-center mb-3">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="font-bold text-tp-navy mb-1.5">{title}</h3>
        <p className="text-sm text-[var(--tp-neutral-600)] flex-1">{description}</p>
        <Link href={href} className="link-blue text-sm mt-4 inline-flex items-center gap-1">
          {cta} <span aria-hidden>&rarr;</span>
        </Link>
      </div>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";

interface IndustryCardProps {
  image: string;
  name: string;
  href: string;
}

export function IndustryCard({ image, name, href }: IndustryCardProps) {
  return (
    <Link
      href={href}
      className="group relative block aspect-[3/4] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
    >
      <Image
        src={image}
        alt=""
        fill
        className="object-cover group-hover:scale-110 transition-transform duration-500"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-tp-navy-dark/90 via-tp-navy/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <span className="block h-0.5 w-6 bg-tp-accent mb-2 group-hover:w-12 transition-all" />
        <span className="text-sm font-bold text-white leading-snug">{name}</span>
      </div>
    </Link>
  );
}

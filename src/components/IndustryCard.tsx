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
      className="group relative block aspect-[4/3] rounded-xl overflow-hidden hover:shadow-md transition-shadow"
    >
      <Image
        src={image}
        alt=""
        fill
        className="object-cover group-hover:scale-105 transition-transform"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-white">{name}</span>
        <span aria-hidden className="text-white/90 text-sm">&rarr;</span>
      </div>
    </Link>
  );
}

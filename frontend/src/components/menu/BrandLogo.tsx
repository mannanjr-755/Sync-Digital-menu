import Link from "next/link";
import Image from "next/image";

type Props = {
  href?: string;
  light?: boolean;
  size?: "sm" | "md";
};

export function BrandLogo({ href = "/", light = false, size = "md" }: Props) {
  const text = size === "sm" ? "text-lg" : "text-xl";
  const logoSize = size === "sm" ? 28 : 32;

  const content = (
    <span className="inline-flex items-center gap-2">
      <Image
        src="/logo.png"
        alt="Sync"
        width={logoSize}
        height={logoSize}
        className="rounded-md object-cover"
        priority
      />
      <span
        className={`font-semibold tracking-tight ${text} ${light ? "text-white" : "text-[var(--text)]"}`}
      >
        Sync<span className={light ? "text-white/90" : "text-[var(--sync-blue)]"}>.</span>
      </span>
    </span>
  );

  if (!href) return content;
  return (
    <Link href={href} className="shrink-0">
      {content}
    </Link>
  );
}

import Link from "next/link";
import { formatMoney } from "@/lib/utils";
import type { Product } from "@/data/catalog";
import { ProductImage } from "./ProductImage";

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  return (
    <article className="flex gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-white p-3 shadow-[var(--shadow-sm)]">
      <Link
        href={`/menu/${product.id}`}
        className="relative h-[84px] w-[84px] shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-[var(--bg-warm)]"
      >
        <ProductImage src={product.image} alt={product.name} fill sizes="84px" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <Link href={`/menu/${product.id}`} className="min-w-0">
          <h3 className="truncate text-[15px] font-semibold text-[var(--text)]">{product.name}</h3>
          <p className="mt-0.5 line-clamp-2 text-xs italic text-[var(--text-muted)]">
            {product.description}
          </p>
        </Link>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="text-sm font-bold text-[var(--text)]">{formatMoney(product.basePrice)}</span>
          <Link
            href={`/menu/${product.id}`}
            className="rounded-full bg-[var(--sync-blue)] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white hover:bg-[var(--sync-blue-dark)]"
          >
            Add
          </Link>
        </div>
      </div>
    </article>
  );
}

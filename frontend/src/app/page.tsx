"use client";

import Link from "next/link";
import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppHeader } from "@/components/menu/AppHeader";
import { CategoryShortcuts } from "@/components/menu/CategoryShortcuts";
import { PageShell } from "@/components/menu/PageShell";
import { PrimaryButton } from "@/components/menu/PrimaryButton";
import { ProductImage } from "@/components/menu/ProductImage";
import { useCart } from "@/context/CartContext";
import { CATEGORIES, IMAGES, RESTAURANT, getFeaturedProducts } from "@/data/catalog";
import { formatMoney } from "@/lib/utils";

function TableFromQuery() {
  const searchParams = useSearchParams();
  const { setTableNumber } = useCart();

  useEffect(() => {
    const table = Number(searchParams.get("table"));
    if (Number.isInteger(table) && table > 0) setTableNumber(table);
  }, [searchParams, setTableNumber]);

  return null;
}

export default function HomePage() {
  const featured = getFeaturedProducts()[0];

  return (
    <PageShell>
      <Suspense fallback={null}>
        <TableFromQuery />
      </Suspense>
      <AppHeader />

      <section className="relative mx-4 mt-4 overflow-hidden rounded-[var(--radius-xl)]">
        <div className="relative aspect-[4/3] min-h-[220px]">
          <ProductImage
            src={IMAGES.hero}
            alt="Welcome to Sync cafe"
            fill
            sizes="480px"
            priority
            className="scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,40,100,0.88)] via-[rgba(0,55,140,0.45)] to-[rgba(0,71,171,0.2)]" />
          <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/80">
              Welcome to
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">Sync.</h1>
            <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-white/85">
              {RESTAURANT.tagline}
            </p>
            <div className="mt-5">
              <PrimaryButton href="/menu" variant="light" showArrow className="max-w-[200px]">
                Explore Menu
              </PrimaryButton>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pt-6">
        <CategoryShortcuts categories={CATEGORIES} />
      </section>

      {featured && (
        <section className="px-4 pb-8 pt-5">
          <div className="mb-3 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--sync-blue)]">
                Featured
              </p>
              <h2 className="text-lg font-bold text-[var(--text)]">Our Signature</h2>
            </div>
            <Link href="/menu" className="text-sm font-medium text-[var(--sync-blue)]">
              See all
            </Link>
          </div>
          <Link
            href={`/menu/${featured.id}`}
            className="flex gap-3 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-white p-3 shadow-[var(--shadow-sm)] transition hover:shadow-[var(--shadow)]"
          >
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[var(--radius-md)]">
              <ProductImage src={featured.image} alt={featured.name} fill sizes="96px" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-center">
              <h3 className="text-base font-semibold text-[var(--text)]">{featured.name}</h3>
              <p className="mt-1 line-clamp-2 text-xs text-[var(--text-muted)]">
                {featured.description}
              </p>
              <p className="mt-2 text-sm font-bold text-[var(--sync-blue)]">
                {formatMoney(featured.basePrice)}
              </p>
            </div>
          </Link>
        </section>
      )}
    </PageShell>
  );
}

"use client";

import { Suspense, useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AppHeader } from "@/components/menu/AppHeader";
import { CartSummaryBar } from "@/components/menu/CartSummaryBar";
import { CategoryTabs } from "@/components/menu/CategoryTabs";
import { PageShell } from "@/components/menu/PageShell";
import { ProductCard } from "@/components/menu/ProductCard";
import { CATEGORIES, getProductsByCategory } from "@/data/catalog";

function CategoryQuerySync({
  activeId,
  onChange,
}: {
  activeId: string;
  onChange: (id: string) => void;
}) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const fromQuery = searchParams.get("category");
    if (fromQuery && CATEGORIES.some((c) => c.id === fromQuery) && fromQuery !== activeId) {
      onChange(fromQuery);
    }
  }, [searchParams, activeId, onChange]);
  return null;
}

function MenuBody() {
  const [activeId, setActiveId] = useState(CATEGORIES[0].id);
  const products = useMemo(() => getProductsByCategory(activeId), [activeId]);

  return (
    <PageShell className="flex flex-col">
      <Suspense fallback={null}>
        <CategoryQuerySync activeId={activeId} onChange={setActiveId} />
      </Suspense>
      <AppHeader />
      <div className="flex-1 px-4 pb-2 pt-5">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">Our Menu</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">Freshly made. Always.</p>

        <div className="mt-5">
          <CategoryTabs categories={CATEGORIES} activeId={activeId} onChange={setActiveId} />
        </div>

        <div className="mt-4 space-y-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {products.length === 0 && (
            <p className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] bg-white p-8 text-center text-sm text-[var(--text-muted)]">
              No items in this category yet.
            </p>
          )}
        </div>
      </div>
      <CartSummaryBar />
    </PageShell>
  );
}

export default function MenuPage() {
  return <MenuBody />;
}

"use client";

import Link from "next/link";
import { Coffee, CupSoda, GlassWater, Leaf, Sandwich, CakeSlice } from "lucide-react";
import type { Category } from "@/data/catalog";

const ICONS = {
  coffee: Coffee,
  iced: CupSoda,
  noncoffee: GlassWater,
  tea: Leaf,
  food: Sandwich,
  dessert: CakeSlice,
} as const;

type Props = {
  categories: Category[];
};

export function CategoryShortcuts({ categories }: Props) {
  return (
    <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {categories.map((cat) => {
        const Icon = ICONS[cat.icon];
        return (
          <Link
            key={cat.id}
            href={`/menu?category=${cat.id}`}
            className="flex w-[72px] shrink-0 flex-col items-center gap-2 rounded-[var(--radius-md)] px-1 py-2 text-center transition hover:bg-white"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[var(--sync-blue)] shadow-[var(--shadow-sm)] ring-1 ring-[var(--border)]">
              <Icon className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <span className="text-[11px] font-medium leading-tight text-[var(--text-muted)]">
              {cat.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

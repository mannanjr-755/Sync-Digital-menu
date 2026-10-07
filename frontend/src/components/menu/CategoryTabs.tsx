"use client";

import type { Category } from "@/data/catalog";

type Props = {
  categories: Category[];
  activeId: string;
  onChange: (id: string) => void;
};

export function CategoryTabs({ categories, activeId, onChange }: Props) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex w-max gap-2">
        {categories.map((cat) => {
          const active = cat.id === activeId;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onChange(cat.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition ${
                active
                  ? "bg-[var(--sync-blue)] text-white shadow-[var(--shadow-sm)]"
                  : "bg-white text-[var(--text-muted)] border border-[var(--border)] hover:border-[var(--sync-blue)]/40"
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

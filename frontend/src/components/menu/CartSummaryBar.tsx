"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatMoney } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

export function CartSummaryBar() {
  const { itemCount, total } = useCart();
  if (itemCount === 0) return null;

  return (
    <div className="pointer-events-none sticky bottom-0 z-30 px-4 pb-4 pt-2">
      <Link
        href="/cart"
        className="pointer-events-auto flex items-center justify-between gap-3 rounded-2xl bg-[var(--sync-blue)] px-4 py-3.5 text-white shadow-[var(--shadow)]"
      >
        <div>
          <p className="text-xs text-white/80">
            {itemCount} {itemCount === 1 ? "Item" : "Items"}
          </p>
          <p className="text-sm font-bold">{formatMoney(total)}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
          View Cart <ArrowRight className="h-4 w-4" />
        </span>
      </Link>
    </div>
  );
}

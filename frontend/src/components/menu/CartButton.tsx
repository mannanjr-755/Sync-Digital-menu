"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

type Props = {
  light?: boolean;
};

export function CartButton({ light }: Props) {
  const { itemCount } = useCart();

  return (
    <Link
      href="/cart"
      className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full transition ${
        light
          ? "bg-white/15 text-white hover:bg-white/25"
          : "bg-white text-[var(--sync-blue)] shadow-[var(--shadow-sm)] hover:bg-[var(--sync-blue-soft)]"
      }`}
      aria-label={`Cart, ${itemCount} items`}
    >
      <ShoppingBag className="h-5 w-5" />
      {itemCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--sync-blue)] px-1 text-[10px] font-bold text-white">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Link>
  );
}

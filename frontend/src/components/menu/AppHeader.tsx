"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { TableBadge } from "./TableBadge";
import { CartButton } from "./CartButton";
import { useCart } from "@/context/CartContext";

type Props = {
  variant?: "brand" | "page";
  title?: string;
  backHref?: string;
  showCart?: boolean;
  showTable?: boolean;
};

export function AppHeader({
  variant = "brand",
  title,
  backHref,
  showCart = true,
  showTable = true,
}: Props) {
  const { tableNumber } = useCart();

  if (variant === "page") {
    return (
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-white/95 backdrop-blur">
        <div className="flex h-[var(--header-h)] items-center gap-3 px-4">
          {backHref ? (
            <Link
              href={backHref}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--sync-blue)] hover:bg-[var(--sync-blue-soft)]"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
          ) : (
            <div className="w-9" />
          )}
          <h1 className="flex-1 text-center text-base font-semibold text-[var(--text)]">
            {title}
          </h1>
          {showCart ? <CartButton /> : <div className="w-10" />}
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 bg-[var(--sync-blue)] text-white shadow-[var(--shadow-sm)]">
      <div className="flex h-[var(--header-h)] items-center justify-between gap-3 px-4">
        <BrandLogo light size="sm" />
        {showTable && <TableBadge tableNumber={tableNumber} light />}
        {showCart ? <CartButton light /> : <div className="w-10" />}
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { AppHeader } from "@/components/menu/AppHeader";
import { PageShell } from "@/components/menu/PageShell";
import { PrimaryButton } from "@/components/menu/PrimaryButton";
import { ProductImage } from "@/components/menu/ProductImage";
import { QuantitySelector } from "@/components/menu/QuantitySelector";
import { useCart } from "@/context/CartContext";
import { formatMoney } from "@/lib/utils";

export default function CartPage() {
  const { items, subtotal, tax, total, updateQty, removeItem, itemCount } = useCart();

  return (
    <PageShell className="flex flex-col">
      <AppHeader variant="page" title="Your Cart" backHref="/menu" />

      <div className="flex-1 px-4 py-4">
        {itemCount === 0 ? (
          <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
            <p className="text-sm text-[var(--text-muted)]">Your cart is empty.</p>
            <Link href="/menu" className="text-sm font-semibold text-[var(--sync-blue)]">
              Browse menu
            </Link>
          </div>
        ) : (
          <>
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.key}
                  className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-white p-3 shadow-[var(--shadow-sm)]"
                >
                  <div className="flex gap-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-[var(--bg-warm)]">
                      <ProductImage src={item.image} alt={item.name} fill sizes="64px" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[var(--text)]">{item.name}</p>
                          {item.optionsLabel && (
                            <p className="mt-0.5 line-clamp-2 text-xs text-[var(--text-muted)]">
                              {item.optionsLabel}
                            </p>
                          )}
                          {item.specialInstructions && (
                            <p className="mt-0.5 text-xs italic text-[var(--text-dim)]">
                              “{item.specialInstructions}”
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          aria-label="Remove item"
                          onClick={() => removeItem(item.key)}
                          className="rounded-full p-1.5 text-[var(--text-dim)] hover:bg-red-50 hover:text-[var(--danger)]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <QuantitySelector
                          size="sm"
                          value={item.quantity}
                          min={0}
                          onChange={(q) => updateQty(item.key, q)}
                        />
                        <p className="text-sm font-bold text-[var(--text)]">
                          {formatMoney(item.unitPrice * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-5 rounded-[var(--radius-lg)] border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-sm)]">
              <div className="flex justify-between text-sm text-[var(--text-muted)]">
                <span>Subtotal</span>
                <span>{formatMoney(subtotal)}</span>
              </div>
              <div className="mt-2 flex justify-between text-sm text-[var(--text-muted)]">
                <span>Tax (10%)</span>
                <span>{formatMoney(tax)}</span>
              </div>
              <div className="mt-3 flex justify-between border-t border-[var(--border)] pt-3 text-base font-bold text-[var(--text)]">
                <span>Total</span>
                <span>{formatMoney(total)}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {itemCount > 0 && (
        <div className="sticky bottom-0 border-t border-[var(--border)] bg-white/95 px-4 py-3 backdrop-blur">
          <PrimaryButton href="/checkout" showArrow>
            Proceed to Checkout
          </PrimaryButton>
        </div>
      )}
    </PageShell>
  );
}

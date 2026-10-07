"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/menu/AppHeader";
import { FormField, TextInput } from "@/components/menu/FormField";
import { PageShell } from "@/components/menu/PageShell";
import { PrimaryButton } from "@/components/menu/PrimaryButton";
import { useCart } from "@/context/CartContext";
import { RESTAURANT } from "@/data/catalog";
import type { PlacedOrderSnapshot } from "@/lib/cart-types";
import { paymentLabel } from "@/lib/order-ui";
import { formatMoney } from "@/lib/utils";

const PAYMENT_OPTIONS = [
  { id: "counter", label: "Pay at Counter" },
  { id: "cash", label: "Cash" },
  { id: "card", label: "Card" },
  { id: "digital", label: "Digital Payment" },
] as const;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, tax, total, tableNumber, setTableNumber, clearCart, setLastOrder, itemCount } =
    useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [orderType, setOrderType] = useState<"DINE_IN" | "TAKE_AWAY">("DINE_IN");
  const [paymentMethod, setPaymentMethod] =
    useState<(typeof PAYMENT_OPTIONS)[number]["id"]>("counter");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function placeOrder() {
    setError("");
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!phone.trim() || phone.trim().length < 7) {
      setError("Please enter a valid phone number.");
      return;
    }
    if (itemCount === 0) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantSlug: RESTAURANT.slug,
          tableNumber: orderType === "DINE_IN" ? tableNumber : tableNumber,
          customerName: name.trim(),
          customerPhone: phone.trim(),
          orderType,
          paymentMethod: paymentLabel(paymentMethod),
          items: items.map((item) => ({
            productId: item.productId,
            itemName: item.name,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            selectedOptions: JSON.stringify({
              optionsLabel: item.optionsLabel,
              sizeId: item.sizeId,
              milkId: item.milkId,
              addOnIds: item.addOnIds,
              specialInstructions: item.specialInstructions,
              image: item.image,
            }),
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to place order");
      }

      const order = data.order as {
        id: string;
        orderNumber: string;
        status: string;
        createdAt: string;
        table: { tableNumber: number };
      };

      const snapshot: PlacedOrderSnapshot = {
        id: order.id,
        orderNumber: order.orderNumber,
        tableNumber: order.table.tableNumber,
        orderType,
        paymentMethod,
        customerName: name.trim(),
        customerPhone: phone.trim(),
        items: items.map((i) => ({
          name: i.name,
          image: i.image,
          optionsLabel: i.optionsLabel,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          subtotal: i.unitPrice * i.quantity,
        })),
        subtotal,
        tax,
        total,
        status: order.status,
        createdAt: order.createdAt,
      };

      setLastOrder(snapshot);
      clearCart();
      router.push(`/order-confirmed/${order.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (itemCount === 0) {
    return (
      <PageShell>
        <AppHeader variant="page" title="Checkout" backHref="/cart" showCart={false} />
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2 p-6 text-center">
          <p className="text-sm text-[var(--text-muted)]">Nothing to checkout.</p>
          <PrimaryButton href="/menu" className="mt-3 max-w-xs">
            Browse menu
          </PrimaryButton>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell className="flex flex-col">
      <AppHeader variant="page" title="Checkout" backHref="/cart" showCart={false} />

      <div className="flex-1 space-y-5 px-4 py-4 pb-28">
        <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-sm)]">
          <h2 className="text-sm font-semibold text-[var(--text)]">Customer Details</h2>
          <div className="mt-3 space-y-3">
            <FormField label="Full Name">
              <TextInput
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </FormField>
            <FormField label="Phone Number">
              <TextInput
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="03XX XXXXXXX"
                required
              />
            </FormField>
          </div>
        </section>

        <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-sm)]">
          <h2 className="text-sm font-semibold text-[var(--text)]">Order Type</h2>
          <div className="mt-3 flex gap-2">
            {(
              [
                { id: "DINE_IN", label: "Dine-in" },
                { id: "TAKE_AWAY", label: "Takeaway" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setOrderType(opt.id)}
                className={`flex-1 rounded-full px-3 py-2.5 text-sm font-medium transition ${
                  orderType === opt.id
                    ? "bg-[var(--sync-blue)] text-white"
                    : "border border-[var(--border)] bg-white text-[var(--text-muted)]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {orderType === "DINE_IN" && (
            <FormField label="Table" hint="Confirm your table number">
              <select
                value={tableNumber}
                onChange={(e) => setTableNumber(Number(e.target.value))}
                className="mt-3 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-white px-3.5 py-3 text-sm outline-none focus:border-[var(--sync-blue)]"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    Table {String(n).padStart(2, "0")}
                  </option>
                ))}
              </select>
            </FormField>
          )}
        </section>

        <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-sm)]">
          <h2 className="text-sm font-semibold text-[var(--text)]">Payment Method</h2>
          <div className="mt-3 space-y-2">
            {PAYMENT_OPTIONS.map((opt) => {
              const active = paymentMethod === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPaymentMethod(opt.id)}
                  className={`flex w-full items-center gap-3 rounded-[var(--radius-md)] border px-3.5 py-3 text-left text-sm transition ${
                    active
                      ? "border-[var(--sync-blue)] bg-[var(--sync-blue-soft)]"
                      : "border-[var(--border)] bg-white"
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                      active ? "border-[var(--sync-blue)]" : "border-[var(--border-strong)]"
                    }`}
                  >
                    {active && <span className="h-2 w-2 rounded-full bg-[var(--sync-blue)]" />}
                  </span>
                  <span className="font-medium text-[var(--text)]">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-sm)]">
          <h2 className="text-sm font-semibold text-[var(--text)]">Order Summary</h2>
          <ul className="mt-3 space-y-2">
            {items.map((item) => (
              <li key={item.key} className="flex justify-between gap-3 text-sm">
                <span className="text-[var(--text-muted)]">
                  {item.quantity}× {item.name}
                </span>
                <span className="shrink-0 font-medium text-[var(--text)]">
                  {formatMoney(item.unitPrice * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-3 space-y-1 border-t border-[var(--border)] pt-3 text-sm">
            <div className="flex justify-between text-[var(--text-muted)]">
              <span>Subtotal</span>
              <span>{formatMoney(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[var(--text-muted)]">
              <span>Tax</span>
              <span>{formatMoney(tax)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-[var(--text)]">
              <span>Total</span>
              <span>{formatMoney(total)}</span>
            </div>
          </div>
        </section>

        {error && (
          <p className="rounded-[var(--radius-md)] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
      </div>

      <div className="sticky bottom-0 border-t border-[var(--border)] bg-white/95 px-4 py-3 backdrop-blur">
        <PrimaryButton onClick={placeOrder} disabled={loading}>
          {loading ? "Placing order…" : `Place Order — ${formatMoney(total)}`}
        </PrimaryButton>
      </div>
    </PageShell>
  );
}

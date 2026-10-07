"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Check } from "lucide-react";
import { AppHeader } from "@/components/menu/AppHeader";
import { OrderStatusTimeline } from "@/components/menu/OrderStatusTimeline";
import { PageShell } from "@/components/menu/PageShell";
import { PrimaryButton } from "@/components/menu/PrimaryButton";
import { useCart } from "@/context/CartContext";
import { RESTAURANT } from "@/data/catalog";

type OrderPayload = {
  id: string;
  orderNumber: string;
  status: string;
  table: { tableNumber: number };
};

export default function OrderConfirmedPage() {
  const params = useParams<{ orderId: string }>();
  const { lastOrder } = useCart();
  const [order, setOrder] = useState<OrderPayload | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/orders/${params.orderId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Order not found");
        if (!cancelled) setOrder(data.order);
      } catch (e) {
        if (!cancelled) {
          if (lastOrder?.id === params.orderId) {
            setOrder({
              id: lastOrder.id,
              orderNumber: lastOrder.orderNumber,
              status: lastOrder.status,
              table: { tableNumber: lastOrder.tableNumber },
            });
          } else {
            setError(e instanceof Error ? e.message : "Failed to load order");
          }
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [params.orderId, lastOrder]);

  const tableNumber = order?.table.tableNumber ?? lastOrder?.tableNumber ?? RESTAURANT.defaultTable;
  const orderNumber = order?.orderNumber ?? lastOrder?.orderNumber ?? "—";
  const status = order?.status ?? lastOrder?.status ?? "NEW";

  return (
    <PageShell>
      <AppHeader variant="page" title="Confirmed" backHref="/" showCart={false} />

      <div className="px-4 py-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--sync-blue)] text-white shadow-[var(--shadow)]">
          <Check className="h-8 w-8" strokeWidth={2.5} />
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-[var(--text)]">Order Confirmed</h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Thanks! We&apos;ve received your order and the kitchen is on it.
        </p>

        {error && !order && (
          <p className="mt-4 text-sm text-[var(--danger)]">{error}</p>
        )}

        <div className="mt-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-white p-5 text-left shadow-[var(--shadow-sm)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-[var(--text-dim)]">Order</p>
              <p className="text-lg font-bold text-[var(--sync-blue)]">#{orderNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-[var(--text-dim)]">Table</p>
              <p className="text-lg font-bold text-[var(--text)]">
                {String(tableNumber).padStart(2, "0")}
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-[var(--text-muted)]">
            Estimated preparation {RESTAURANT.prepMinutes.min}–{RESTAURANT.prepMinutes.max} minutes
          </p>
          <div className="mt-5">
            <OrderStatusTimeline status={status} />
          </div>
        </div>

        <div className="mt-6">
          <PrimaryButton href={`/track-order/${params.orderId}`} showArrow>
            Track Order
          </PrimaryButton>
        </div>
      </div>
    </PageShell>
  );
}

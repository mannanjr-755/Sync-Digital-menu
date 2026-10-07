"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { AppHeader } from "@/components/menu/AppHeader";
import { OrderStatusTimeline } from "@/components/menu/OrderStatusTimeline";
import { PageShell } from "@/components/menu/PageShell";
import { PrimaryButton } from "@/components/menu/PrimaryButton";
import { ProductImage } from "@/components/menu/ProductImage";
import { useCart } from "@/context/CartContext";
import { IMAGES } from "@/data/catalog";
import { stepIndexForStatus } from "@/lib/order-ui";

type OrderPayload = {
  id: string;
  orderNumber: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  table: { tableNumber: number };
};

export default function TrackOrderPage() {
  const params = useParams<{ orderId: string }>();
  const { lastOrder } = useCart();
  const [order, setOrder] = useState<OrderPayload | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/orders/${params.orderId}`);
        const data = await res.json();
        if (res.ok && !cancelled) setOrder(data.order);
      } catch {
        /* fallback to lastOrder */
      }
    }
    load();
    const timer = setInterval(load, 8000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [params.orderId]);

  const status = order?.status ?? lastOrder?.status ?? "NEW";
  const orderNumber = order?.orderNumber ?? lastOrder?.orderNumber ?? "—";
  const tableNumber = order?.table.tableNumber ?? lastOrder?.tableNumber ?? 7;
  const createdAt = order?.createdAt ?? lastOrder?.createdAt;
  const updatedAt = order?.updatedAt ?? order?.createdAt ?? lastOrder?.createdAt;
  const currentStep = stepIndexForStatus(status);

  const timestamps: Record<string, string> = {};
  if (createdAt) {
    timestamps.received = format(new Date(createdAt), "h:mm a");
  }
  if (currentStep >= 1 && updatedAt) {
    timestamps.preparing = format(new Date(updatedAt), "h:mm a");
  }
  if (currentStep >= 2 && updatedAt) {
    timestamps.ready = format(new Date(updatedAt), "h:mm a");
  }
  if (currentStep >= 3 && updatedAt) {
    timestamps.served = format(new Date(updatedAt), "h:mm a");
  }

  return (
    <PageShell className="flex flex-col">
      <AppHeader
        variant="brand"
        showCart={false}
        showTable
      />
      <div className="bg-[var(--sync-blue)] px-4 pb-5 pt-1 text-white">
        <h1 className="text-xl font-bold">Track Order</h1>
        <p className="mt-1 text-sm text-white/80">
          #{orderNumber} · Table {String(tableNumber).padStart(2, "0")}
        </p>
      </div>

      <div className="flex-1 px-4 py-5">
        <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-sm)]">
          <OrderStatusTimeline status={status} orientation="vertical" timestamps={timestamps} />
        </div>

        <div className="relative mt-5 overflow-hidden rounded-[var(--radius-lg)]">
          <div className="relative aspect-[16/9]">
            <ProductImage src={IMAGES.cafeInterior} alt="Cafe interior" fill sizes="480px" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <p className="absolute bottom-4 left-4 right-4 text-sm font-medium text-white">
              Good things take a little time.
            </p>
          </div>
        </div>

        <div className="mt-5">
          <PrimaryButton href={`/order-status/${params.orderId}`} showArrow>
            Live status
          </PrimaryButton>
        </div>
      </div>
    </PageShell>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChefHat } from "lucide-react";
import { BrandLogo } from "@/components/menu/BrandLogo";
import { PageShell } from "@/components/menu/PageShell";
import { ProductImage } from "@/components/menu/ProductImage";
import { useCart } from "@/context/CartContext";
import { IMAGES, RESTAURANT, getProduct } from "@/data/catalog";
import { statusHeadline, stepIndexForStatus } from "@/lib/order-ui";

type OrderPayload = {
  id: string;
  orderNumber: string;
  status: string;
  table: { tableNumber: number };
  items: Array<{ itemName: string; quantity: number; selectedOptions: string | null }>;
};

export default function LiveOrderStatusPage() {
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
        /* ignore */
      }
    }
    load();
    const timer = setInterval(load, 6000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [params.orderId]);

  const status = order?.status ?? lastOrder?.status ?? "PREPARING";
  const orderNumber = order?.orderNumber ?? lastOrder?.orderNumber ?? "—";
  const tableNumber = order?.table.tableNumber ?? lastOrder?.tableNumber ?? 7;
  const progress = ((stepIndexForStatus(status) + 1) / 4) * 100;

  const firstItemName =
    order?.items?.[0]?.itemName ?? lastOrder?.items?.[0]?.name ?? "Your order";
  const firstImage =
    lastOrder?.items?.[0]?.image ||
    (() => {
      try {
        const raw = order?.items?.[0]?.selectedOptions;
        if (!raw) return null;
        const parsed = JSON.parse(raw) as { image?: string };
        return parsed.image || null;
      } catch {
        return null;
      }
    })() ||
    getProduct("iced-latte")?.image ||
    IMAGES.icedLatte;

  return (
    <PageShell className="relative overflow-hidden bg-[var(--sync-blue-dark)] text-white">
      <div className="absolute inset-0">
        <ProductImage src={IMAGES.kitchen} alt="" fill sizes="560px" className="opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,35,90,0.55)] via-[rgba(0,45,110,0.72)] to-[rgba(0,30,80,0.92)]" />
      </div>

      <div className="relative z-10 flex min-h-[100dvh] flex-col px-5 py-6">
        <div className="flex items-center justify-between">
          <BrandLogo light href="/" size="sm" />
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
            Table {String(tableNumber).padStart(2, "0")}
          </span>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25 backdrop-blur">
            <ChefHat className="h-10 w-10" />
          </div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
            #{orderNumber}
          </p>
          <h1 className="mt-2 max-w-xs text-2xl font-bold leading-snug">
            {statusHeadline(status)}
          </h1>

          <div className="mt-8 w-full max-w-sm rounded-[var(--radius-lg)] border border-white/20 bg-white/10 p-3 text-left backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-14 overflow-hidden rounded-[var(--radius-sm)]">
                <ProductImage src={firstImage} alt={firstItemName} fill sizes="56px" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{firstItemName}</p>
                <p className="text-xs text-white/70">Preparing with care</p>
              </div>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white transition-all duration-700"
                style={{ width: `${Math.max(18, progress)}%` }}
              />
            </div>
          </div>

          <Link
            href={`/track-order/${params.orderId}`}
            className="mt-6 text-sm font-semibold text-white underline-offset-4 hover:underline"
          >
            View Order Details →
          </Link>
        </div>

        <p className="pb-2 text-center text-sm text-white/75">
          {RESTAURANT.name} {RESTAURANT.footerTagline}
        </p>
      </div>
    </PageShell>
  );
}

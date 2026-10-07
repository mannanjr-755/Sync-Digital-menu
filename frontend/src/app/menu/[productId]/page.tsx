"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { PageShell } from "@/components/menu/PageShell";
import { ProductImage } from "@/components/menu/ProductImage";
import { QuantitySelector } from "@/components/menu/QuantitySelector";
import { PrimaryButton } from "@/components/menu/PrimaryButton";
import { TextArea } from "@/components/menu/FormField";
import { useCart } from "@/context/CartContext";
import {
  calcUnitPrice,
  formatOptionsLabel,
  getProduct,
} from "@/data/catalog";
import { formatMoney } from "@/lib/utils";

export default function ProductDetailPage() {
  const params = useParams<{ productId: string }>();
  const router = useRouter();
  const { addItem } = useCart();
  const product = getProduct(params.productId);

  const [sizeId, setSizeId] = useState(product?.sizes[0]?.id ?? "regular");
  const [milkId, setMilkId] = useState<string | null>(product?.milkOptions[0]?.id ?? null);
  const [addOnIds, setAddOnIds] = useState<string[]>([]);
  const [instructions, setInstructions] = useState("");
  const [qty, setQty] = useState(1);

  const unitPrice = useMemo(() => {
    if (!product) return 0;
    return calcUnitPrice(product, sizeId, milkId, addOnIds);
  }, [product, sizeId, milkId, addOnIds]);

  if (!product) {
    return (
      <PageShell>
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 p-6 text-center">
          <p className="text-sm text-[var(--text-muted)]">Product not found.</p>
          <Link href="/menu" className="text-sm font-semibold text-[var(--sync-blue)]">
            Back to menu
          </Link>
        </div>
      </PageShell>
    );
  }

  function toggleAddOn(id: string) {
    setAddOnIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function handleAdd() {
    addItem({
      productId: product!.id,
      name: product!.name,
      image: product!.image,
      sizeId,
      milkId,
      addOnIds,
      specialInstructions: instructions.trim(),
      optionsLabel: formatOptionsLabel(product!, sizeId, milkId, addOnIds),
      unitPrice,
      quantity: qty,
    });
    router.push("/cart");
  }

  return (
    <PageShell className="flex flex-col bg-white">
      <div className="relative aspect-[5/4] w-full bg-[var(--bg-warm)]">
        <ProductImage src={product.image} alt={product.name} fill sizes="560px" priority />
        <Link
          href="/menu"
          className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </Link>
      </div>

      <div className="flex-1 space-y-5 px-4 pb-28 pt-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">{product.name}</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">{product.description}</p>
          <p className="mt-2 text-base font-bold text-[var(--sync-blue)]">
            {formatMoney(product.basePrice)}
          </p>
        </div>

        {product.sizes.length > 1 && (
          <section>
            <h2 className="mb-2 text-sm font-semibold text-[var(--text)]">Size</h2>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => {
                const active = size.id === sizeId;
                return (
                  <button
                    key={size.id}
                    type="button"
                    onClick={() => setSizeId(size.id)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      active
                        ? "bg-[var(--sync-blue)] text-white"
                        : "border border-[var(--border)] bg-white text-[var(--text-muted)]"
                    }`}
                  >
                    {size.label}
                    {size.priceAdj > 0 ? ` (+${formatMoney(size.priceAdj)})` : ""}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {product.milkOptions.length > 0 && (
          <section>
            <h2 className="mb-2 text-sm font-semibold text-[var(--text)]">Milk</h2>
            <div className="space-y-2">
              {product.milkOptions.map((milk) => {
                const active = milk.id === milkId;
                return (
                  <button
                    key={milk.id}
                    type="button"
                    onClick={() => setMilkId(milk.id)}
                    className={`flex w-full items-center justify-between rounded-[var(--radius-md)] border px-3.5 py-3 text-left text-sm transition ${
                      active
                        ? "border-[var(--sync-blue)] bg-[var(--sync-blue-soft)] text-[var(--sync-blue)]"
                        : "border-[var(--border)] bg-white text-[var(--text)]"
                    }`}
                  >
                    <span className="font-medium">
                      {milk.label}
                      {milk.priceAdj > 0 ? ` (+${formatMoney(milk.priceAdj)})` : ""}
                    </span>
                    {active && <Check className="h-4 w-4" />}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {product.addOns.length > 0 && (
          <section>
            <h2 className="mb-2 text-sm font-semibold text-[var(--text)]">Add-ons</h2>
            <div className="space-y-2">
              {product.addOns.map((addOn) => {
                const active = addOnIds.includes(addOn.id);
                return (
                  <button
                    key={addOn.id}
                    type="button"
                    onClick={() => toggleAddOn(addOn.id)}
                    className={`flex w-full items-center gap-3 rounded-[var(--radius-md)] border px-3.5 py-3 text-left text-sm transition ${
                      active
                        ? "border-[var(--sync-blue)] bg-[var(--sync-blue-soft)]"
                        : "border-[var(--border)] bg-white"
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded border ${
                        active
                          ? "border-[var(--sync-blue)] bg-[var(--sync-blue)] text-white"
                          : "border-[var(--border-strong)]"
                      }`}
                    >
                      {active && <Check className="h-3 w-3" />}
                    </span>
                    <span className="flex-1 font-medium text-[var(--text)]">{addOn.label}</span>
                    <span className="text-[var(--text-muted)]">+{formatMoney(addOn.priceAdj)}</span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        <section>
          <h2 className="mb-2 text-sm font-semibold text-[var(--text)]">Special instructions</h2>
          <TextArea
            rows={3}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Anything we should know?"
            maxLength={500}
          />
        </section>
      </div>

      <div className="sticky bottom-0 border-t border-[var(--border)] bg-white/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <QuantitySelector value={qty} onChange={setQty} />
          <PrimaryButton onClick={handleAdd} className="flex-1">
            Add to Cart — {formatMoney(unitPrice * qty)}
          </PrimaryButton>
        </div>
      </div>
    </PageShell>
  );
}

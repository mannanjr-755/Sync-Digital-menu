"use client";

import { Minus, Plus } from "lucide-react";

type Props = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
};

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
}: Props) {
  const btn =
    size === "sm"
      ? "h-8 w-8 text-sm"
      : "h-10 w-10 text-base";

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-white p-0.5">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className={`inline-flex items-center justify-center rounded-full text-[var(--sync-blue)] transition hover:bg-[var(--sync-blue-soft)] disabled:opacity-40 ${btn}`}
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="min-w-8 text-center text-sm font-semibold tabular-nums">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className={`inline-flex items-center justify-center rounded-full text-[var(--sync-blue)] transition hover:bg-[var(--sync-blue-soft)] disabled:opacity-40 ${btn}`}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

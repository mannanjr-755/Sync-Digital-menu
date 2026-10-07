type Props = {
  tableNumber: number;
  light?: boolean;
};

export function TableBadge({ tableNumber, light }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${
        light
          ? "bg-white/20 text-white"
          : "bg-[var(--sync-blue-soft)] text-[var(--sync-blue)]"
      }`}
    >
      Table {String(tableNumber).padStart(2, "0")}
    </span>
  );
}

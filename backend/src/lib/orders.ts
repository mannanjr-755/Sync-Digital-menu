import { prisma } from "./prisma";

/** Generate next order number for a restaurant, e.g. BH-0001 */
export async function generateOrderNumber(restaurantId: string, slug: string): Promise<string> {
  const prefix =
    slug.toLowerCase() === "sync"
      ? "SNC"
      : slug
          .split("-")
          .map((p) => p[0]?.toUpperCase() ?? "")
          .join("")
          .slice(0, 3) || "ORD";

  // Use max existing number + 1 (not count + 1). Count breaks after deletions
  // or gaps and collides with @@unique([restaurantId, orderNumber]).
  const latest = await prisma.order.findFirst({
    where: {
      restaurantId,
      orderNumber: { startsWith: `${prefix}-` },
    },
    orderBy: { orderNumber: "desc" },
    select: { orderNumber: true },
  });

  let next = 1;
  if (latest?.orderNumber) {
    const numericPart = latest.orderNumber.slice(prefix.length + 1);
    const parsed = Number.parseInt(numericPart, 10);
    if (Number.isFinite(parsed)) next = parsed + 1;
  }

  return `${prefix}-${String(next).padStart(4, "0")}`;
}

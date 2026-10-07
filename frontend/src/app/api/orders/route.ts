import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@backend/lib/prisma";
import { generateOrderNumber } from "@backend/lib/orders";

const catalogItemSchema = z.object({
  productId: z.string().min(1),
  itemName: z.string().trim().min(1).max(120),
  unitPrice: z.number().positive(),
  quantity: z.number().int().positive().max(99),
  selectedOptions: z.string().max(2000).optional().nullable(),
});

const menuItemSchema = z.object({
  menuItemId: z.string().min(1),
  quantity: z.number().int().positive().max(99),
});

const placeOrderSchema = z.object({
  restaurantSlug: z.string().min(1),
  tableNumber: z.coerce.number().int().positive(),
  customerName: z.string().trim().min(1).max(100),
  customerPhone: z.string().trim().max(30).optional().nullable(),
  customerEmail: z
    .string()
    .trim()
    .max(120)
    .optional()
    .nullable()
    .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
      message: "Invalid email",
    }),
  specialRequest: z.string().trim().max(500).optional().nullable(),
  orderType: z.enum(["DINE_IN", "TAKE_AWAY"]).optional().default("DINE_IN"),
  paymentMethod: z.string().trim().max(40).optional().nullable(),
  items: z.array(z.union([menuItemSchema, catalogItemSchema])).min(1),
});

function isCatalogItem(
  item: z.infer<typeof menuItemSchema> | z.infer<typeof catalogItemSchema>
): item is z.infer<typeof catalogItemSchema> {
  return "productId" in item && "itemName" in item && "unitPrice" in item;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const parsed = placeOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid order data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      restaurantSlug,
      tableNumber,
      customerName,
      customerPhone,
      customerEmail,
      specialRequest,
      orderType,
      paymentMethod,
      items,
    } = parsed.data;

    const restaurant = await prisma.restaurant.findUnique({
      where: { slug: restaurantSlug },
    });

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    const table = await prisma.table.findUnique({
      where: {
        restaurantId_tableNumber: {
          restaurantId: restaurant.id,
          tableNumber,
        },
      },
    });

    if (!table || !table.active) {
      return NextResponse.json({ error: "Table not found or inactive" }, { status: 404 });
    }

    const menuItemsPayload = items.filter(
      (i): i is z.infer<typeof menuItemSchema> => !isCatalogItem(i)
    );
    const catalogItemsPayload = items.filter(isCatalogItem);

    const menuItemIds = menuItemsPayload.map((i) => i.menuItemId);
    const menuItems =
      menuItemIds.length > 0
        ? await prisma.menuItem.findMany({
            where: {
              id: { in: menuItemIds },
              restaurantId: restaurant.id,
              available: true,
            },
          })
        : [];

    if (menuItems.length !== menuItemIds.length) {
      return NextResponse.json(
        { error: "One or more items are unavailable or invalid" },
        { status: 400 }
      );
    }

    const menuById = new Map(menuItems.map((m) => [m.id, m]));
    let total = 0;
    const orderItemsData = [
      ...menuItemsPayload.map((item) => {
        const menuItem = menuById.get(item.menuItemId)!;
        const subtotal = menuItem.price * item.quantity;
        total += subtotal;
        return {
          menuItemId: menuItem.id,
          itemName: menuItem.name,
          quantity: item.quantity,
          unitPrice: menuItem.price,
          subtotal,
          selectedOptions: null as string | null,
        };
      }),
      ...catalogItemsPayload.map((item) => {
        const subtotal = item.unitPrice * item.quantity;
        total += subtotal;
        return {
          menuItemId: null as string | null,
          itemName: item.itemName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal,
          selectedOptions: item.selectedOptions ?? null,
        };
      }),
    ];

    const orderNumber = await generateOrderNumber(restaurant.id, restaurant.slug);
    const paymentNote = paymentMethod ? `Payment: ${paymentMethod}` : null;
    const combinedRequest = [paymentNote, specialRequest?.trim()]
      .filter(Boolean)
      .join(" · ");

    const order = await prisma.order.create({
      data: {
        restaurantId: restaurant.id,
        tableId: table.id,
        orderNumber,
        customerName,
        customerPhone: customerPhone || null,
        customerEmail: customerEmail || null,
        specialRequest: combinedRequest || null,
        orderType: orderType || "DINE_IN",
        status: "NEW",
        total,
        items: { create: orderItemsData },
      },
      include: {
        items: true,
        table: true,
        restaurant: { select: { name: true, slug: true } },
      },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Place order error:", error);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { RESTAURANT } from "@/data/catalog";
import type { CartItem, CheckoutDraft, PlacedOrderSnapshot } from "@/lib/cart-types";

const CART_KEY = "sync-digital-cart-v1";
const TABLE_KEY = "sync-digital-table-v1";
const ORDER_KEY = "sync-digital-last-order-v1";

type CartContextValue = {
  items: CartItem[];
  tableNumber: number;
  setTableNumber: (n: number) => void;
  itemCount: number;
  subtotal: number;
  tax: number;
  total: number;
  addItem: (item: Omit<CartItem, "key">) => void;
  updateQty: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  lastOrder: PlacedOrderSnapshot | null;
  setLastOrder: (order: PlacedOrderSnapshot | null) => void;
  checkoutDefaults: CheckoutDraft;
};

const CartContext = createContext<CartContextValue | null>(null);

function makeKey(item: Omit<CartItem, "key">): string {
  return [
    item.productId,
    item.sizeId,
    item.milkId ?? "",
    [...item.addOnIds].sort().join(","),
    item.specialInstructions.trim(),
  ].join("|");
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [tableNumber, setTableNumberState] = useState<number>(RESTAURANT.defaultTable);
  const [lastOrder, setLastOrderState] = useState<PlacedOrderSnapshot | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
      const table = Number(localStorage.getItem(TABLE_KEY));
      if (Number.isInteger(table) && table > 0) setTableNumberState(table);
      const orderRaw = localStorage.getItem(ORDER_KEY);
      if (orderRaw) setLastOrderState(JSON.parse(orderRaw) as PlacedOrderSnapshot);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(TABLE_KEY, String(tableNumber));
  }, [tableNumber, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (lastOrder) localStorage.setItem(ORDER_KEY, JSON.stringify(lastOrder));
    else localStorage.removeItem(ORDER_KEY);
  }, [lastOrder, hydrated]);

  const setTableNumber = useCallback((n: number) => {
    if (Number.isInteger(n) && n > 0) setTableNumberState(n);
  }, []);

  const addItem = useCallback((item: Omit<CartItem, "key">) => {
    const key = makeKey(item);
    setItems((prev) => {
      const existing = prev.find((p) => p.key === key);
      if (existing) {
        return prev.map((p) =>
          p.key === key ? { ...p, quantity: Math.min(99, p.quantity + item.quantity) } : p
        );
      }
      return [...prev, { ...item, key }];
    });
  }, []);

  const updateQty = useCallback((key: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) return prev.filter((p) => p.key !== key);
      return prev.map((p) => (p.key === key ? { ...p, quantity: Math.min(99, quantity) } : p));
    });
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((p) => p.key !== key));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const setLastOrder = useCallback((order: PlacedOrderSnapshot | null) => {
    setLastOrderState(order);
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    [items]
  );
  const tax = useMemo(() => Math.round(subtotal * RESTAURANT.taxRate), [subtotal]);
  const total = subtotal + tax;
  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  const value: CartContextValue = {
    items,
    tableNumber,
    setTableNumber,
    itemCount,
    subtotal,
    tax,
    total,
    addItem,
    updateQty,
    removeItem,
    clearCart,
    lastOrder,
    setLastOrder,
    checkoutDefaults: {
      customerName: "",
      customerPhone: "",
      orderType: "DINE_IN",
      tableNumber,
      paymentMethod: "counter",
    },
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

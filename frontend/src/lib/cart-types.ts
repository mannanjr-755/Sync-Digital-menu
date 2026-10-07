export type CartItem = {
  key: string;
  productId: string;
  name: string;
  image: string;
  sizeId: string;
  milkId: string | null;
  addOnIds: string[];
  specialInstructions: string;
  optionsLabel: string;
  unitPrice: number;
  quantity: number;
};

export type CheckoutDraft = {
  customerName: string;
  customerPhone: string;
  orderType: "DINE_IN" | "TAKE_AWAY";
  tableNumber: number;
  paymentMethod: "counter" | "cash" | "card" | "digital";
};

export type PlacedOrderSnapshot = {
  id: string;
  orderNumber: string;
  tableNumber: number;
  orderType: string;
  paymentMethod: string;
  customerName: string;
  customerPhone: string;
  items: Array<{
    name: string;
    image: string;
    optionsLabel: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  createdAt: string;
};

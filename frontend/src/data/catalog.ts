/** Centralized Sync cafe catalog — single source for products & images */

export type MoneyOption = {
  id: string;
  label: string;
  priceAdj: number;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  image: string;
  basePrice: number;
  featured?: boolean;
  sizes: MoneyOption[];
  milkOptions: MoneyOption[];
  addOns: MoneyOption[];
};

export type Category = {
  id: string;
  name: string;
  icon: "coffee" | "iced" | "noncoffee" | "tea" | "food" | "dessert";
};

export const RESTAURANT = {
  name: "Sync.",
  slug: "sync",
  tagline: "Great coffee. Fresh bites. Good company.",
  footerTagline: "Good food. Good vibes.",
  defaultTable: 7,
  taxRate: 0.1,
  prepMinutes: { min: 15, max: 25 },
} as const;

export const IMAGES = {
  hero:
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&h=900&fit=crop",
  cafeInterior:
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&h=800&fit=crop",
  kitchen:
    "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1400&h=900&fit=crop",
  signature:
    "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&h=800&fit=crop",
  icedLatte:
    "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800&h=800&fit=crop",
  espresso:
    "https://images.unsplash.com/photo-1510591509098-f81357e1fa45?w=800&h=800&fit=crop",
  americano:
    "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&h=800&fit=crop",
  cappuccino:
    "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&h=800&fit=crop",
  latte:
    "https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=800&h=800&fit=crop",
  mocha:
    "https://images.unsplash.com/photo-1578374173705-969cbe6f2d4b?w=800&h=800&fit=crop",
  icedAmericano:
    "https://images.unsplash.com/photo-1517701604599-bb87e4daab18?w=800&h=800&fit=crop",
  matcha:
    "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=800&h=800&fit=crop",
  chai:
    "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800&h=800&fit=crop",
  greenTea:
    "https://images.unsplash.com/photo-1556881286-fc6915169721?w=800&h=800&fit=crop",
  panini:
    "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&h=800&fit=crop",
  croissant:
    "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&h=800&fit=crop",
  brownie:
    "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=800&fit=crop",
  cheesecake:
    "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&h=800&fit=crop",
  lemonade:
    "https://images.unsplash.com/photo-1621263764926-9b8aaeb510d2?w=800&h=800&fit=crop",
} as const;

const SIZES: MoneyOption[] = [
  { id: "regular", label: "Regular", priceAdj: 0 },
  { id: "large", label: "Large", priceAdj: 100 },
];

const MILK: MoneyOption[] = [
  { id: "full", label: "Full Cream", priceAdj: 0 },
  { id: "lowfat", label: "Low Fat", priceAdj: 0 },
  { id: "oat", label: "Oat Milk", priceAdj: 200 },
];

const ADDONS: MoneyOption[] = [
  { id: "extra-shot", label: "Extra Shot", priceAdj: 150 },
  { id: "vanilla", label: "Vanilla", priceAdj: 100 },
  { id: "caramel", label: "Caramel", priceAdj: 100 },
];

const NO_SIZE: MoneyOption[] = [{ id: "regular", label: "Regular", priceAdj: 0 }];
const NO_MILK: MoneyOption[] = [];
const NO_ADDONS: MoneyOption[] = [];

export const CATEGORIES: Category[] = [
  { id: "coffee", name: "Coffee", icon: "coffee" },
  { id: "iced-coffee", name: "Iced Coffee", icon: "iced" },
  { id: "non-coffee", name: "Non-Coffee", icon: "noncoffee" },
  { id: "tea", name: "Tea", icon: "tea" },
  { id: "food", name: "Food", icon: "food" },
  { id: "desserts", name: "Desserts", icon: "dessert" },
];

export const PRODUCTS: Product[] = [
  {
    id: "espresso",
    name: "Espresso",
    description: "Rich, bold single origin shot",
    categoryId: "coffee",
    image: IMAGES.espresso,
    basePrice: 350,
    sizes: SIZES,
    milkOptions: NO_MILK,
    addOns: [{ id: "extra-shot", label: "Extra Shot", priceAdj: 150 }],
  },
  {
    id: "americano",
    name: "Americano",
    description: "Espresso with hot water, smooth & clean",
    categoryId: "coffee",
    image: IMAGES.americano,
    basePrice: 400,
    sizes: SIZES,
    milkOptions: NO_MILK,
    addOns: ADDONS,
  },
  {
    id: "cappuccino",
    name: "Cappuccino",
    description: "Espresso, steamed milk & velvety foam",
    categoryId: "coffee",
    image: IMAGES.cappuccino,
    basePrice: 500,
    sizes: SIZES,
    milkOptions: MILK,
    addOns: ADDONS,
  },
  {
    id: "latte",
    name: "Latte",
    description: "Silky espresso with steamed milk",
    categoryId: "coffee",
    image: IMAGES.latte,
    basePrice: 550,
    sizes: SIZES,
    milkOptions: MILK,
    addOns: ADDONS,
  },
  {
    id: "mocha",
    name: "Mocha",
    description: "Chocolate, espresso & steamed milk",
    categoryId: "coffee",
    image: IMAGES.mocha,
    basePrice: 600,
    sizes: SIZES,
    milkOptions: MILK,
    addOns: ADDONS,
  },
  {
    id: "iced-spanish-latte",
    name: "Iced Spanish Latte",
    description: "Sweet condensed milk iced latte — our signature",
    categoryId: "iced-coffee",
    image: IMAGES.signature,
    basePrice: 650,
    featured: true,
    sizes: SIZES,
    milkOptions: MILK,
    addOns: ADDONS,
  },
  {
    id: "iced-latte",
    name: "Iced Latte",
    description: "Chilled espresso over ice with milk",
    categoryId: "iced-coffee",
    image: IMAGES.icedLatte,
    basePrice: 600,
    sizes: SIZES,
    milkOptions: MILK,
    addOns: ADDONS,
  },
  {
    id: "iced-americano",
    name: "Iced Americano",
    description: "Refreshing espresso over ice",
    categoryId: "iced-coffee",
    image: IMAGES.icedAmericano,
    basePrice: 450,
    sizes: SIZES,
    milkOptions: NO_MILK,
    addOns: ADDONS,
  },
  {
    id: "matcha-latte",
    name: "Matcha Latte",
    description: "Ceremonial matcha with steamed milk",
    categoryId: "non-coffee",
    image: IMAGES.matcha,
    basePrice: 650,
    sizes: SIZES,
    milkOptions: MILK,
    addOns: [
      { id: "vanilla", label: "Vanilla", priceAdj: 100 },
      { id: "extra-shot", label: "Extra Matcha", priceAdj: 150 },
    ],
  },
  {
    id: "lemonade",
    name: "Fresh Lemonade",
    description: "House-squeezed citrus cooler",
    categoryId: "non-coffee",
    image: IMAGES.lemonade,
    basePrice: 400,
    sizes: SIZES,
    milkOptions: NO_MILK,
    addOns: NO_ADDONS,
  },
  {
    id: "chai-latte",
    name: "Chai Latte",
    description: "Spiced chai with steamed milk",
    categoryId: "tea",
    image: IMAGES.chai,
    basePrice: 500,
    sizes: SIZES,
    milkOptions: MILK,
    addOns: [{ id: "vanilla", label: "Vanilla", priceAdj: 100 }],
  },
  {
    id: "green-tea",
    name: "Green Tea",
    description: "Light & fragrant sencha",
    categoryId: "tea",
    image: IMAGES.greenTea,
    basePrice: 350,
    sizes: NO_SIZE,
    milkOptions: NO_MILK,
    addOns: NO_ADDONS,
  },
  {
    id: "chicken-panini",
    name: "Chicken Panini",
    description: "Grilled chicken, cheese & herbs on ciabatta",
    categoryId: "food",
    image: IMAGES.panini,
    basePrice: 850,
    sizes: NO_SIZE,
    milkOptions: NO_MILK,
    addOns: [{ id: "extra-cheese", label: "Extra Cheese", priceAdj: 100 }],
  },
  {
    id: "butter-croissant",
    name: "Butter Croissant",
    description: "Flaky, golden, baked fresh daily",
    categoryId: "food",
    image: IMAGES.croissant,
    basePrice: 450,
    sizes: NO_SIZE,
    milkOptions: NO_MILK,
    addOns: NO_ADDONS,
  },
  {
    id: "chocolate-brownie",
    name: "Chocolate Brownie",
    description: "Fudgy dark chocolate square",
    categoryId: "desserts",
    image: IMAGES.brownie,
    basePrice: 500,
    sizes: NO_SIZE,
    milkOptions: NO_MILK,
    addOns: NO_ADDONS,
  },
  {
    id: "cheesecake",
    name: "Cheesecake Slice",
    description: "Creamy New York style",
    categoryId: "desserts",
    image: IMAGES.cheesecake,
    basePrice: 650,
    sizes: NO_SIZE,
    milkOptions: NO_MILK,
    addOns: NO_ADDONS,
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return PRODUCTS.filter((p) => p.categoryId === categoryId);
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter((p) => p.featured);
}

export function calcUnitPrice(
  product: Product,
  sizeId: string,
  milkId: string | null,
  addOnIds: string[]
): number {
  const size = product.sizes.find((s) => s.id === sizeId)?.priceAdj ?? 0;
  const milk = product.milkOptions.find((m) => m.id === milkId)?.priceAdj ?? 0;
  const addOns = product.addOns
    .filter((a) => addOnIds.includes(a.id))
    .reduce((sum, a) => sum + a.priceAdj, 0);
  return product.basePrice + size + milk + addOns;
}

export function formatOptionsLabel(
  product: Product,
  sizeId: string,
  milkId: string | null,
  addOnIds: string[]
): string {
  const parts: string[] = [];
  const size = product.sizes.find((s) => s.id === sizeId);
  if (size && product.sizes.length > 1) parts.push(size.label);
  const milk = product.milkOptions.find((m) => m.id === milkId);
  if (milk) parts.push(milk.label);
  for (const id of addOnIds) {
    const addOn = product.addOns.find((a) => a.id === id);
    if (addOn) parts.push(addOn.label);
  }
  return parts.join(" • ");
}

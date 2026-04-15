import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function generateOrderNumber(): string {
  const now = new Date();
  const datePart = now.toISOString().slice(2, 10).replace(/-/g, "");
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${datePart}-${randomPart}`;
}

export interface ChangeBreakdown {
  denomination: number;
  count: number;
}

/**
 * Calculates the change breakdown using a greedy algorithm.
 * @param amountPaid The amount given by the customer (in the same units as total)
 * @param total The total cost of the order
 * @param denominations Available bill/coin denominations (defaults to IDR units)
 */
export function calculateChangeGreedy(
  amountPaid: number,
  total: number,
  denominations: number[] = [100000, 50000, 20000, 10000, 5000, 2000, 1000, 500, 200, 100]
): ChangeBreakdown[] {
  let change = amountPaid - total;
  if (change <= 0) return [];

  const breakdown: ChangeBreakdown[] = [];
  
  // Sort denominations descending just in case
  const sortedDenoms = [...denominations].sort((a, b) => b - a);

  for (const denom of sortedDenoms) {
    if (change >= denom) {
      const count = Math.floor(change / denom);
      breakdown.push({ denomination: denom, count });
      change %= denom;
    }
  }

  return breakdown;
}

export interface MenuItemLight {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  imageUrl: string | null;
}

/**
 * Returns all menu items whose price is within the given budget,
 * sorted from highest to lowest price (Greedy: best value first).
 * @param budgetCents Budget in the same unit as item.price (cents)
 * @param menuItems   Array of available menu items
 */
export function recommendMenuGreedy(
  budgetCents: number,
  menuItems: MenuItemLight[]
): MenuItemLight[] {
  // Greedy Preparation: sort highest price first
  const sorted = [...menuItems].sort((a, b) => b.price - a.price);

  // Greedy Choice: include every item whose price fits within the budget
  return sorted.filter((item) => item.price <= budgetCents);
}

"use client";

import { useState } from "react";
import { CategoryTabs } from "./category-tabs";
import { MenuGrid } from "./menu-grid";
import { Cart } from "./cart";
import { createOrder, type CartItem } from "@/actions/orders";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { printReceipt } from "@/lib/print-receipt";

type Props = {
  categories: Array<{ id: number; name: string }>;
  menuItems: Array<{
    id: number;
    name: string;
    price: number;
    categoryId: number;
    imageUrl: string | null;
  }>;
};

export function POSScreen({ categories, menuItems }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const filteredItems = selectedCategory
    ? menuItems.filter((item) => item.categoryId === selectedCategory)
    : menuItems;

  function addToCart(item: { id: number; name: string; price: number }) {
    setCart((prev) => {
      const existing = prev.find((ci) => ci.menuItemId === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.menuItemId === item.id
            ? { ...ci, quantity: ci.quantity + 1 }
            : ci
        );
      }
      return [
        ...prev,
        {
          menuItemId: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
        },
      ];
    });
  }

  function updateQuantity(menuItemId: number, quantity: number) {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((ci) => ci.menuItemId !== menuItemId));
    } else {
      setCart((prev) =>
        prev.map((ci) =>
          ci.menuItemId === menuItemId ? { ...ci, quantity } : ci
        )
      );
    }
  }

  function clearCart() {
    setCart([]);
  }

  async function handlePlaceOrder() {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    const itemsSnapshot = [...cart];
    try {
      const result = await createOrder(cart);
      toast.success(`Order ${result.orderNumber} placed!`);
      clearCart();
      router.refresh();

      printReceipt({
        orderNumber: result.orderNumber,
        items: itemsSnapshot.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity,
        })),
        total: itemsSnapshot.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
        date: new Date(),
      });
    } catch {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Left Panel - Menu */}
      <div className="flex flex-1 flex-col space-y-4 overflow-hidden">
        <CategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <div className="flex-1 overflow-y-auto">
          <MenuGrid items={filteredItems} onAddToCart={addToCart} />
        </div>
      </div>

      {/* Right Panel - Cart */}
      <div className="w-80 shrink-0 lg:w-96">
        <Cart
          items={cart}
          onUpdateQuantity={updateQuantity}
          onClear={clearCart}
          onPlaceOrder={handlePlaceOrder}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { CategoryTabs } from "./category-tabs";
import { MenuGrid } from "./menu-grid";
import { Cart } from "./cart";
import { PaymentDialog } from "./payment-dialog";
import { createOrder, type CartItem } from "@/actions/orders";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { printReceipt } from "@/lib/print-receipt";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Sparkles } from "lucide-react";
import { BudgetRecommendationDialog } from "./budget-recommendation-dialog";
import type { MenuItemLight } from "@/lib/utils";

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
  const [cartOpen, setCartOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isRecommendationOpen, setIsRecommendationOpen] = useState(false);
  const router = useRouter();

  const filteredItems = selectedCategory
    ? menuItems.filter((item) => item.categoryId === selectedCategory)
    : menuItems;

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

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

  function handlePlaceOrder() {
    if (cart.length === 0) return;
    setIsPaymentOpen(true);
  }

  async function handleFinalizeOrder() {
    setIsSubmitting(true);
    const itemsSnapshot = [...cart];
    try {
      const result = await createOrder(cart);
      toast.success(`Order ${result.orderNumber} placed!`);
      clearCart();
      setCartOpen(false);
      setIsPaymentOpen(false);
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

  function handleAcceptRecommendation(items: MenuItemLight[]) {
    items.forEach(item => addToCart({ id: item.id, name: item.name, price: item.price }));
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] md:h-[calc(100vh-8rem)] gap-4 md:gap-6 animate-fade-in">
      {/* Left Panel - Menu */}
      <div className="flex flex-1 flex-col space-y-3 md:space-y-4 overflow-hidden">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <div className="flex-1">
            <CategoryTabs
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
          <Button 
            variant="outline" 
            onClick={() => setIsRecommendationOpen(true)}
            className="hidden md:flex shrink-0 gap-2 border-primary/20 text-primary hover:bg-primary/10 rounded-xl"
          >
            <Sparkles className="h-4 w-4 fill-primary/20" />
            Budget Rekomen
          </Button>
        </div>
        <div className="md:hidden">
            <Button 
              variant="outline" 
              onClick={() => setIsRecommendationOpen(true)}
              className="w-full gap-2 border-primary/20 text-primary hover:bg-primary/10 rounded-xl shadow-sm bg-primary/5"
            >
              <Sparkles className="h-4 w-4 fill-primary/20" />
              Rekomendasi Berdasarkan Budget
            </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <MenuGrid items={filteredItems} onAddToCart={addToCart} />
        </div>
      </div>

      {/* Right Panel - Cart (Desktop) */}
      <div className="hidden lg:block w-80 shrink-0 xl:w-96">
        <Cart
          items={cart}
          onUpdateQuantity={updateQuantity}
          onClear={clearCart}
          onPlaceOrder={handlePlaceOrder}
          isSubmitting={isSubmitting}
        />
      </div>

      {/* Mobile Cart FAB */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <Sheet open={cartOpen} onOpenChange={setCartOpen}>
          <SheetTrigger asChild>
            <Button
              size="lg"
              className="h-14 w-14 rounded-full shadow-lg gradient-primary relative"
            >
              <ShoppingCart className="h-5 w-5 text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl p-0">
            <SheetTitle className="sr-only">Shopping Cart</SheetTitle>
            <div className="h-full p-4 overflow-y-auto">
              <Cart
                items={cart}
                onUpdateQuantity={updateQuantity}
                onClear={clearCart}
                onPlaceOrder={handlePlaceOrder}
                isSubmitting={isSubmitting}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <PaymentDialog
        open={isPaymentOpen}
        onOpenChange={setIsPaymentOpen}
        total={cartTotal}
        onConfirm={handleFinalizeOrder}
        isSubmitting={isSubmitting}
      />
      
      <BudgetRecommendationDialog
        open={isRecommendationOpen}
        onOpenChange={setIsRecommendationOpen}
        menuItems={menuItems}
        onAcceptRecommendation={handleAcceptRecommendation}
      />
    </div>
  );
}

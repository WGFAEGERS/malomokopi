"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import type { CartItem } from "@/actions/orders";

type Props = {
  items: CartItem[];
  onUpdateQuantity: (menuItemId: number, quantity: number) => void;
  onClear: () => void;
  onPlaceOrder: () => void;
  isSubmitting: boolean;
};

export function Cart({
  items,
  onUpdateQuantity,
  onClear,
  onPlaceOrder,
  isSubmitting,
}: Props) {
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="flex h-full flex-col rounded-xl border-0 bg-card shadow-sm">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-primary" />
          <h2 className="font-semibold">Current Order</h2>
        </div>
        {items.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs font-medium text-muted-foreground hover:text-destructive transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <ShoppingBag className="h-10 w-10 mb-3 opacity-20" />
            <p className="text-sm">Tap items to add to order</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.menuItemId}
                className="flex items-center gap-3 rounded-lg bg-muted/50 p-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatPrice(item.price)} each
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      onUpdateQuantity(item.menuItemId, item.quantity - 1)
                    }
                    className="flex h-7 w-7 items-center justify-center rounded-md border bg-background text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.quantity === 1 ? (
                      <Trash2 className="h-3 w-3" />
                    ) : (
                      <Minus className="h-3 w-3" />
                    )}
                  </button>
                  <span className="w-8 text-center text-sm font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      onUpdateQuantity(item.menuItemId, item.quantity + 1)
                    }
                    className="flex h-7 w-7 items-center justify-center rounded-md border bg-background text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <span className="w-16 text-right text-sm font-semibold">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t bg-muted/30 p-5 space-y-4 rounded-b-xl">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="text-2xl font-bold tracking-tight">{formatPrice(total)}</span>
        </div>
        <Button
          className="w-full h-12 text-sm font-semibold shadow-sm"
          size="lg"
          onClick={onPlaceOrder}
          disabled={items.length === 0 || isSubmitting}
        >
          {isSubmitting ? "Placing Order..." : `Place Order \u2014 ${formatPrice(total)}`}
        </Button>
      </div>
    </div>
  );
}

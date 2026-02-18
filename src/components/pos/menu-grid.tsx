"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { Plus } from "lucide-react";

type MenuItem = {
  id: number;
  name: string;
  price: number;
  imageUrl: string | null;
};

type Props = {
  items: MenuItem[];
  onAddToCart: (item: { id: number; name: string; price: number }) => void;
};

export function MenuGrid({ items, onAddToCart }: Props) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-sm">No items available in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <Card
          key={item.id}
          className="group cursor-pointer border-0 shadow-sm card-hover active:scale-[0.97]"
          onClick={() => onAddToCart(item)}
        >
          <CardContent className="relative p-3 sm:p-4">
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="mb-2 sm:mb-3 h-20 sm:h-24 w-full rounded-xl object-cover"
              />
            )}
            {!item.imageUrl && (
              <div className="mb-2 sm:mb-3 flex h-20 sm:h-24 w-full items-center justify-center rounded-xl gradient-warm/10 bg-gradient-to-br from-primary/5 to-primary/10">
                <span className="text-2xl font-bold text-primary/40">
                  {item.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <p className="text-xs sm:text-sm font-semibold leading-tight truncate">{item.name}</p>
            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm font-medium text-primary">
              {formatPrice(item.price)}
            </p>
            <div className="absolute right-2 top-2 sm:right-3 sm:top-3 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full gradient-primary text-white opacity-0 shadow-sm transition-all duration-200 group-hover:opacity-100 group-hover:scale-110">
              <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

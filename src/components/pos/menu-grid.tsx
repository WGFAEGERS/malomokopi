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
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <Card
          key={item.id}
          className="group cursor-pointer border-0 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]"
          onClick={() => onAddToCart(item)}
        >
          <CardContent className="relative p-4">
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="mb-3 h-24 w-full rounded-lg object-cover"
              />
            )}
            {!item.imageUrl && (
              <div className="mb-3 flex h-24 w-full items-center justify-center rounded-lg bg-gradient-to-br from-primary/5 to-primary/10">
                <span className="text-2xl">
                  {item.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <p className="text-sm font-semibold leading-tight">{item.name}</p>
            <p className="mt-1 text-sm font-medium text-primary">
              {formatPrice(item.price)}
            </p>
            <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
              <Plus className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

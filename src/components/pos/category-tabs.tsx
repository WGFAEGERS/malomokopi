"use client";

import { cn } from "@/lib/utils";

type Props = {
  categories: Array<{ id: number; name: string }>;
  selectedCategory: number | null;
  onSelectCategory: (id: number | null) => void;
};

export function CategoryTabs({
  categories,
  selectedCategory,
  onSelectCategory,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelectCategory(null)}
        className={cn(
          "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
          selectedCategory === null
            ? "bg-primary text-primary-foreground shadow-sm"
            : "bg-secondary text-secondary-foreground hover:bg-accent"
        )}
      >
        All Items
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelectCategory(cat.id)}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
            selectedCategory === cat.id
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary text-secondary-foreground hover:bg-accent"
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}

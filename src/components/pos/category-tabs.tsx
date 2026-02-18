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
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      <button
        onClick={() => onSelectCategory(null)}
        className={cn(
          "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200",
          selectedCategory === null
            ? "gradient-primary text-white shadow-md"
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
            "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200",
            selectedCategory === cat.id
              ? "gradient-primary text-white shadow-md"
              : "bg-secondary text-secondary-foreground hover:bg-accent"
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}

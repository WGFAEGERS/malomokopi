"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { CategoryForm } from "./category-form";
import { MenuItemForm } from "./menu-item-form";
import { deleteCategory } from "@/actions/categories";
import { deleteMenuItem, toggleMenuItemAvailability } from "@/actions/menu";
import { formatPrice } from "@/lib/utils";
import { Trash2 } from "lucide-react";

type Category = { id: number; name: string; createdAt: Date };
type MenuItem = {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  imageUrl: string | null;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
  category: Category;
};

type Props = {
  categories: Category[];
  menuItems: MenuItem[];
};

export function MenuManagement({ categories, menuItems }: Props) {
  const router = useRouter();

  async function handleDeleteCategory(id: number) {
    if (!confirm("Delete this category? Items in this category may be affected.")) return;
    await deleteCategory(id);
    router.refresh();
  }

  async function handleDeleteItem(id: number) {
    if (!confirm("Delete this menu item?")) return;
    await deleteMenuItem(id);
    router.refresh();
  }

  async function handleToggleAvailability(id: number, available: boolean) {
    await toggleMenuItemAvailability(id, available);
    router.refresh();
  }

  return (
    <div className="space-y-8">
      {/* Categories Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Categories</h2>
          <CategoryForm />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No categories yet. Create one to get started.
            </p>
          ) : (
            categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center gap-1 rounded-full border bg-secondary/50 px-4 py-1.5"
              >
                <span className="text-sm font-medium">{cat.name}</span>
                <CategoryForm category={cat} />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleDeleteCategory(cat.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      <Separator />

      {/* Menu Items Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Menu Items</h2>
          <MenuItemForm categories={categories} />
        </div>

        {menuItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No menu items yet. Add categories first, then create items.
          </p>
        ) : (
          <div className="rounded-xl border-0 shadow-sm bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menuItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {item.category?.name ?? "—"}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatPrice(item.price)}</TableCell>
                      <TableCell>
                        <Switch
                          checked={item.available}
                          onCheckedChange={(checked) =>
                            handleToggleAvailability(item.id, checked)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <MenuItemForm
                            categories={categories}
                            menuItem={item}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

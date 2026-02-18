"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createMenuItem, updateMenuItem } from "@/actions/menu";
import { menuItemSchema } from "@/lib/validators";
import { Plus, Pencil } from "lucide-react";

type Category = { id: number; name: string };

type MenuItem = {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  imageUrl: string | null;
  available: boolean;
};

type Props = {
  categories: Category[];
  menuItem?: MenuItem;
};

export function MenuItemForm({ categories, menuItem }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState(menuItem?.name ?? "");
  const [price, setPrice] = useState(
    menuItem ? (menuItem.price / 100).toFixed(2) : ""
  );
  const [categoryId, setCategoryId] = useState(
    menuItem?.categoryId?.toString() ?? ""
  );
  const [imageUrl, setImageUrl] = useState(menuItem?.imageUrl ?? "");
  const [available, setAvailable] = useState(menuItem?.available ?? true);

  const isEditing = !!menuItem;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const parsed = menuItemSchema.safeParse({
      name,
      price: parseFloat(price),
      categoryId: parseInt(categoryId),
      imageUrl,
      available,
    });

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      setError(Object.values(errors).flat().join(", "));
      setLoading(false);
      return;
    }

    if (isEditing) {
      await updateMenuItem(menuItem.id, parsed.data);
    } else {
      await createMenuItem(parsed.data);
    }

    setLoading(false);
    setOpen(false);
    if (!isEditing) {
      setName("");
      setPrice("");
      setCategoryId("");
      setImageUrl("");
      setAvailable(true);
    }
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Menu Item" : "Add Menu Item"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="item-name">Name</Label>
            <Input
              id="item-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cappuccino"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="item-price">Price (Rp)</Label>
            <Input
              id="item-price"
              type="number"
              step="0.01"
              min="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="4.50"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="item-image">Image URL (optional)</Label>
            <Input
              id="item-image"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="item-available">Available</Label>
            <Switch
              id="item-available"
              checked={available}
              onCheckedChange={setAvailable}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Saving..." : isEditing ? "Update" : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

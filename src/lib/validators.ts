import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(50),
});

export const menuItemSchema = z.object({
  name: z.string().min(1, "Item name is required").max(100),
  price: z.coerce
    .number()
    .min(0.01, "Price must be greater than 0")
    .transform((val) => Math.round(val * 100)),
  categoryId: z.coerce.number().min(1, "Category is required"),
  imageUrl: z.string().optional().default(""),
  available: z.boolean().default(true),
});

export type CategoryFormValues = z.input<typeof categorySchema>;
export type MenuItemFormValues = z.input<typeof menuItemSchema>;

"use server";

import { db } from "@/db";
import { menuItems } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getMenuItems() {
  return db.query.menuItems.findMany({
    with: { category: true },
    orderBy: [asc(menuItems.name)],
  });
}

export async function createMenuItem(data: {
  name: string;
  price: number;
  categoryId: number;
  imageUrl?: string;
  available?: boolean;
}) {
  await db.insert(menuItems).values({
    name: data.name,
    price: data.price,
    categoryId: data.categoryId,
    imageUrl: data.imageUrl || null,
    available: data.available ?? true,
  });
  revalidatePath("/menu");
  revalidatePath("/pos");
  return { success: true };
}

export async function updateMenuItem(
  id: number,
  data: {
    name?: string;
    price?: number;
    categoryId?: number;
    imageUrl?: string;
    available?: boolean;
  }
) {
  await db
    .update(menuItems)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(menuItems.id, id));
  revalidatePath("/menu");
  revalidatePath("/pos");
  return { success: true };
}

export async function deleteMenuItem(id: number) {
  await db.delete(menuItems).where(eq(menuItems.id, id));
  revalidatePath("/menu");
  revalidatePath("/pos");
  return { success: true };
}

export async function toggleMenuItemAvailability(
  id: number,
  available: boolean
) {
  await db
    .update(menuItems)
    .set({ available, updatedAt: new Date() })
    .where(eq(menuItems.id, id));
  revalidatePath("/menu");
  revalidatePath("/pos");
  return { success: true };
}

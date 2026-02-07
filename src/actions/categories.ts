"use server";

import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { categorySchema } from "@/lib/validators";

export async function getCategories() {
  return db.query.categories.findMany({
    orderBy: [asc(categories.name)],
  });
}

export async function createCategory(data: { name: string }) {
  const parsed = categorySchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }
  await db.insert(categories).values({ name: parsed.data.name });
  revalidatePath("/menu");
  revalidatePath("/pos");
  return { success: true };
}

export async function updateCategory(id: number, data: { name: string }) {
  const parsed = categorySchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }
  await db
    .update(categories)
    .set({ name: parsed.data.name })
    .where(eq(categories.id, id));
  revalidatePath("/menu");
  revalidatePath("/pos");
  return { success: true };
}

export async function deleteCategory(id: number) {
  await db.delete(categories).where(eq(categories.id, id));
  revalidatePath("/menu");
  revalidatePath("/pos");
  return { success: true };
}

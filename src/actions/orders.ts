"use server";

import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq, desc, and, gte, sql, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { generateOrderNumber } from "@/lib/utils";

export type CartItem = {
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
};

export type CustomerInfo = {
  customerName: string;
  customerPhone: string;
  tableNumber: string;
  paymentProofUrl: string;
};

export async function createOrder(items: CartItem[], customerInfo?: CustomerInfo) {
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const orderNumber = generateOrderNumber();

  const [order] = await db
    .insert(orders)
    .values({
      orderNumber,
      status: customerInfo ? "awaiting_verification" : "pending",
      total,
      customerName: customerInfo?.customerName ?? null,
      customerPhone: customerInfo?.customerPhone ?? null,
      tableNumber: customerInfo?.tableNumber ?? null,
      paymentProofUrl: customerInfo?.paymentProofUrl ?? null,
    })
    .returning();

  await db.insert(orderItems).values(
    items.map((item) => ({
      orderId: order.id,
      menuItemId: item.menuItemId,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity,
    }))
  );

  revalidatePath("/orders");
  revalidatePath("/pos");
  revalidatePath("/order");
  revalidatePath("/");

  return { orderNumber: order.orderNumber, orderId: order.id };
}

export async function updateOrderStatus(
  orderId: number,
  status: "pending" | "awaiting_verification" | "preparing" | "completed" | "cancelled"
) {
  await db
    .update(orders)
    .set({ status, updatedAt: new Date() })
    .where(eq(orders.id, orderId));

  revalidatePath("/orders");
  revalidatePath("/");
}

export async function getOrders() {
  return db.query.orders.findMany({
    with: {
      orderItems: {
        with: { menuItem: true },
      },
    },
    orderBy: [desc(orders.createdAt)],
  });
}

export async function getActiveOrders() {
  return db.query.orders.findMany({
    where: sql`${orders.status} IN ('pending', 'preparing')`,
    with: {
      orderItems: {
        with: { menuItem: true },
      },
    },
    orderBy: [desc(orders.createdAt)],
  });
}

export async function getDashboardStats() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayOrders = await db
    .select({
      count: count(),
      total: sql<number>`COALESCE(SUM(${orders.total}), 0)`,
    })
    .from(orders)
    .where(
      and(gte(orders.createdAt, todayStart), eq(orders.status, "completed"))
    );

  const allTimeOrders = await db
    .select({
      count: count(),
      total: sql<number>`COALESCE(SUM(${orders.total}), 0)`,
    })
    .from(orders)
    .where(eq(orders.status, "completed"));

  const todayCount = todayOrders[0]?.count ?? 0;
  const todayRevenue = todayOrders[0]?.total ?? 0;
  const allTimeCount = allTimeOrders[0]?.count ?? 0;
  const allTimeRevenue = allTimeOrders[0]?.total ?? 0;

  return {
    todayOrders: todayCount,
    todayRevenue,
    allTimeOrders: allTimeCount,
    allTimeRevenue,
    averageOrderValue:
      allTimeCount > 0 ? Math.round(allTimeRevenue / allTimeCount) : 0,
  };
}

export async function getRecentOrders(limit = 10) {
  return db.query.orders.findMany({
    with: {
      orderItems: {
        with: { menuItem: true },
      },
    },
    orderBy: [desc(orders.createdAt)],
    limit,
  });
}

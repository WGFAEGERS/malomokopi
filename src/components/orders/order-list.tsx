"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderCard } from "./order-card";

type Order = {
  id: number;
  orderNumber: string;
  status: "pending" | "preparing" | "completed" | "cancelled";
  total: number;
  createdAt: Date;
  orderItems: Array<{
    id: number;
    quantity: number;
    price: number;
    subtotal: number;
    menuItem: { id: number; name: string };
  }>;
};

export function OrderList({ orders }: { orders: Order[] }) {
  const activeOrders = orders.filter(
    (o) => o.status === "pending" || o.status === "preparing"
  );
  const completedOrders = orders.filter((o) => o.status === "completed");
  const cancelledOrders = orders.filter((o) => o.status === "cancelled");

  return (
    <Tabs defaultValue="active">
      <TabsList className="bg-secondary/80">
        <TabsTrigger value="active">
          Active ({activeOrders.length})
        </TabsTrigger>
        <TabsTrigger value="completed">
          Completed ({completedOrders.length})
        </TabsTrigger>
        <TabsTrigger value="cancelled">
          Cancelled ({cancelledOrders.length})
        </TabsTrigger>
        <TabsTrigger value="all">All ({orders.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="active" className="mt-6">
        <OrderGrid orders={activeOrders} emptyText="No active orders." />
      </TabsContent>
      <TabsContent value="completed" className="mt-6">
        <OrderGrid
          orders={completedOrders}
          emptyText="No completed orders yet."
        />
      </TabsContent>
      <TabsContent value="cancelled" className="mt-6">
        <OrderGrid
          orders={cancelledOrders}
          emptyText="No cancelled orders."
        />
      </TabsContent>
      <TabsContent value="all" className="mt-6">
        <OrderGrid orders={orders} emptyText="No orders yet." />
      </TabsContent>
    </Tabs>
  );
}

function OrderGrid({
  orders,
  emptyText,
}: {
  orders: Order[];
  emptyText: string;
}) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-sm">{emptyText}</p>
      </div>
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}

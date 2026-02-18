import { getOrders } from "@/actions/orders";
import { OrderList } from "@/components/orders/order-list";

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground mt-1">View and manage all orders.</p>
      </div>
      <OrderList orders={orders as any} />
    </div>
  );
}

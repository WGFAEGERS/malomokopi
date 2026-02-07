import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { formatPrice } from "@/lib/utils";

type Order = {
  id: number;
  orderNumber: string;
  status: "pending" | "preparing" | "completed" | "cancelled";
  total: number;
  createdAt: Date;
  orderItems: Array<{ id: number }>;
};

export function RecentOrdersTable({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <p className="text-sm">No orders yet. Place your first order from the POS screen.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="font-semibold">Order #</TableHead>
          <TableHead className="font-semibold">Items</TableHead>
          <TableHead className="font-semibold">Total</TableHead>
          <TableHead className="font-semibold">Status</TableHead>
          <TableHead className="font-semibold">Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id} className="hover:bg-muted/50">
            <TableCell className="font-medium">{order.orderNumber}</TableCell>
            <TableCell className="text-muted-foreground">
              {order.orderItems.length} items
            </TableCell>
            <TableCell className="font-medium">
              {formatPrice(order.total)}
            </TableCell>
            <TableCell>
              <OrderStatusBadge status={order.status} />
            </TableCell>
            <TableCell className="text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

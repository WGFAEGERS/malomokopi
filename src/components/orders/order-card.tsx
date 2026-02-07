"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "./order-status-badge";
import { updateOrderStatus } from "@/actions/orders";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Clock, Printer } from "lucide-react";
import { printReceipt } from "@/lib/print-receipt";

type OrderItem = {
  id: number;
  quantity: number;
  price: number;
  subtotal: number;
  menuItem: { id: number; name: string };
};

type Order = {
  id: number;
  orderNumber: string;
  status: "pending" | "preparing" | "completed" | "cancelled";
  total: number;
  createdAt: Date;
  orderItems: OrderItem[];
};

const borderColorMap = {
  pending: "border-l-amber-400",
  preparing: "border-l-primary",
  completed: "border-l-emerald-400",
  cancelled: "border-l-destructive/50",
};

export function OrderCard({ order }: { order: Order }) {
  const router = useRouter();

  async function handleStatusUpdate(
    newStatus: "preparing" | "completed" | "cancelled"
  ) {
    await updateOrderStatus(order.id, newStatus);
    router.refresh();
  }

  function handlePrint() {
    printReceipt({
      orderNumber: order.orderNumber,
      items: order.orderItems.map((item) => ({
        name: item.menuItem.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal,
      })),
      total: order.total,
      date: order.createdAt,
    });
  }

  return (
    <Card
      className={cn(
        "border-0 shadow-sm border-l-4 overflow-hidden",
        borderColorMap[order.status]
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <p className="font-bold tracking-tight">{order.orderNumber}</p>
          <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {new Date(order.createdAt).toLocaleString()}
          </div>
        </div>
        <OrderStatusBadge status={order.status} />
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-1.5">
          {order.orderItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">{item.quantity}x</span>{" "}
                {item.menuItem.name}
              </span>
              <span className="font-medium">{formatPrice(item.subtotal)}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between border-t pt-3">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="text-lg font-bold">{formatPrice(order.total)}</span>
        </div>
      </CardContent>
      {(order.status === "pending" || order.status === "preparing") && (
        <CardFooter className="gap-2 bg-muted/30 pt-3">
          {order.status === "pending" && (
            <Button
              size="sm"
              onClick={() => handleStatusUpdate("preparing")}
              className="flex-1 shadow-sm"
            >
              Start Preparing
            </Button>
          )}
          {order.status === "preparing" && (
            <Button
              size="sm"
              onClick={() => handleStatusUpdate("completed")}
              className="flex-1 shadow-sm bg-emerald-600 hover:bg-emerald-700"
            >
              Mark Complete
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleStatusUpdate("cancelled")}
            className="text-destructive hover:text-destructive hover:bg-destructive/5"
          >
            Cancel
          </Button>
        </CardFooter>
      )}
      {order.status === "completed" && (
        <CardFooter className="bg-muted/30 pt-3">
          <Button
            size="sm"
            variant="outline"
            onClick={handlePrint}
            className="w-full gap-2"
          >
            <Printer className="h-3.5 w-3.5" />
            Print Receipt
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "./order-status-badge";
import { PaymentProofDialog } from "./payment-proof-dialog";
import { updateOrderStatus } from "@/actions/orders";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  Clock,
  Printer,
  User,
  Phone,
  Hash,
  ImageIcon,
  CheckCircle2,
  XCircle,
} from "lucide-react";
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
  status: "pending" | "awaiting_verification" | "preparing" | "completed" | "cancelled";
  total: number;
  createdAt: Date;
  customerName?: string | null;
  customerPhone?: string | null;
  tableNumber?: string | null;
  paymentProofUrl?: string | null;
  orderItems: OrderItem[];
};

const borderColorMap = {
  pending: "border-l-amber-400",
  awaiting_verification: "border-l-blue-400",
  preparing: "border-l-primary",
  completed: "border-l-emerald-400",
  cancelled: "border-l-destructive/50",
};

export function OrderCard({ order }: { order: Order }) {
  const router = useRouter();
  const [proofOpen, setProofOpen] = useState(false);

  async function handleStatusUpdate(
    newStatus: "awaiting_verification" | "preparing" | "completed" | "cancelled"
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

  const hasCustomerInfo = order.customerName || order.customerPhone || order.tableNumber;

  return (
    <>
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
          {/* Customer Info */}
          {hasCustomerInfo && (
            <div className="mb-3 p-3 rounded-xl bg-muted/40 border border-border/50 space-y-1.5">
              {order.customerName && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-medium">{order.customerName}</span>
                </div>
              )}
              {order.customerPhone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">{order.customerPhone}</span>
                </div>
              )}
              {order.tableNumber && (
                <div className="flex items-center gap-2 text-sm">
                  <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Meja {order.tableNumber}</span>
                </div>
              )}
            </div>
          )}

          {/* Order Items */}
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

        {/* Awaiting Verification Actions */}
        {order.status === "awaiting_verification" && (
          <CardFooter className="flex-col gap-2 bg-blue-50/50 dark:bg-blue-950/20 pt-3">
            {order.paymentProofUrl && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setProofOpen(true)}
                className="w-full gap-2 border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-950/40"
              >
                <ImageIcon className="h-3.5 w-3.5" />
                Lihat Bukti Pembayaran
              </Button>
            )}
            <div className="flex w-full gap-2">
              <Button
                size="sm"
                onClick={() => handleStatusUpdate("preparing")}
                className="flex-1 shadow-sm bg-emerald-600 hover:bg-emerald-700 gap-1.5"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Verifikasi
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStatusUpdate("cancelled")}
                className="text-destructive hover:text-destructive hover:bg-destructive/5 gap-1.5"
              >
                <XCircle className="h-3.5 w-3.5" />
                Tolak
              </Button>
            </div>
          </CardFooter>
        )}

        {/* Pending / Preparing Actions (admin POS flow) */}
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

      <PaymentProofDialog
        open={proofOpen}
        onOpenChange={setProofOpen}
        imageUrl={order.paymentProofUrl ?? null}
        orderNumber={order.orderNumber}
      />
    </>
  );
}

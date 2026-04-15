"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImageIcon } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string | null;
  orderNumber: string;
};

export function PaymentProofDialog({
  open,
  onOpenChange,
  imageUrl,
  orderNumber,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 rounded-2xl overflow-hidden">
        <DialogHeader className="p-6 pb-3">
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            Bukti Pembayaran — {orderNumber}
          </DialogTitle>
        </DialogHeader>
        <div className="px-6 pb-6">
          {imageUrl ? (
            <div className="rounded-xl overflow-hidden border border-border shadow-sm bg-muted/30">
              <img
                src={imageUrl}
                alt={`Bukti pembayaran ${orderNumber}`}
                className="w-full max-h-[500px] object-contain"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <ImageIcon className="h-12 w-12 mb-3 opacity-30" />
              <p className="text-sm">Bukti pembayaran tidak tersedia</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice, calculateChangeGreedy } from "@/lib/utils";
import { Banknote, Coins, Calculator, CheckCircle2 } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  total: number;
  onConfirm: () => void;
  isSubmitting: boolean;
};

// Units based on the project's scale (Price/100)
// e.g. 100,000 IDR is stored as 1000 units
const IDR_DENOMINATIONS_UNITS = [
  1000, // 100k
  500,  // 50k
  200,  // 20k
  100,  // 10k
  50,   // 5k
  20,   // 2k
  10,   // 1k
  5,    // 500
  2,    // 200
  1,    // 100
];

export function PaymentDialog({
  open,
  onOpenChange,
  total,
  onConfirm,
  isSubmitting,
}: Props) {
  const [amountPaid, setAmountPaid] = useState<string>("");
  
  const amountPaidNumber = parseFloat(amountPaid) || 0;
  // Convert physical IDR input to stored units (e.g. 50000 input -> 500 units)
  const amountPaidUnits = amountPaidNumber / 100;
  
  const changeUnits = Math.max(0, amountPaidUnits - total);
  
  const changeBreakdown = useMemo(() => {
    if (amountPaidUnits <= total) return [];
    return calculateChangeGreedy(amountPaidUnits, total, IDR_DENOMINATIONS_UNITS);
  }, [amountPaidUnits, total]);

  const isValid = amountPaidUnits >= total && amountPaidUnits > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden p-0 rounded-2xl">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Calculator className="h-6 w-6 text-primary" />
            Payment
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          <div className="bg-muted/30 rounded-2xl p-5 border border-border/50">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-muted-foreground">Total Bill</span>
              <span className="text-2xl font-bold tracking-tight text-foreground">
                {formatPrice(total * 100)} {/* Convert units back to "cents" for formatPrice */}
              </span>
            </div>
            {amountPaidUnits > total && (
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-border/50">
                <span className="text-sm font-medium text-primary">Change to Give</span>
                <span className="text-xl font-bold text-primary">
                  {formatPrice(changeUnits * 100)}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount-paid" className="text-sm font-semibold">
              Amount Received (IDR)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">Rp</span>
              <Input
                id="amount-paid"
                type="number"
                placeholder="e.g. 50000"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                autoFocus
                className="pl-10 h-12 text-lg font-semibold rounded-xl border-2 focus-visible:ring-primary/20"
              />
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {[10000, 20000, 50000, 100000].map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => setAmountPaid(quickAmount.toString())}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg border bg-background hover:bg-muted transition-colors active:scale-95"
                >
                  +{quickAmount.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {changeBreakdown.length > 0 && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-1.5">
                <Banknote className="h-3 w-3" />
                Suggested Change Breakdown
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {changeBreakdown.map((item) => (
                  <div 
                    key={item.denomination} 
                    className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/10 transition-all hover:bg-primary/10"
                  >
                    <span className="text-sm font-medium">
                      {formatPrice(item.denomination * 100)}
                    </span>
                    <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      x{item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="p-6 bg-muted/30 border-t">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="rounded-xl font-medium"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={!isValid || isSubmitting}
            className="rounded-xl font-bold px-8 gradient-primary shadow-sm hover:opacity-90 transition-opacity min-w-[140px]"
          >
            {isSubmitting ? (
              "Processing..."
            ) : (
              <span className="flex items-center gap-2">
                Complete Order
                <CheckCircle2 className="h-4 w-4" />
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

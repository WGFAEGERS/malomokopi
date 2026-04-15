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
import { Sparkles, Utensils, X, PlusCircle, CheckCircle2 } from "lucide-react";
import { formatPrice, recommendMenuGreedy, type MenuItemLight } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  menuItems: MenuItemLight[];
  onAcceptRecommendation: (items: MenuItemLight[]) => void;
};

export function BudgetRecommendationDialog({
  open,
  onOpenChange,
  menuItems,
  onAcceptRecommendation,
}: Props) {
  const [budget, setBudget] = useState<string>("");

  const budgetNumber = parseFloat(budget) || 0;
  // User types IDR (e.g. 50000) → convert to cents (* 100) to match DB price unit
  const budgetCents = budgetNumber * 100;

  // Greedy: return all menu items with price <= budget, sorted highest price first
  const recommendedItems = useMemo(() => {
    if (budgetCents <= 0) return [];
    return recommendMenuGreedy(budgetCents, menuItems);
  }, [budgetCents, menuItems]);

  const handleApply = () => {
    if (recommendedItems.length > 0) {
      onAcceptRecommendation(recommendedItems);
      onOpenChange(false);
      setBudget("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden p-0 rounded-2xl">
        <DialogHeader className="p-6 pb-0 bg-primary/5">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Rekomendasi Cerdas
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-2 pb-4">
            Masukkan budget, semua menu yang harganya masuk akan ditampilkan secara otomatis.
          </p>
        </DialogHeader>

        <div className="p-6 space-y-6">
          <div className="space-y-3 p-4 bg-muted/40 rounded-xl border border-primary/10">
            <Label htmlFor="budget" className="text-sm font-semibold">
              Budget Pelanggan (IDR)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">Rp</span>
              <Input
                id="budget"
                type="number"
                placeholder="e.g. 50000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                autoFocus
                className="pl-10 h-12 text-lg font-semibold rounded-xl border-2 focus-visible:ring-primary/20"
              />
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {[20000, 30000, 50000, 100000].map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => setBudget(quickAmount.toString())}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg border bg-background hover:bg-muted/80 transition-colors active:scale-95 text-foreground"
                >
                  +{quickAmount.toLocaleString("id-ID")}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 min-h-[160px]">
            {budgetCents > 0 ? (
              recommendedItems.length > 0 ? (
                <div className="space-y-3 animate-in fade-in zoom-in-95 duration-300">
                  <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-1.5">
                    <Utensils className="h-3 w-3" />
                    {recommendedItems.length} menu tersedia dalam budget {formatPrice(budgetCents)}
                  </Label>
                  <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                    {recommendedItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-background border shadow-sm transition-all hover:border-primary/30"
                      >
                        <div className="flex items-center gap-3">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="h-10 w-10 rounded-lg object-cover" />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                              {item.name.charAt(0)}
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold">{item.name}</span>
                            <span className="text-xs text-primary font-medium">{formatPrice(item.price)}</span>
                          </div>
                        </div>
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-muted/20 border border-dashed rounded-xl">
                  <X className="h-8 w-8 text-muted-foreground mb-2 opacity-50" />
                  <p className="text-sm font-medium text-muted-foreground">Tidak ada menu yang harganya di bawah budget ini.</p>
                </div>
              )
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <Sparkles className="h-8 w-8 text-muted-foreground mb-2 opacity-30" />
                <p className="text-sm font-medium text-muted-foreground">Masukkan angka budget untuk melihat menu yang tersedia.</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="p-6 bg-muted/30 border-t">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="rounded-xl font-medium"
          >
            Batal
          </Button>
          <Button
            onClick={handleApply}
            disabled={recommendedItems.length === 0}
            className="rounded-xl font-bold px-6 shadow-sm min-w-[140px] gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Masukkan ke Keranjang
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

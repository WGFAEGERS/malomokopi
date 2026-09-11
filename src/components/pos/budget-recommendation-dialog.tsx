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
import {
  Sparkles,
  Utensils,
  X,
  PlusCircle,
  CheckCircle2,
  Circle,
} from "lucide-react";
import {
  cn,
  formatPrice,
  recommendMenuGreedy,
  type MenuItemLight,
} from "@/lib/utils";

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
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Parse raw digits from formatted string (e.g. "30.000" -> 30000)
  const rawBudgetNumber = parseInt(budget.replace(/\D/g, ""), 10) || 0;
  // User types IDR (e.g. 50000) → convert to cents (* 100) to match DB price unit
  const budgetCents = rawBudgetNumber * 100;

  // Greedy: return all menu items with price <= budget, sorted highest price first
  const recommendedItems = useMemo(() => {
    if (budgetCents <= 0) return [];
    return recommendMenuGreedy(budgetCents, menuItems);
  }, [budgetCents, menuItems]);

  // Only consider items that are currently in recommendedItems
  const selectedItems = useMemo(() => {
    return recommendedItems.filter((item) => selectedIds.has(item.id));
  }, [recommendedItems, selectedIds]);

  const selectedTotalCents = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + item.price, 0);
  }, [selectedItems]);

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (!raw) {
      setBudget("");
      return;
    }
    setBudget(parseInt(raw, 10).toLocaleString("id-ID"));
  };

  const toggleItem = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedIds(new Set(recommendedItems.map((item) => item.id)));
  };

  const handleClearAll = () => {
    setSelectedIds(new Set());
  };

  const handleApply = () => {
    if (selectedItems.length > 0) {
      onAcceptRecommendation(selectedItems);
      handleClose();
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setBudget("");
    setSelectedIds(new Set());
  };

  const isAllSelected =
    recommendedItems.length > 0 &&
    recommendedItems.every((item) => selectedIds.has(item.id));

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
        else onOpenChange(true);
      }}
    >
      <DialogContent className="sm:max-w-[480px] overflow-hidden p-0 rounded-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="p-6 pb-4 bg-primary/5 shrink-0">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Rekomendasi Cerdas
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Budget Input */}
          <div className="space-y-3 p-4 bg-muted/40 rounded-xl border border-primary/10">
            <Label htmlFor="budget" className="text-sm font-semibold">
              Budget Pelanggan (IDR)
            </Label>
            <div className="relative flex items-center">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-base select-none pointer-events-none">
                Rp
              </span>
              <Input
                id="budget"
                type="text"
                inputMode="numeric"
                placeholder="30.000"
                value={budget}
                onChange={handleBudgetChange}
                autoFocus
                className="pl-14 pr-10 h-12 text-lg font-bold rounded-xl border-2 focus-visible:ring-primary/20"
              />
              {budget && (
                <button
                  type="button"
                  onClick={() => {
                    setBudget("");
                    setSelectedIds(new Set());
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {[20000, 30000, 50000, 100000].map((quickAmount) => (
                <button
                  key={quickAmount}
                  type="button"
                  onClick={() =>
                    setBudget(quickAmount.toLocaleString("id-ID"))
                  }
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg border bg-background hover:bg-muted/80 transition-colors active:scale-95 text-foreground shadow-xs"
                >
                  +{quickAmount.toLocaleString("id-ID")}
                </button>
              ))}
            </div>
          </div>

          {/* Results section */}
          <div className="space-y-3 min-h-[160px]">
            {budgetCents > 0 ? (
              recommendedItems.length > 0 ? (
                <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
                  {/* Header info & action */}
                  <div className="flex items-center justify-between gap-2">
                    <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-1.5">
                      <Utensils className="h-3.5 w-3.5 text-primary" />
                      {recommendedItems.length} menu ≤ {formatPrice(budgetCents)}
                    </Label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={isAllSelected ? handleClearAll : handleSelectAll}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        {isAllSelected ? "Batal Semua" : "Pilih Semua"}
                      </button>
                    </div>
                  </div>

                  {/* Selected count and total info bar */}
                  <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-primary/5 border border-primary/10 text-xs">
                    <span className="font-semibold text-foreground">
                      {selectedItems.length} menu dipilih
                    </span>
                    <span className="font-bold text-primary flex items-center gap-1">
                      {formatPrice(selectedTotalCents)}
                      {selectedTotalCents > budgetCents && (
                        <span className="text-[10px] text-destructive font-medium">
                          (Melebihi budget)
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Items List */}
                  <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                    {recommendedItems.map((item) => {
                      const isSelected = selectedIds.has(item.id);
                        return (
                          <div
                            key={item.id}
                            onClick={() => toggleItem(item.id)}
                            className={cn(
                              "flex items-center justify-between p-3 rounded-xl border shadow-xs transition-all cursor-pointer select-none",
                              isSelected
                                ? "bg-primary/10 border-primary shadow-xs ring-1 ring-primary/30"
                                : "bg-background border-border/80 hover:border-primary/40 hover:bg-muted/30"
                            )}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {item.imageUrl ? (
                                <img
                                  src={item.imageUrl}
                                  alt={item.name}
                                  className="h-10 w-10 rounded-lg object-cover shrink-0"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                                  {item.name.charAt(0)}
                                </div>
                              )}
                              <div className="flex flex-col min-w-0">
                                <span className="text-sm font-semibold truncate leading-tight">
                                  {item.name}
                                </span>
                                <span className="text-xs text-primary font-medium mt-0.5">
                                  {formatPrice(item.price)}
                                </span>
                              </div>
                            </div>
                            <div className="pl-3 shrink-0">
                              {isSelected ? (
                                <CheckCircle2 className="h-5 w-5 text-primary fill-primary text-primary-foreground" />
                              ) : (
                                <Circle className="h-5 w-5 text-muted-foreground/40 hover:text-primary/60 transition-colors" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-muted/20 border border-dashed rounded-xl">
                  <X className="h-8 w-8 text-muted-foreground mb-2 opacity-50" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Tidak ada menu yang harganya di bawah budget ini.
                  </p>
                </div>
              )
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <Sparkles className="h-8 w-8 text-muted-foreground mb-2 opacity-30" />
                <p className="text-sm font-medium text-muted-foreground">
                  Masukkan angka budget untuk melihat dan memilih menu yang tersedia.
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="p-4 sm:p-6 bg-muted/30 border-t shrink-0 flex-row items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleClose}
            className="rounded-xl font-medium"
          >
            Batal
          </Button>
          <Button
            onClick={handleApply}
            disabled={selectedItems.length === 0}
            className="rounded-xl font-bold px-6 shadow-sm min-w-[150px] gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Masukkan ke Keranjang {selectedItems.length > 0 ? `(${selectedItems.length})` : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

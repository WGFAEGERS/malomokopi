"use client";

import { useState } from "react";
import Image from "next/image";
import { createOrder, type CartItem, type CustomerInfo } from "@/actions/orders";
import { formatPrice, cn, type MenuItemLight } from "@/lib/utils";
import { CheckoutDialog } from "./checkout-dialog";
import { BudgetRecommendationDialog } from "@/components/pos/budget-recommendation-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Coffee,
    ShoppingCart,
    Plus,
    Minus,
    Trash2,
    CheckCircle2,
    ShoppingBag,
    Sparkles,
} from "lucide-react";
import { toast } from "sonner";

type MenuItem = {
    id: number;
    name: string;
    price: number;
    categoryId: number;
    imageUrl: string | null;
    category: string;
};

type Props = {
    categories: Array<{ id: number; name: string }>;
    menuItems: MenuItem[];
};

export function CustomerOrderScreen({ categories, menuItems }: Props) {
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
    const [isRecommendationOpen, setIsRecommendationOpen] = useState(false);

    const filteredItems = selectedCategory
        ? menuItems.filter((item) => item.categoryId === selectedCategory)
        : menuItems;

    const cartTotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    function addToCart(item: MenuItem) {
        setCart((prev) => {
            const existing = prev.find((ci) => ci.menuItemId === item.id);
            if (existing) {
                return prev.map((ci) =>
                    ci.menuItemId === item.id
                        ? { ...ci, quantity: ci.quantity + 1 }
                        : ci
                );
            }
            return [
                ...prev,
                { menuItemId: item.id, name: item.name, price: item.price, quantity: 1 },
            ];
        });
        toast.success(`${item.name} ditambahkan`, { duration: 1500 });
    }

    function updateQuantity(menuItemId: number, quantity: number) {
        if (quantity <= 0) {
            setCart((prev) => prev.filter((ci) => ci.menuItemId !== menuItemId));
        } else {
            setCart((prev) =>
                prev.map((ci) =>
                    ci.menuItemId === menuItemId ? { ...ci, quantity } : ci
                )
            );
        }
    }

    function handleCheckout() {
        if (cart.length === 0) return;
        setCartOpen(false);
        setCheckoutOpen(true);
    }

    function handleAcceptRecommendation(items: MenuItemLight[]) {
        items.forEach((item) => addToCart({ ...item, category: "" }));
        toast.success(`${items.length} menu ditambahkan ke keranjang! 🎉`);
    }

    // Convert menuItems to MenuItemLight format (price in cents, same as MenuItemLight)
    const menuItemsForGreedy: MenuItemLight[] = menuItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        categoryId: item.categoryId,
        imageUrl: item.imageUrl,
    }));

    async function handleCheckoutConfirm(customerInfo: CustomerInfo) {
        setIsSubmitting(true);
        try {
            const result = await createOrder(cart, customerInfo);
            setOrderSuccess(result.orderNumber);
            setCart([]);
            setCheckoutOpen(false);
        } catch {
            toast.error("Gagal membuat pesanan. Silakan coba lagi.");
        } finally {
            setIsSubmitting(false);
        }
    }

    // ── Success screen ──
    if (orderSuccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 animate-fade-in">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 mb-6">
                    <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-center">Pesanan Berhasil! 🎉</h2>
                <p className="text-muted-foreground mt-2 text-center max-w-md">
                    Nomor pesanan Anda adalah:
                </p>
                <div className="mt-4 rounded-2xl gradient-warm px-8 py-4 shadow-lg">
                    <span className="text-2xl font-bold text-white tracking-wider">
                        {orderSuccess}
                    </span>
                </div>
                <p className="text-sm text-muted-foreground mt-6 text-center max-w-sm">
                    Silakan tunggu pesanan Anda. Terima kasih telah memesan di MalomoKopi! ☕
                </p>
                <Button
                    size="lg"
                    className="mt-8 gradient-primary text-white h-12 px-8"
                    onClick={() => setOrderSuccess(null)}
                >
                    Pesan Lagi
                </Button>
            </div>
        );
    }

    // ── Main screen ──
    return (
        <div className="animate-fade-in min-h-screen bg-background pb-24 transition-colors duration-300">
            {/* Hero */}
            <section className="relative overflow-hidden bg-slate-900 py-12 sm:py-20 lg:py-24 transition-all duration-500">
                {/* Background decorative elements */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-25 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/90 to-slate-900/60" />

                <div className="relative mx-auto max-w-5xl px-4 sm:px-6 text-center z-10">
                    <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/20 px-4 py-1.5 mb-6 backdrop-blur-md">
                        <Sparkles className="h-4 w-4 text-amber-400" />
                        <span className="text-xs font-bold text-amber-100 tracking-wide uppercase">Premium Coffee Experience</span>
                    </div>
                    <Image
                        src="/logomk.png"
                        alt="MalomoKopi"
                        width={100}
                        height={100}
                        className="mx-auto mb-4 drop-shadow-lg rounded-2xl"
                    />
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4 drop-shadow-lg">
                        Malomo<span className="text-amber-500">Kopi</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed font-medium">
                        Nikmati cita rasa kopi terbaik. Pesan langsung dari meja Anda, kami antar dengan sepenuh hati.
                    </p>
                </div>
            </section>

            {/* Menu Section */}
            <section className="mx-auto max-w-6xl px-4 sm:px-6 -mt-8 relative z-20">
                {/* Budget Recommendation Banner */}
                <div className="mb-6 p-4 rounded-2xl bg-card/90 backdrop-blur-md border border-amber-500/20 shadow-lg flex flex-col sm:flex-row items-center gap-3 justify-between">
                    <div className="flex items-center gap-3 text-left">
                        <div className="h-10 w-10 bg-amber-500/10 rounded-xl flex items-center justify-center shrink-0">
                            <Sparkles className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-foreground">Bingung Mau Pesan Apa?</p>
                            <p className="text-xs text-muted-foreground">Masukkan budget kamu, kami rekomendasikan menu terbaik!</p>
                        </div>
                    </div>
                    <Button
                        onClick={() => setIsRecommendationOpen(true)}
                        className="w-full sm:w-auto shrink-0 gap-2 rounded-xl font-bold bg-amber-500 hover:bg-amber-500/90 text-white shadow-md"
                    >
                        <Sparkles className="h-4 w-4" />
                        Rekomendasi Budget
                    </Button>
                </div>

                {/* Category tabs */}
                <div className="bg-card/80 backdrop-blur-md rounded-2xl shadow-lg border border-border p-2 mb-8 flex gap-2 overflow-x-auto scrollbar-none sticky top-20 z-30 transition-all duration-300">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={cn(
                            "shrink-0 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all duration-200",
                            selectedCategory === null
                                ? "bg-primary text-primary-foreground shadow-md transform scale-105"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                    >
                        Semua
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={cn(
                                "shrink-0 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all duration-200",
                                selectedCategory === cat.id
                                    ? "bg-primary text-primary-foreground shadow-md transform scale-105"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Menu Grid */}
                {filteredItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-card rounded-3xl border border-border shadow-sm">
                        <Coffee className="h-16 w-16 mb-4 text-muted/30" />
                        <p className="text-lg font-medium text-muted-foreground/60">Belum ada menu di kategori ini</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                        {filteredItems.map((item) => (
                            <Card
                                key={item.id}
                                className="group cursor-pointer border-0 bg-card shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden rounded-2xl ring-1 ring-border"
                                onClick={() => addToCart(item)}
                            >
                                <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                                    {item.imageUrl ? (
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <Coffee className="h-12 w-12 text-muted-foreground/30" />
                                        </div>
                                    )}
                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    {/* Quick Add Button showing on hover (Desktop) */}
                                    <div className="absolute bottom-3 right-3 translate-y-10 group-hover:translate-y-0 transition-transform duration-300 hidden sm:flex">
                                        <div className="h-10 w-10 bg-card rounded-full flex items-center justify-center shadow-lg text-foreground">
                                            <Plus className="h-5 w-5" />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <div className="mb-2">
                                        <span className="inline-block px-2 py-0.5 rounded-md bg-muted text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                            {item.category}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-card-foreground leading-tight mb-1 line-clamp-2 min-h-[2.5rem]">
                                        {item.name}
                                    </h3>
                                    <div className="flex items-center justify-between mt-3">
                                        <p className="text-lg font-bold text-primary">
                                            {formatPrice(item.price)}
                                        </p>
                                        <div className="sm:hidden h-8 w-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-md active:scale-90 transition-transform">
                                            <Plus className="h-4 w-4" />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </section>

            {/* Floating Cart Button */}
            {cartCount > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
                    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
                        <SheetTrigger asChild>
                            <Button
                                size="lg"
                                className="w-full h-16 rounded-2xl shadow-2xl bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-between px-6 border border-primary-foreground/10 backdrop-blur-xl"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary-foreground text-primary h-8 w-8 rounded-lg flex items-center justify-center font-bold text-sm">
                                        {cartCount}
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <span className="text-xs opacity-70 font-medium tracking-wide uppercase">Total Pesanan</span>
                                        <span className="font-bold text-lg leading-none">{formatPrice(cartTotal)}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 font-semibold text-primary-foreground">
                                    Lihat Keranjang
                                    <ShoppingCart className="h-5 w-5" />
                                </div>
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="bottom"
                            className="h-[85vh] rounded-t-[2rem] p-0 border-t-0"
                            showCloseButton={false}
                        >
                            <SheetTitle className="sr-only">Keranjang Pesanan</SheetTitle>
                            <div className="flex flex-col h-full bg-background">
                                {/* Cart header */}
                                <div className="flex items-center justify-between px-6 py-5 bg-card border-b border-border rounded-t-[2rem]">
                                    <h3 className="font-bold text-xl text-foreground">Pesanan Kamu</h3>
                                    <button
                                        onClick={() => setCart([])}
                                        className="text-xs font-semibold text-destructive hover:text-destructive/80 bg-destructive/10 px-3 py-1.5 rounded-full transition-colors"
                                    >
                                        Hapus semua
                                    </button>
                                </div>

                                {/* Cart items */}
                                <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
                                    <div className="space-y-3">
                                        {cart.map((item) => (
                                            <div
                                                key={item.menuItemId}
                                                className="flex items-center gap-4 p-4 bg-card rounded-2xl shadow-sm border border-border"
                                            >
                                                {/* Quantity Controls */}
                                                <div className="flex flex-col items-center gap-1 bg-muted rounded-lg p-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                                                        className="h-7 w-7 flex items-center justify-center bg-card rounded-md shadow-sm text-foreground active:scale-95 transition-transform"
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </button>
                                                    <span className="text-sm font-bold w-full text-center py-0.5">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                                                        className={cn(
                                                            "h-7 w-7 flex items-center justify-center rounded-md shadow-sm active:scale-95 transition-transform",
                                                            item.quantity === 1 ? "bg-destructive/10 text-destructive" : "bg-card text-foreground"
                                                        )}
                                                    >
                                                        {item.quantity === 1 ? (
                                                            <Trash2 className="h-3 w-3" />
                                                        ) : (
                                                            <Minus className="h-3 w-3" />
                                                        )}
                                                    </button>
                                                </div>

                                                {/* Item Info */}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-foreground truncate">{item.name}</h4>
                                                    <p className="text-sm text-muted-foreground font-medium">
                                                        {formatPrice(item.price)}
                                                    </p>
                                                </div>

                                                {/* Subtotal */}
                                                <div className="text-right">
                                                    <p className="font-bold text-foreground">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Cart footer */}
                                <div className="bg-card p-6 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.05)] z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-muted-foreground font-medium">Total Pembayaran</span>
                                        <span className="text-2xl font-extrabold text-foreground">
                                            {formatPrice(cartTotal)}
                                        </span>
                                    </div>
                                    <Button
                                        size="lg"
                                        className="w-full h-14 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 rounded-xl"
                                        onClick={handleCheckout}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center gap-2">
                                                <Sparkles className="h-4 w-4 animate-spin" /> Memproses...
                                            </span>
                                        ) : (
                                            "Konfirmasi Pesanan"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            )}

            <CheckoutDialog
                open={checkoutOpen}
                onOpenChange={setCheckoutOpen}
                items={cart}
                total={cartTotal}
                onConfirm={handleCheckoutConfirm}
                isSubmitting={isSubmitting}
            />

            <BudgetRecommendationDialog
                open={isRecommendationOpen}
                onOpenChange={setIsRecommendationOpen}
                menuItems={menuItemsForGreedy}
                onAcceptRecommendation={handleAcceptRecommendation}
            />
        </div>
    );
}

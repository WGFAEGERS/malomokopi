import { Coffee } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                    <Link href="/order" className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-warm shadow-md">
                            <Coffee className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <span className="text-lg font-bold tracking-tight">MalomoKopi</span>
                            <p className="text-[10px] leading-none text-muted-foreground -mt-0.5">Menu & Order</p>
                        </div>
                    </Link>
                    <ThemeToggle />
                </div>
            </header>

            {/* Main */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="border-t bg-card/50 mt-12">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg gradient-warm">
                                <Coffee className="h-3.5 w-3.5 text-white" />
                            </div>
                            <span className="text-sm font-semibold">MalomoKopi</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            © 2026 MalomoKopi. Freshly brewed with ☕
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

import Image from "next/image";
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
                        <Image
                            src="/logomk.png"
                            alt="MalomoKopi"
                            width={36}
                            height={36}
                            className="rounded-xl shadow-md"
                        />
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
                            <Image
                                src="/logomk.png"
                                alt="MalomoKopi"
                                width={28}
                                height={28}
                                className="rounded-lg"
                            />
                            <span className="text-sm font-semibold">MalomoKopi</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            © 2026 MalomoKopi. by M.Fauzan ☕
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

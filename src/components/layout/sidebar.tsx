"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Coffee,
  ShoppingCart,
  ClipboardList,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/pos", label: "POS", icon: ShoppingCart },
  { href: "/menu", label: "Menu", icon: Coffee },
  { href: "/orders", label: "Orders", icon: ClipboardList },
];

export function SidebarContent() {
  const pathname = usePathname();

  return (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6">
        <Image
          src="/logomk.png"
          alt="MalomoKopi"
          width={36}
          height={36}
          className="rounded-lg shadow-md"
        />
        <Link href="/" className="font-bold text-lg tracking-tight">
          MalomoKopi
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "gradient-gold text-sidebar-primary-foreground shadow-md"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-[18px] w-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-3 py-4">
        <div className="rounded-xl bg-sidebar-accent/50 px-3 py-3">
          <p className="text-xs font-medium text-sidebar-foreground/50">MalomoKopi v1.0</p>
          <p className="text-xs text-sidebar-foreground/30 mt-0.5">Powered by Next.js</p>
        </div>
      </div>
    </>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden md:flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground">
      <SidebarContent />
    </aside>
  );
}

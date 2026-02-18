"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { LogOut, User, Menu, Coffee } from "lucide-react";
import { SidebarContent } from "./sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export function Header() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card/80 backdrop-blur-sm px-4 md:px-6">
      {/* Mobile menu toggle */}
      <div className="flex items-center gap-3 md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-sidebar text-sidebar-foreground">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div onClick={() => setOpen(false)}>
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg gradient-warm text-white">
            <Coffee className="h-4 w-4" />
          </div>
          <span className="font-bold text-sm tracking-tight">MalomoKopi</span>
        </div>
      </div>

      {/* Empty spacer for desktop */}
      <div className="hidden md:block" />

      {/* Actions */}
      <div className="flex items-center gap-4">
        <ThemeToggle />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2.5 h-9 px-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="h-3.5 w-3.5" />
              </div>
              <span className="font-medium text-sm hidden sm:inline">
                {session?.user?.name ?? "User"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{session?.user?.name}</p>
              <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

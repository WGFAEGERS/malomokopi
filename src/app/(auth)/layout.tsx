import { Coffee } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-primary/70 items-center justify-center p-12">
        <div className="max-w-md text-primary-foreground space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
              <Coffee className="h-7 w-7" />
            </div>
            <span className="text-3xl font-bold tracking-tight">Cafe POS</span>
          </div>
          <p className="text-lg leading-relaxed text-primary-foreground/80">
            Streamline your cafe operations with a modern point-of-sale system.
            Fast orders, simple menu management, and real-time insights.
          </p>
          <div className="flex gap-8 pt-4">
            <div>
              <p className="text-2xl font-bold">Fast</p>
              <p className="text-sm text-primary-foreground/60">Order processing</p>
            </div>
            <div>
              <p className="text-2xl font-bold">Simple</p>
              <p className="text-sm text-primary-foreground/60">Menu management</p>
            </div>
            <div>
              <p className="text-2xl font-bold">Smart</p>
              <p className="text-sm text-primary-foreground/60">Sales insights</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}

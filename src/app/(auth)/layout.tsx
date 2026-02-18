import { Coffee } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary items-center justify-center p-12 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-40 h-40 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-32 right-16 w-56 h-56 rounded-full bg-white/15 blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
        </div>

        <div className="max-w-md text-primary-foreground space-y-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm shadow-lg">
              <Coffee className="h-7 w-7" />
            </div>
            <span className="text-3xl font-bold tracking-tight">MalomoKopi</span>
          </div>
          <p className="text-lg leading-relaxed text-primary-foreground/80">
            Streamline your coffee shop operations with a modern point-of-sale system.
            Fast orders, simple menu management, and real-time insights.
          </p>
          <div className="flex gap-8 pt-4">
            <div className="glass-dark rounded-xl px-4 py-3">
              <p className="text-2xl font-bold">Fast</p>
              <p className="text-sm text-primary-foreground/60">Order processing</p>
            </div>
            <div className="glass-dark rounded-xl px-4 py-3">
              <p className="text-2xl font-bold">Simple</p>
              <p className="text-sm text-primary-foreground/60">Menu management</p>
            </div>
            <div className="glass-dark rounded-xl px-4 py-3">
              <p className="text-2xl font-bold">Smart</p>
              <p className="text-sm text-primary-foreground/60">Sales insights</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md animate-fade-in">{children}</div>
      </div>
    </div>
  );
}

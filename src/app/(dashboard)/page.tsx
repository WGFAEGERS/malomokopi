import { getDashboardStats, getRecentOrders } from "@/actions/orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { DollarSign, ShoppingCart, TrendingUp, Activity } from "lucide-react";
import { RecentOrdersTable } from "@/components/dashboard/recent-orders-table";

export default async function DashboardPage() {
  const [stats, recentOrders] = await Promise.all([
    getDashboardStats(),
    getRecentOrders(),
  ]);

  const statCards = [
    {
      title: "Today's Revenue",
      value: formatPrice(stats.todayRevenue),
      icon: DollarSign,
      color: "bg-emerald-500/10 text-emerald-600",
      iconBg: "gradient-warm",
    },
    {
      title: "Today's Orders",
      value: stats.todayOrders.toString(),
      icon: ShoppingCart,
      color: "bg-primary/10 text-primary",
      iconBg: "gradient-primary",
    },
    {
      title: "All-Time Revenue",
      value: formatPrice(stats.allTimeRevenue),
      icon: TrendingUp,
      color: "bg-violet-500/10 text-violet-600",
      iconBg: "gradient-gold",
    },
    {
      title: "Avg. Order Value",
      value: formatPrice(stats.averageOrderValue),
      icon: Activity,
      color: "bg-amber-500/10 text-amber-600",
      iconBg: "bg-amber-500",
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your MalomoKopi performance
        </p>
      </div>

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="border-0 shadow-sm card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl ${stat.iconBg} shadow-sm`}>
                <stat.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg sm:text-2xl font-bold tracking-tight">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <RecentOrdersTable orders={recentOrders as any} />
        </CardContent>
      </Card>
    </div>
  );
}

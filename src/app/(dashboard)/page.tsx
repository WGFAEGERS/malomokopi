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
    },
    {
      title: "Today's Orders",
      value: stats.todayOrders.toString(),
      icon: ShoppingCart,
      color: "bg-primary/10 text-primary",
    },
    {
      title: "All-Time Revenue",
      value: formatPrice(stats.allTimeRevenue),
      icon: TrendingUp,
      color: "bg-violet-500/10 text-violet-600",
    },
    {
      title: "Avg. Order Value",
      value: formatPrice(stats.averageOrderValue),
      icon: Activity,
      color: "bg-amber-500/10 text-amber-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your cafe performance
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentOrdersTable orders={recentOrders as any} />
        </CardContent>
      </Card>
    </div>
  );
}

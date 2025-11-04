"use client";

import { CheckCircle, Package, Tag, TrendingDown, TrendingUp } from "lucide-react";
import { useSession } from "next-auth/react";
import { useGetDashboardMetricsQuery } from "@/state/api";
import { Skeleton } from "@/components/ui/skeleton";
import CardExpenseSummary from "./cards/CardExpenseSummary";
import CardPopularProducts from "./cards/CardPopularProducts";
import CardPurchaseSummary from "./cards/CardPurchaseSummary";
import CardSalesSummary from "./cards/CardSalesSummary";
import StatCard from "./cards/StatCard";

export default function DashboardContent() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const { data: dashboardMetrics, isLoading } = useGetDashboardMetricsQuery(undefined, {
    skip: !isAuthenticated,
  });

  // 🌀 Unified loading + unauthenticated fallback
  if (!isAuthenticated || isLoading || !dashboardMetrics) {
    return (
      <div
        className="flex flex-col xl:flex-row gap-4 p-4"
        aria-busy="true"
        aria-label="Loading dashboard metrics"
      >
        <div className="xl:w-1/3">
          <Skeleton className="h-96 w-full" />
        </div>
        <div className="xl:w-2/3 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  const {
    popularProducts = [],
    salesSummary = [],
    purchaseSummary = [],
    expenseSummary = null,
    expenseByCategorySummary = [],
  } = dashboardMetrics;

  // 💡 Theme-friendly icons using text-foreground or text-muted-foreground
  const iconClasses = "w-6 h-6 text-primary";

  const statCards = [
    {
      title: "Customer & Expenses",
      primaryIcon: <Package className={iconClasses} />,
      dateRange: "22 - 29 Oct",
      details: [
        { title: "Customer Growth", amount: "175", changePercentage: 131, IconComponent: TrendingUp },
        { title: "Expenses", amount: "10", changePercentage: -56, IconComponent: TrendingDown },
      ],
    },
    {
      title: "Dues & Pending Orders",
      primaryIcon: <CheckCircle className={iconClasses} />,
      dateRange: "22 - 29 Oct",
      details: [
        { title: "Dues", amount: "250", changePercentage: 131, IconComponent: TrendingUp },
        { title: "Pending Orders", amount: "147", changePercentage: -56, IconComponent: TrendingDown },
      ],
    },
    {
      title: "Sales & Discount",
      primaryIcon: <Tag className={iconClasses} />,
      dateRange: "22 - 29 Oct",
      details: [
        { title: "Sales", amount: "1000", changePercentage: 20, IconComponent: TrendingUp },
        { title: "Discount", amount: "200", changePercentage: -10, IconComponent: TrendingDown },
      ],
    },
  ];

  return (
    <div className="flex flex-col xl:flex-row gap-4 p-4">
      {/* Left column - Popular Products */}
      <div className="xl:w-1/3">
        <CardPopularProducts products={popularProducts} />
      </div>

      {/* Right column - Summaries + Stats */}
      <div className="xl:w-2/3 flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CardSalesSummary sales={salesSummary} />
          <CardPurchaseSummary purchases={purchaseSummary} />
          <CardExpenseSummary expenses={expenseSummary} expenseByCategory={expenseByCategorySummary} />
          <StatCard {...statCards[0]} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {statCards.slice(1).map((card, index) => (
            <StatCard key={index} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
}

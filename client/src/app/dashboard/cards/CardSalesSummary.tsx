"use client";

import { TrendingUp } from "lucide-react";
import React, { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";

interface SalesDataItem {
  date: string;
  totalValue: number;
  changePercentage?: number;
}

interface CardSalesSummaryProps {
  sales: SalesDataItem[];
}

const CardSalesSummary = ({ sales }: CardSalesSummaryProps) => {
  const [timeframe, setTimeframe] = useState("weekly");

  const totalValueSum = sales.reduce((acc, curr) => acc + curr.totalValue, 0);
  const averageChangePercentage =
    sales.reduce((acc, curr, _, arr) => acc + (curr.changePercentage || 0) / arr.length, 0) || 0;

  const highestValueData = sales.reduce(
    (acc, curr) => (acc.totalValue > curr.totalValue ? acc : curr),
    sales[0] || { totalValue: 0, date: "" }
  );
  const highestValueDate = highestValueData.date
    ? new Date(highestValueData.date).toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "2-digit" })
    : "N/A";

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Sales Summary</CardTitle>
            <CardDescription>Sales performance overview</CardDescription>
          </div>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Header Info */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="text-2xl font-bold">${Math.round(totalValueSum / 1000000)}m</p>
            <Badge variant="secondary" className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> {averageChangePercentage.toFixed(2)}%
            </Badge>
          </div>
        </div>

        {/* Chart */}
        <div className="w-full h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sales}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="date" hide />
              <YAxis hide />
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, "Sales"]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Bar 
                dataKey="totalValue" 
                fill="hsl(var(--primary))" 
                barSize={10} 
                radius={[5, 5, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between text-sm pt-3 border-t">
        <span className="text-muted-foreground">{sales.length} days</span>
        <span className="text-muted-foreground">
          Highest: <strong>{highestValueDate}</strong>
        </span>
      </CardFooter>
    </Card>
  );
};

export default CardSalesSummary;
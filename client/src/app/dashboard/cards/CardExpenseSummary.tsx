"use client";

import { TrendingUp } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface ExpenseByCategory {
  category: string;
  amount: string;
}

interface CardExpenseSummaryProps {
  expenses: { totalExpenses: number } | null;
  expenseByCategory: ExpenseByCategory[];
  isLoading?: boolean;
}

const colors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"];

const CardExpenseSummary = ({ expenses, expenseByCategory, isLoading = false }: CardExpenseSummaryProps) => {
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const expenseSums = expenseByCategory.reduce<Record<string, number>>((acc, item) => {
    const category = item.category + " Expenses";
    const amount = parseFloat(item.amount) || 0;
    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {});

  const expenseCategories = Object.entries(expenseSums).map(([name, value]) => ({ name, value }));

  const totalExpenses = expenseCategories.reduce((acc, category) => acc + category.value, 0);
  const formattedTotalExpenses = totalExpenses.toFixed(2);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Expense Summary</CardTitle>
        <CardDescription>Overview of expenses by category</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col xl:flex-row items-center justify-between gap-4 flex-1 min-h-0">
        <div className="relative w-full xl:w-3/5 h-32">
          {expenseCategories.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={expenseCategories} innerRadius={40} outerRadius={50} dataKey="value" nameKey="name">
                  {expenseCategories.map((entry, index) => (
                    <Cell key={index} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-full text-muted-foreground">
              No expenses yet
            </div>
          )}

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <span className="font-bold text-lg">${formattedTotalExpenses}</span>
          </div>
        </div>

        <ul className="flex flex-col gap-2 w-full xl:w-2/5 px-2">
          {expenseCategories.map((entry, index) => (
            <li key={index} className="flex items-center text-sm">
              <span
                className="w-3 h-3 rounded-full block mr-2 flex-shrink-0"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-foreground truncate">{entry.name}</span>
              <span className="ml-auto font-semibold text-foreground flex-shrink-0">
                ${entry.value.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="flex justify-between items-center text-sm pt-3 border-t">
        <span className="text-muted-foreground">
          Average: <strong>${(expenses?.totalExpenses ?? 0).toFixed(2)}</strong>
        </span>
        <Badge variant="secondary" className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3" /> 30%
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default CardExpenseSummary;
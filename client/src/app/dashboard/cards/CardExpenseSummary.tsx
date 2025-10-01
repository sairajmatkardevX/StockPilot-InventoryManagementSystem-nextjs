"use client";

import { TrendingUp } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

interface ExpenseByCategory {
  category: string;
  amount: string;
}

interface CardExpenseSummaryProps {
  expenses: { totalExpenses: number } | null;
  expenseByCategory: ExpenseByCategory[];
  isLoading?: boolean;
}

const colors = ["#00C49F", "#0088FE", "#FFBB28"];

const CardExpenseSummary = ({ expenses, expenseByCategory, isLoading = false }: CardExpenseSummaryProps) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-5 flex justify-center items-center h-48">
        <span className="text-gray-600 dark:text-gray-300">Loading...</span>
      </div>
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
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-5 flex flex-col hover:shadow-lg transition-shadow duration-200 h-full">
      {/* Header */}
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
          Expense Summary
        </h2>
        <hr className="border-gray-200 dark:border-gray-700" />
      </div>

      {/* Body - FIXED HEIGHT */}
      <div className="flex flex-col xl:flex-row items-center justify-between gap-4 flex-1 min-h-0">
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
            <div className="flex justify-center items-center h-full text-gray-500 dark:text-gray-400">
              No expenses yet
            </div>
          )}

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <span className="font-bold text-lg text-gray-800 dark:text-gray-100">
              ${formattedTotalExpenses}
            </span>
          </div>
        </div>

        <ul className="flex flex-col gap-2 w-full xl:w-2/5 px-2">
          {expenseCategories.map((entry, index) => (
            <li key={index} className="flex items-center text-sm">
              <span
                className="w-3 h-3 rounded-full block mr-2"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-gray-700 dark:text-gray-200">{entry.name}</span>
              <span className="ml-auto font-semibold text-gray-800 dark:text-gray-100">
                ${entry.value.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center text-sm">
        <span className="text-gray-600 dark:text-gray-300">
          Average: <strong>${(expenses?.totalExpenses ?? 0).toFixed(2)}</strong>
        </span>
        <span className="flex items-center text-green-500">
          <TrendingUp className="w-4 h-4 mr-1" /> 30%
        </span>
      </div>
    </div>
  );
};

export default CardExpenseSummary;
"use client";

import { TrendingUp } from "lucide-react";
import React, { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-5 flex flex-col hover:shadow-lg transition-shadow duration-200 h-full">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Sales Summary</h2>
      <hr className="border-gray-200 dark:border-gray-700 mb-4" />

      {/* Header Info */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-xs text-gray-400 dark:text-gray-300">Value</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            ${Math.round(totalValueSum / 1000000)}m
          </p>
          <span className="text-green-500 flex items-center gap-1 text-sm">
            <TrendingUp className="w-4 h-4" /> {averageChangePercentage.toFixed(2)}%
          </span>
        </div>
        <select
          className="shadow-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 rounded"
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {/* Chart  */}
      <div className="w-full h-32 flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sales}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" hide />
            <YAxis hide />
            <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`]} />
            <Bar dataKey="totalValue" fill="#3182ce" barSize={10} radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between text-sm text-gray-600 dark:text-gray-300">
        <span>{sales.length} days</span>
        <span>Highest Sales Date: <strong>{highestValueDate}</strong></span>
      </div>
    </div>
  );
};

export default CardSalesSummary;
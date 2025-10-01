"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import numeral from "numeral";
import React from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface PurchaseDataItem {
  date: string;
  totalPurchased: number;
  changePercentage?: number;
}

interface CardPurchaseSummaryProps {
  purchases: PurchaseDataItem[];
}

const CardPurchaseSummary = ({ purchases }: CardPurchaseSummaryProps) => {
  const lastDataPoint = purchases[purchases.length - 1] || null;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-5 flex flex-col hover:shadow-lg transition-shadow duration-200 h-full">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
        Purchase Summary
      </h2>
      <hr className="border-gray-200 dark:border-gray-700 mb-4" />

      {/* Total Purchased */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-gray-400 dark:text-gray-300">Purchased</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {lastDataPoint ? numeral(lastDataPoint.totalPurchased).format("$0.00a") : "$0"}
          </p>
        </div>
        {lastDataPoint && (
          <div className={`flex items-center ${lastDataPoint.changePercentage! >= 0 ? "text-green-500" : "text-red-500"}`}>
            {lastDataPoint.changePercentage! >= 0 ? (
              <TrendingUp className="w-5 h-5 mr-1" />
            ) : (
              <TrendingDown className="w-5 h-5 mr-1" />
            )}
            {Math.abs(lastDataPoint.changePercentage!)}%
          </div>
        )}
      </div>

      {/* Chart  */}
      <div className="w-full h-32 flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={purchases}>
            <XAxis dataKey="date" hide />
            <YAxis hide />
            <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`]} />
            <Area type="monotone" dataKey="totalPurchased" stroke="#8884d8" fill="#8884d8" dot={true} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CardPurchaseSummary;
"use client";

import { LucideIcon } from "lucide-react";
import React from "react";

type StatDetail = {
  title: string;
  amount: string;
  changePercentage: number;
  IconComponent: LucideIcon;
};

type StatCardProps = {
  title: string;
  primaryIcon: JSX.Element;
  details: StatDetail[];
  dateRange: string;
};

const StatCard = ({ title, primaryIcon, details, dateRange }: StatCardProps) => {
  const formatPercentage = (value: number) => (value >= 0 ? `+${value}%` : `${value}%`);
  const getChangeColor = (value: number) => (value >= 0 ? "text-green-500" : "text-red-500");

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-5 flex flex-col hover:shadow-lg transition-shadow duration-200 h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-200">{title}</h2>
        <span className="text-xs text-gray-400 dark:text-gray-400">{dateRange}</span>
      </div>
      <hr className="border-gray-200 dark:border-gray-700 mb-3" />

      {/* Body */}
      <div className="flex items-center gap-4 flex-1">
        <div className="rounded-full p-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700">
          {primaryIcon}
        </div>
        <div className="flex-1 flex flex-col gap-2">
          {details.map((detail, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-gray-500 dark:text-gray-300">{detail.title}</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-800 dark:text-gray-100">{detail.amount}</span>
                <detail.IconComponent className={`w-4 h-4 ${getChangeColor(detail.changePercentage)}`} />
                <span className={`text-sm font-medium ${getChangeColor(detail.changePercentage)}`}>
                  {formatPercentage(detail.changePercentage)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
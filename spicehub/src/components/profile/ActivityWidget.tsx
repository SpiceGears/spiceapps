"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ActivityChart, monthNames } from "./ActivityChart";
import { YearSelector } from "./YearSelector";

interface ActivityWidgetProps {
  title: string;
  icon: React.ReactNode;
  year: number;
  onYearChange: (year: number) => void;
  data: { [date: string]: number };
}

// Function to process contribution data into monthly aggregates
const aggregateContributionsByMonth = (data: { [date: string]: number }) => {
  // Initialize array with 12 months (0-indexed)
  const monthlyData = Array(12).fill(0);
  
  // Loop through all contributions and add them to the appropriate month
  Object.entries(data).forEach(([date, count]) => {
    const month = parseInt(date.split('-')[1]) - 1; // Extract month from YYYY-MM-DD
    monthlyData[month] += count;
  });
  
  return monthlyData;
};

export const ActivityWidget = ({ title, icon, year, onYearChange, data }: ActivityWidgetProps) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  
  // Process the data into monthly aggregates
  const monthlyData = aggregateContributionsByMonth(data);
  const maxValue = Math.max(...monthlyData, 1); // Ensure at least 1 to avoid division by zero
  
  // Count total contributions
  const totalContributions = monthlyData.reduce((a, b) => a + b, 0);

  return (
    <Card className="border border-gray-200 bg-white dark:border-0 dark:bg-[#151b29] rounded-xl overflow-hidden">
      <CardHeader className="pb-2 border-b border-gray-200 dark:border-b dark:border-[#242e43]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle className="text-base text-gray-900 dark:text-white">{title}</CardTitle>
            
            <Badge variant="outline" className="ml-2 text-xs text-gray-600 border-gray-200 bg-transparent dark:text-gray-400 dark:border-[#242e43] dark:bg-transparent">
              {totalContributions} aktywności
            </Badge>
          </div>
          
          <YearSelector 
            year={year}
            onYearChange={onYearChange}
            minYear={2023}
            maxYear={currentYear}
          />
        </div>
      </CardHeader>
      
      <CardContent className="pt-4 pb-6">
        <ActivityChart
          monthlyData={monthlyData}
          maxValue={maxValue}
          year={year}
          currentYear={currentYear}
          currentMonth={currentMonth}
        />
      </CardContent>
    </Card>
  );
};

export default ActivityWidget;

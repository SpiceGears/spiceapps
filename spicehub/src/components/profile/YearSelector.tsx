"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface YearSelectorProps {
  year: number;
  onYearChange: (year: number) => void;
  minYear?: number;
  maxYear?: number;
}

export function YearSelector({ 
  year, 
  onYearChange, 
  minYear = 2023, 
  maxYear = new Date().getFullYear() 
}: YearSelectorProps) {
  return (
    <div className="flex items-center gap-1">
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-6 w-6 text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
        onClick={() => onYearChange(year - 1)}
        disabled={year <= minYear}
      >
        <ChevronLeft className="h-4 w-4 text-gray-700 dark:text-gray-100" />
      </Button>
      
      <span className="text-sm text-gray-900 dark:text-gray-100 font-medium min-w-8 text-center">{year}</span>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-6 w-6 text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
        onClick={() => onYearChange(year + 1)}
        disabled={year >= maxYear}
      >
        <ChevronRight className="h-4 w-4 text-gray-700 dark:text-gray-100" />
      </Button>
    </div>
  );
}

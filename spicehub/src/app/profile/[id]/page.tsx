"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Users, Hammer, Puzzle } from "lucide-react";
import { useState } from "react";
import ActivityWidget from "@/components/profile/ActivityWidget";
import { ProjectCard } from "@/components/profile/ProjectCard";

// Mock data for multiple years
const mockData = {
  workshops: {
    2023: {
      '2023-04-24': 2,
      '2023-05-15': 4,
      '2023-05-16': 2,
      '2023-07-10': 8,
    },
    2024: {
      '2024-02-18': 3,
      '2024-03-05': 1,
      '2024-06-22': 5,
      '2024-06-23': 2,
      '2024-10-15': 7,
      '2024-11-05': 6,
    },
    2025: {
      '2025-01-10': 1,
      '2025-01-15': 3,
      '2025-02-05': 3,
      '2025-03-10': 2,
      '2025-03-12': 4,
      '2025-04-15': 12,
      '2025-04-23': 8,
      '2025-04-24': 5,
    },
  },
  projects: {
    2023: {
      '2023-02-10': 1,
      '2023-08-22': 6,
      '2023-08-23': 2,
      '2023-11-30': 2,
    },
    2024: {
      '2024-01-15': 3,
      '2024-04-20': 5,
      '2024-07-01': 1,
      '2024-07-02': 2,
      '2024-09-15': 4,
    },
    2025: {
      '2025-01-05': 4,
      '2025-01-06': 2,
      '2025-02-15': 7,
      '2025-04-20': 1,
      '2025-04-22': 3,
    },
  }
};

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

export default function Profile() {
  const [workshopYear, setWorkshopYear] = useState(2025);
  const [projectYear, setProjectYear] = useState(2025);

  const userData = {
    firstName: "Jan",
    lastName: "Kowalski",
  }
  
  // Get data for the selected years
  const workshopData = mockData.workshops[workshopYear as keyof typeof mockData.workshops] || {};
  const projectData = mockData.projects[projectYear as keyof typeof mockData.projects] || {};
  // Format current date in Polish dd.MM.yy
  const formattedDate = new Date().toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: '2-digit' });

  return (
    <div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 flex flex-col gap-4">
          <Avatar className="h-48 w-48 md:h-64 md:w-64 border-4 border-gray-200 dark:border-gray-700">
              <AvatarFallback className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white text-6xl" />
              <AvatarImage
                src={`https://ui-avatars.com/api/?name=${userData.firstName}+${userData.lastName}&background=random&color=fff`}
                alt={`${userData.firstName} ${userData.lastName}`}
                className="h-full w-full object-cover"
              />
          </Avatar>

          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Jan Kowalski</h1>
          </div>

          <hr className="border-gray-200 dark:border-gray-700 my-4" />
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-100">
            <h2 className="text-lg font-semibold">Osiągnięcia</h2>
          </div>
          
        </div>

        <div className="md:col-span-3 flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Popularne projekty</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ProjectCard
                name="jakiś tam projekt"
                description="jakiś tam opis"
                url="#"
              />
              <ProjectCard
                name="test"
                description="test"
                url="#"
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Aktywność</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Workshop activity graph */}
              <ActivityWidget 
                title="Aktywność warsztatowa"
                icon={<Hammer className="h-4 w-4 text-gray-400" />}
                year={workshopYear}
                onYearChange={setWorkshopYear}
                data={workshopData}
              />
              
              {/* Project activity graph */}
              <ActivityWidget 
                title="Aktywność projektowa" 
                icon={<Puzzle className="h-4 w-4 text-gray-400" />}
                year={projectYear}
                onYearChange={setProjectYear}
                data={projectData}
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Aktywność wpisów</h2>
            <div className="border-l-2 border-gray-200 dark:border-gray-700 pl-6 relative">
              <div className="mb-6 relative">
                <p className="text-sm mb-1 text-gray-900 dark:text-white">{formattedDate}</p>
                <p className="text-sm mb-1 text-gray-600 dark:text-gray-400">Stworzonych 5 wpisów w 1 projekcie</p>
                <div className="h-2 w-1/3 bg-emerald-600 dark:bg-emerald-500 rounded"></div>
                <div className="mt-1">
                  <a href="#" className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-100 hover:underline">
                    test
                  </a>
                  <span className="text-xs text-gray-600 dark:text-gray-400"> 5 wpisów</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

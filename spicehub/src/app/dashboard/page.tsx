"use client";

import SeasonCard from "@/components/widgets/Season";
import WorkshopCard from "@/components/widgets/Workshop";
import Spicelab from "@/components/widgets/Spicelab"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white pb-10">
      {/* Header with date */}
      <div className="w-full bg-gray-100 dark:bg-gray-800 py-6 mb-6 shadow-md rounded-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-xl font-medium text-gray-700 dark:text-gray-400">
            {new Date().toLocaleDateString('pl-PL', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h1>
        </div>
      </div>
      
      {/* Dashboard content */}
      <div className="container mx-auto px-4">
        
        {/* Widgets container */}
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Workshop widget */}
            <WorkshopCard
              title="Warsztat"
              status="Otwarty"
              participants={12}
              time="10:00"
            />
          
          {/* Season widget */}
            <SeasonCard isOffseason />

            <Spicelab />
        </div>
      </div>
    </div>
  );
}

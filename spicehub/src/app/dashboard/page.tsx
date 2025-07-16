"use client";

import SeasonCard from "@/components/widgets/Season";
import WorkshopCard from "@/components/widgets/Workshop";
import Spicelab from "@/components/widgets/Spicelab"
import Welcome from "@/components/dashboard/Welcome";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white pb-10">
      {/* Header with date */}
      <Welcome />

      {/* Dashboard content */}
      <div className="container mx-auto px-4">

        {/* Widgets container */}
        <div className="space-y-6 max-w-4xl mx-auto">

          {/* Season widget */}
          <SeasonCard
            program="First Global Challenge"
            seasonName="Eco Equilibrium"
            seasonYear={2025}
            kickoffDate="2025-10-29"
            seasonUrl="https://first.global/fgc/"
            
          />

          <Spicelab />
        </div>
      </div>
    </div>
  );
}

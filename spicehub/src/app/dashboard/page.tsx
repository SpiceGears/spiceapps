"use client";

import WorkshopCard from "@/components/widgets/Workshop";

export default function Dashboard() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white py-10">
      {/* Top section with text - keeping the same top margin */}
      <div className="w-full max-w-5xl px-4 mb-2 flex justify-center mt-16">
        <h1 className="text-3xl font-bold">
          {new Date().toLocaleDateString('pl-PL', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </h1>
      </div>

      <WorkshopCard
        title="Warsztat"
        status="Otwarty"
        participants={12}
        time="10:00" />
    </div>
  );
}

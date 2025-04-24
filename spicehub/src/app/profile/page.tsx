import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, GitCommitVertical } from "lucide-react";
import { format, subDays } from 'date-fns';

interface ProjectCardProps {
  name: string;
  description?: string;
  language?: string;
  isFork?: boolean;
  forkSource?: string;
  url: string;
}

interface ContributionGraphProps {
    contributionData: Record<string, number>;
}

const mockContributionData = {
  '2025-04-24': 5,
  '2025-04-23': 8,
  '2025-04-22': 3,
  '2025-04-20': 1,
  '2025-04-15': 12,
  '2025-03-10': 2,
  '2024-11-05': 6,
  '2024-07-01': 1,
};

const getContributionColorClass = (count: number) : string => {
  if (count <= 0) {
    return 'bg-gray-700';
  } else if (count <= 2) {
    return 'bg-emerald-950';
  } else if (count <= 5) {
    return 'bg-emerald-800';
  } else if (count <= 9) {
    return 'bg-emerald-600';
  } else {
    return 'bg-emerald-400';
  }
};

const ContributionGraphPlaceholder = ({ contributionData }: ContributionGraphProps) => {
  const weeks = 52;
  const days = 7;
  const totalSquares = days * weeks;
  const endDate = new Date();

  return (
    <div className="border border-gray-700 rounded-md p-4 bg-gray-800 text-white overflow-x-auto">
      <div className="flex justify-between text-xs text-gray-400 mb-1 px-[20px]">
        <span>Kwi</span> <span>Maj</span> <span>Cze</span> <span>Lip</span>{' '}
        <span>Sie</span> <span>Wrz</span> <span>Paź</span> <span>Lis</span>{' '}
        <span>Gru</span> <span>Sty</span> <span>Lut</span> <span>Mar</span>
      </div>

      <div className="flex gap-2">
        <div className="flex flex-col justify-between text-xs text-gray-400 pt-1 pb-1 pr-1">
          <span></span> <span>Pon</span> <span></span> <span>Śro</span>{' '}
          <span></span> <span>Pią</span> <span></span>
        </div>

        <div className={`grid grid-flow-col grid-rows-7 gap-1`}>
          {[...Array(totalSquares)].map((_, i) => {
            const daysToSubtract = totalSquares - 1 - i;
            const currentDate = subDays(endDate, daysToSubtract);
            const formattedDate = format(currentDate, 'yyyy-MM-dd');
            const count = contributionData[formattedDate] || 0;
            const bgColorClass = getContributionColorClass(count);
            const tooltip = `${count} kontrybucji w dniu ${formattedDate}`;

            return (
              <div
                key={`square-${i}-${formattedDate}`}
                className={`h-3 w-3 ${bgColorClass} rounded-sm`}
                title={tooltip}
              ></div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          Mniej
          <div className="h-3 w-3 bg-gray-700 rounded-sm"></div>
          <div className="h-3 w-3 bg-emerald-950 rounded-sm"></div>
          <div className="h-3 w-3 bg-emerald-800 rounded-sm"></div>
          <div className="h-3 w-3 bg-emerald-600 rounded-sm"></div>
          <div className="h-3 w-3 bg-emerald-400 rounded-sm"></div>
          Więcej
        </div>
      </div>
    </div>
  );
};

const ProjectCard = ({ name, description, url }: ProjectCardProps) => (
  <Card className="border-gray-700 bg-gray-800 hover:border-gray-600 transition-all">
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <CardTitle className="text-lg">
          <a href={url} className="text-blue-400 hover:underline">
            {name}
          </a>
        </CardTitle>
        <Badge variant="outline" className="border-gray-700 text-gray-400">Programiści</Badge>
      </div>
      {description && (
        <CardDescription className="text-gray-400 mt-1">
          {description}
        </CardDescription>
      )}
    </CardHeader>
  </Card>
);

export default function Profile() {
  const currentYear = 2025;
  const contributionData = mockContributionData;

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 flex flex-col gap-4">
          <Avatar className="h-48 w-48 md:h-64 md:w-64 border-4 border-gray-700">
            <AvatarFallback className="bg-gray-800 text-white">JK</AvatarFallback>
          </Avatar>

          <div>
            <h1 className="text-2xl font-semibold text-white">Jan Kowalski</h1>
          </div>

          <Button variant="default" className="w-full">Follow</Button>

          <div className="flex items-center gap-4 text-sm text-gray-400">
            <a href="#" className="flex items-center gap-1 hover:text-gray-100">
              <Users className="h-4 w-4" />
              <span className="font-semibold text-white">0</span> Obserwujących
            </a>
            <span>·</span>
            <a href="#" className="hover:text-gray-100">
              <span className="font-semibold text-white">4</span> Obserwuje
            </a>
          </div>
        </div>

        <div className="md:col-span-3 flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-3 text-white">Popularne projekty</h2>
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
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold text-white">
                15 dni w warsztacie w ostatnim roku
              </h2>
              <div className="flex gap-1">
                {[2025].map((year) => (
                  <Button
                    key={year}
                    variant={year === currentYear ? "default" : "outline"}
                    size="sm"
                    className={year !== currentYear ? "text-gray-400 border-gray-700" : ""}
                  >
                    {year}
                  </Button>
                ))}
              </div>
            </div>
            <ContributionGraphPlaceholder contributionData={contributionData} />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 text-white">Aktywność wpisów</h2>
            <div className="border-l-2 border-gray-700 pl-6 relative">
              <div className="mb-6 relative">
                <div className="absolute -left-[33px] top-1 bg-gray-900 p-1 rounded-full border border-gray-700">
                  <GitCommitVertical className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-sm mb-1 text-white">Kwiecień 2025</p>
                <p className="text-sm mb-1 text-gray-400">
                  Stworzonych 5 wspisów w 1 projekcie
                </p>
                <div className="h-2 w-1/3 bg-emerald-600 rounded"></div>
                <div className="mt-1">
                  <a href="#" className="text-xs text-gray-400 hover:text-gray-100 hover:underline">
                    test
                  </a>
                  <span className="text-xs text-gray-400"> 5 wspisów</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full mt-4 border-gray-700 hover:bg-gray-700 hover:text-gray-100"
              >
                Pokaż więcej aktywności
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProjectCardProps {
  name: string;
  description?: string;
  url: string;
}

export function ProjectCard({ name, description, url }: ProjectCardProps) {
  return (
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
}

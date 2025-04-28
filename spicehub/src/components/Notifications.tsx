import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Notifications() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 rounded-full transition-all duration-200 p-4"
        >
          <Bell size={100} className="w-8 h-8 text-gray-700 dark:text-gray-100" />
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
        align="end"
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Notifications</h4>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Brak nowych powiadomień</p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
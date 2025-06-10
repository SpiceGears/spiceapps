'use client';

import { Plus, HardDrive, Clock, Star, Trash2, Cloud } from 'lucide-react';
import { SidebarProps } from '@/types/components';

interface SidebarComponentProps {
  onCreateFolder: () => void;
}

export default function Sidebar({ onCreateFolder }: SidebarComponentProps) {
  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 
                   dark:border-gray-700 flex flex-col">
      <div className="p-4">
        <button
          onClick={onCreateFolder}
          className="flex items-center gap-3 bg-white dark:bg-gray-800 
                   border border-gray-300 dark:border-gray-600 rounded-full 
                   px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 
                   transition-colors shadow-sm w-full justify-start 
                   text-black dark:text-white"
        >
          <Plus size={20} />
          <span>New</span>
        </button>
      </div>

      <nav className="flex-1 px-3">
        <div className="space-y-1">
          <SidebarItem icon={HardDrive} label="My Drive" active />
          <SidebarItem icon={Cloud} label="Shared with me" />
          <SidebarItem icon={Clock} label="Recent" />
          <SidebarItem icon={Star} label="Starred" />
          <SidebarItem icon={Trash2} label="Trash" />
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <div className="mb-2">Storage</div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
            <div className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full w-1/4"></div>
          </div>
          <div className="text-xs">2.5 GB of 15 GB used</div>
        </div>
      </div>
    </div>
  );
}

interface SidebarItemProps {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  active?: boolean;
}

function SidebarItem({ icon: Icon, label, active , onCreateFolder}: SidebarItemProps) {
  return (
    <button
      className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg 
                 text-left hover:bg-gray-100 dark:hover:bg-gray-800 
                 transition-colors ${
                   active 
                     ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                     : 'text-gray-700 dark:text-gray-300'
                 }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );
}
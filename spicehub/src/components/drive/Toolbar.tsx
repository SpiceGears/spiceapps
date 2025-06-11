'use client';

import { 
  Grid3X3, 
  List, 
  Upload, 
  Search, 
  Settings, 
  Trash2, 
  Edit,
  Home
} from 'lucide-react';
import { ViewMode } from '@/types';

interface ToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  selectedCount: number;
  onAction: (action: string, fileIds: string[]) => void;
  selectedFiles: string[];
  currentPath: string;
}

export default function Toolbar({
  viewMode,
  onViewModeChange,
  selectedCount,
  onAction,
  selectedFiles,
  currentPath,
}: ToolbarProps) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 
                   bg-white dark:bg-gray-900">
      {/* Breadcrumb */}
      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 text-sm text-gray-600 
                       dark:text-gray-400">
          <Home size={16} />
          <span className="text-black dark:text-white">Drive</span>
          <span className="font-medium text-black dark:text-white">
            {currentPath}
          </span>
        </div>
      </div>

      {/* Main toolbar */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          {selectedCount > 0 ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedCount} selected
              </span>
              <button
                onClick={() => onAction('rename', selectedFiles)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 
                         rounded-lg text-black dark:text-white"
                title="Rename"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => onAction('delete', selectedFiles)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 
                         rounded-lg text-black dark:text-white"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ) : (
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 
                             dark:bg-blue-500 text-white rounded-lg 
                             hover:bg-blue-700 dark:hover:bg-blue-600">
              <Upload size={16} />
              Upload
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 
                         rounded-lg px-3 py-2">
            <Search size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search in Drive"
              className="bg-transparent outline-none text-sm w-64 
                       text-black dark:text-white placeholder-gray-500 
                       dark:placeholder-gray-400"
            />
          </div>

          {/* View mode toggle */}
          <div className="flex items-center border border-gray-300 
                         dark:border-gray-600 rounded-lg">
            <button
              onClick={() => onViewModeChange({ type: 'grid' })}
              className={`p-2 text-black dark:text-white ${
                viewMode.type === 'grid' 
                  ? 'bg-gray-100 dark:bg-gray-700' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => onViewModeChange({ type: 'list' })}
              className={`p-2 text-black dark:text-white ${
                viewMode.type === 'list' 
                  ? 'bg-gray-100 dark:bg-gray-700' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <List size={16} />
            </button>
          </div>

          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 
                           rounded-lg text-black dark:text-white">
            <Settings size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
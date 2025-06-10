'use client';

import { FileItem } from '@/types';
import FileIcon from './FileIcon';

interface FileGridProps {
  files: FileItem[];
  selectedFiles: string[];
  onFileSelect: (fileId: string, isMultiple?: boolean) => void;
  onFileAction: (action: string, fileIds: string[]) => void;
}

export default function FileGrid({
  files,
  selectedFiles,
  onFileSelect,
}: FileGridProps) {
  return (
    <div className="grid grid-cols-6 gap-4">
      {files.map(file => (
        <div
          key={file.id}
          className={`p-4 rounded-lg border cursor-pointer transition-all 
                     hover:bg-gray-50 dark:hover:bg-gray-800 ${
                       selectedFiles.includes(file.id)
                         ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                         : 'border-gray-200 dark:border-gray-700'
                     } bg-white dark:bg-gray-900`}
          onClick={e => onFileSelect(file.id, e.ctrlKey || e.metaKey)}
        >
          <div className="flex flex-col items-center">
            <FileIcon file={file} size="large" />
            <div className="mt-2 text-center">
              <div className="text-sm font-medium text-black dark:text-white 
                            truncate w-full">
                {file.name}
              </div>
              {file.size && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formatFileSize(file.size)}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function formatFileSize(bytes: number): string {
  const sizes = ['B', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 B';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${Math.round(bytes / Math.pow(1024, i) * 10) / 10} ${sizes[i]}`;
}
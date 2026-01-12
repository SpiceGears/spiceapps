'use client';

import FileIcon from './FileIcon';
import { useUserById } from '@/hooks/useUserById';
import { SFile } from '@/models/SFile';

interface FileListProps {
  files: SFile[];
  selectedFiles: string[];
  onFileSelect: (fileId: string, isMultiple?: boolean) => void;
  onFileAction: (action: string, fileIds: string[]) => void;
}

export default function FileList({
  files,
  selectedFiles,
  onFileSelect,
}: FileListProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border 
                   border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-12 gap-4 p-3 bg-gray-50 dark:bg-gray-800 
                     text-sm font-medium text-gray-700 dark:text-gray-300 
                     border-b border-gray-200 dark:border-gray-700">
        <div className="col-span-6">Name</div>
        <div className="col-span-2">Owner</div>
        <div className="col-span-2">Last modified</div>
        <div className="col-span-2">File size</div>
      </div>

      {files.map(file => {
        const userData = useUserById(file.owner);
        return (
          <div
            key={file.id}
            className={`grid grid-cols-12 gap-4 p-3 hover:bg-gray-50 
                       dark:hover:bg-gray-800 cursor-pointer border-b 
                       border-gray-100 dark:border-gray-800 transition-colors ${
                       selectedFiles.includes(file.id) 
                         ? 'bg-blue-50 dark:bg-blue-900/20' 
                         : ''
                     }`}
          onClick={e => onFileSelect(file.id, e.metaKey || e.ctrlKey)}
        >
          <div className="col-span-6 flex items-center gap-3">
            <FileIcon isFolder={false} file={file.name} size="small" />
            <span className="text-sm text-black dark:text-white">
              {file.name}
            </span>
          </div>
          <div className="col-span-2 text-sm text-gray-600 dark:text-gray-400">
            {userData.user?.firstName} {userData.user?.lastName}
          </div>
          {/* <div className="col-span-2 text-sm text-gray-600 dark:text-gray-400">
            {file.modifiedAt.toLocaleDateString()}
          </div> */}
          {/* <div className="col-span-2 text-sm text-gray-600 dark:text-gray-400">
            // {file.size ? formatFileSize(file.size) : '—'}
          </div> */}
        </div>
        );
      })}
    </div>
  );
}

function formatFileSize(bytes: number): string {
  const sizes = ['B', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 B';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${Math.round(bytes / Math.pow(1024, i) * 10) / 10} ${sizes[i]}`;
}
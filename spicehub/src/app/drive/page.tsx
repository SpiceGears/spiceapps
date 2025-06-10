'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Toolbar from '@/components/drive/Toolbar';
import FileGrid from '@/components/drive/FileGrid';
import FileList from '@/components/drive/FileList';
import { FileItem, ViewMode } from '@/types';

const mockFiles: FileItem[] = [
  {
    id: '1',
    name: 'Documents',
    type: 'folder',
    modifiedAt: new Date('2024-12-01'),
    owner: 'me',
  },
  {
    id: '2',
    name: 'Photos',
    type: 'folder',
    modifiedAt: new Date('2024-11-28'),
    owner: 'me',
  },
  {
    id: '3',
    name: 'presentation.pptx',
    type: 'file',
    size: 2048576,
    modifiedAt: new Date('2024-12-05'),
    owner: 'me',
    mimeType: 'application/vnd.ms-powerpoint',
  },
  {
    id: '4',
    name: 'report.pdf',
    type: 'file',
    size: 1536000,
    modifiedAt: new Date('2024-12-03'),
    owner: 'me',
    mimeType: 'application/pdf',
  },
  {
    id: '5',
    name: 'image.jpg',
    type: 'file',
    size: 3145728,
    modifiedAt: new Date('2024-12-02'),
    owner: 'me',
    mimeType: 'image/jpeg',
  },
];

export default function HomePage() {
  const [files, setFiles] = useState<FileItem[]>(mockFiles);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>({ type: 'grid' });
  const [currentPath, setCurrentPath] = useState('My Drive');

  const handleFileSelect = (fileId: string, isMultiple: boolean = false) => {
    if (isMultiple) {
      setSelectedFiles(prev =>
        prev.includes(fileId)
          ? prev.filter(id => id !== fileId)
          : [...prev, fileId]
      );
    } else {
      setSelectedFiles([fileId]);
    }
  };

  const handleFileAction = (action: string, fileIds: string[]) => {
    switch (action) {
      case 'delete':
        setFiles(prev => prev.filter(file => !fileIds.includes(file.id)));
        setSelectedFiles([]);
        break;
      case 'rename':
        // Handle rename logic
        break;
      default:
        break;
    }
  };

  const handleCreateFolder = () => {
    const newFolder: FileItem = {
      id: Date.now().toString(),
      name: 'New Folder',
      type: 'folder',
      modifiedAt: new Date(),
      owner: 'me',
    };
    setFiles(prev => [newFolder, ...prev]);
  };

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      <Sidebar onCreateFolder={handleCreateFolder} />
      
      <div className="flex-1 flex flex-col">
        <Toolbar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          selectedCount={selectedFiles.length}
          onAction={handleFileAction}
          selectedFiles={selectedFiles}
          currentPath={currentPath}
        />
        
        <div className="flex-1 overflow-auto p-4 bg-white dark:bg-gray-900">
          {viewMode.type === 'grid' ? (
            <FileGrid
              files={files}
              selectedFiles={selectedFiles}
              onFileSelect={handleFileSelect}
              onFileAction={handleFileAction}
            />
          ) : (
            <FileList
              files={files}
              selectedFiles={selectedFiles}
              onFileSelect={handleFileSelect}
              onFileAction={handleFileAction}
            />
          )}
        </div>
      </div>
    </div>
  );
}
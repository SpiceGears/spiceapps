'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Toolbar from '@/components/drive/Toolbar';
import FileGrid from '@/components/drive/FileGrid';
import FileList from '@/components/drive/FileList';
import { FileItem, ViewMode } from '@/types';
import { SFile } from '@/models/SFile';
import { getBackendUrl } from '../serveractions/backend-url';
import { getCookie } from 'typescript-cookie';

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
  const [files, setFiles] = useState<SFile[]>(new Array<SFile>());
  const [folders, setFolders] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>({ type: 'grid' });
  const [currentPath, setCurrentPath] = useState('/');

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      const backend = await getBackendUrl();
      if (!backend) throw new Error("No backend URL set");
      const accessToken = getCookie("accessToken");
      if (!accessToken) throw new Error("No access token");

      const folderResp = await fetch(`${backend}/files/folders`,
        {
          method: 'GET',
          headers:
          {
            Authorization: accessToken,
            FolderPath: currentPath,
          }
        })
      if (!folderResp.ok) {
        let er = await folderResp.text();
        throw new Error(er);
      }
      let dirs = await folderResp.json() as string[];
      
      const filesResp = await fetch(`${backend}/files/folders/getFiles`,
        {
          method: 'GET',
          headers:
          {
            Authorization: accessToken,
            FolderPath: currentPath,
          }
        })
      if (!folderResp.ok) {
        let er = await folderResp.text();
        throw new Error(er);
      }
      let files = await filesResp.json() as SFile[];

      setFolders(dirs)
      setFiles(files);
      console.log(dirs);
      console.log(files);
      setLoading(false);


    }


    try {
      setLoading(true);
      fetchFiles();
    }
    catch (e: any) {
      console.error("Fetch failed", e);
      setError(e.message)
    }

    return () => {
    }
  }, [currentPath]);


const handleFileSelect = (fileId: string, isMultiple: boolean = false) => {
  setSelectedFiles(prev => {
    if (isMultiple) {
      // Toggle selection for multi-select (ctrl/cmd-click)
      return prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId];
    } else {
      // Single-click: if this is already the only selection, clear it
      if (prev.length === 1 && prev[0] === fileId) {
        return [];
      }
      // Otherwise select only this file
      return [fileId];
    }
  });
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
  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">

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
          {!loading && (
  <>
    {viewMode.type === 'grid' ? (
      <FileGrid
        files={files}
        folders={folders}
        selectedFiles={selectedFiles}
        onFileSelect={handleFileSelect}
        onFileAction={handleFileAction}
      />
    ) : (
      <>
        <FileList
          files={files}
          selectedFiles={selectedFiles}
          onFileSelect={handleFileSelect}
          onFileAction={handleFileAction}
        />
      </>
    )}
  </>
)} {loading && <>
<h1 className='text-2xl'>Loading...</h1>
</>}

        </div>
      </div>
    </div>
  );
}
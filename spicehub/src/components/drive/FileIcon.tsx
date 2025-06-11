'use client';

import { 
  Folder, 
  FileText, 
  Image, 
  FileType, 
  Film,
  Music,
  Archive
} from 'lucide-react';
import { FileItem } from '@/types';
import { SFile } from '@/models/SFile';

interface FileIconProps {
  file: string;
  isFolder: boolean;
  size?: 'small' | 'large';
}

export default function FileIcon({ file, isFolder, size = 'small' }: FileIconProps) {
  const iconSize = size === 'large' ? 48 : 20;
  
  if (isFolder) {
    return (
      <Folder 
        size={iconSize} 
        className="text-blue-500 dark:text-blue-400 fill-current" 
      />
    );
  }

  const getFileIcon = (mimeType?: string) => {
    if (!mimeType) return FileText;
    
    if (mimeType.endsWith('.jpg') || 
    mimeType.endsWith('.png') || 
    mimeType.endsWith('.jpeg')) return Image;
    if (mimeType.endsWith('.mp4') ||
  mimeType.endsWith('.mkv')
|| mimeType.endsWith('.avi')) return Film;
    if (mimeType.startsWith('.mp3') || 
  mimeType.endsWith('.wav') ||
mimeType.endsWith('.ogg')) return Music;
    if (mimeType.endsWith('pdf')) return FileType;
    if (mimeType.endsWith('zip') || mimeType.endsWith('rar')) return Archive;
    
    return FileText;
  };

  const Icon = getFileIcon(file);
  
  return (
    <Icon 
      size={iconSize} 
      className="text-gray-600 dark:text-gray-400" 
    />
  );
}
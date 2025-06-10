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

interface FileIconProps {
  file: FileItem;
  size?: 'small' | 'large';
}

export default function FileIcon({ file, size = 'small' }: FileIconProps) {
  const iconSize = size === 'large' ? 48 : 20;
  
  if (file.type === 'folder') {
    return (
      <Folder 
        size={iconSize} 
        className="text-blue-500 dark:text-blue-400 fill-current" 
      />
    );
  }

  const getFileIcon = (mimeType?: string) => {
    if (!mimeType) return FileText;
    
    if (mimeType.startsWith('image/')) return Image;
    if (mimeType.startsWith('video/')) return Film;
    if (mimeType.startsWith('audio/')) return Music;
    if (mimeType.includes('pdf')) return FileType;
    if (mimeType.includes('zip') || mimeType.includes('rar')) return Archive;
    
    return FileText;
  };

  const Icon = getFileIcon(file.mimeType);
  
  return (
    <Icon 
      size={iconSize} 
      className="text-gray-600 dark:text-gray-400" 
    />
  );
}
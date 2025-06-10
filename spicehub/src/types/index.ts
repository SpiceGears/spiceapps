export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  modifiedAt: Date;
  owner: string;
  mimeType?: string;
  thumbnail?: string;
}

export interface ViewMode {
  type: 'grid' | 'list';
}
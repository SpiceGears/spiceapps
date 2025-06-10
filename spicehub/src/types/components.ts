export interface SidebarProps {
  onCreateFolder: () => void;
}

export interface ToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  selectedCount: number;
  onAction: (action: string, fileIds: string[]) => void;
  selectedFiles: string[];
  currentPath: string;
}

export interface FileGridProps {
  files: FileItem[];
  selectedFiles: string[];
  onFileSelect: (fileId: string, isMultiple?: boolean) => void;
  onFileAction: (action: string, fileIds: string[]) => void;
}

export interface FileListProps {
  files: FileItem[];
  selectedFiles: string[];
  onFileSelect: (fileId: string, isMultiple?: boolean) => void;
  onFileAction: (action: string, fileIds: string[]) => void;
}
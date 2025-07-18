import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import {
  StatusUpdateType,
  ProjectStatus,
  ProjectUpdateEntry,
} from "@/models/Project"
import { UserInfo } from "@/models/User"
import { 
  FileTextIcon, 
  XIcon, 
  FileIcon, 
  Music, 
  Download,
  Loader2,
  ExternalLink
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { pl } from "date-fns/locale"
import { useState, useEffect } from "react"
import { getBackendUrl } from "@/app/serveractions/backend-url"
import { getCookie } from "typescript-cookie"
import { toast } from "sonner"

const typeLabels: Record<StatusUpdateType, string> = {
  [StatusUpdateType.ProjectCreated]: "Utworzenie projektu",
  [StatusUpdateType.ProjectStatus]: "Aktualizacja statusu",
  [StatusUpdateType.SectionAdd]: "Dodanie sekcji",
  [StatusUpdateType.SectionEdit]: "Edycja sekcji",
  [StatusUpdateType.SectionDelete]: "Usunięcie sekcji",
  [StatusUpdateType.TaskAdd]: "Dodanie zadania",
  [StatusUpdateType.TaskEdit]: "Edycja zadania",
  [StatusUpdateType.TaskDelete]: "Usunięcie zadania",
  [StatusUpdateType.TaskStatusUpdate]: "Zmiana statusu zadania",
  [StatusUpdateType.TaskMoveToSection]: "Przeniesienie zadania",
}

const statusLabels: Record<ProjectStatus, string> = {
  [ProjectStatus.Healthy]: "Na dobrej drodze",
  [ProjectStatus.Endangered]: "Zagrożony",
  [ProjectStatus.Delayed]: "Opóźniony",
  [ProjectStatus.Abandoned]: "Porzucony",
  [ProjectStatus.Finished]: "Zakończony",
}

const statusClasses: Record<ProjectStatus, string> = {
  [ProjectStatus.Healthy]: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  [ProjectStatus.Endangered]: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  [ProjectStatus.Delayed]: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  [ProjectStatus.Abandoned]: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  [ProjectStatus.Finished]: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
}

export interface ProjectStatusPreviewProps {
  isOpen: boolean
  onClose: () => void
  update: ProjectUpdateEntry
  user: UserInfo
}

interface FilePreview {
  id: string
  name: string
  url: string | null
  loading: boolean
  error: boolean
}

// Get file info from API
async function getFileInfo(id: string): Promise<{ name: string; url: string } | null> {
  try {
    const backend = await getBackendUrl();
    if (!backend) throw new Error("No backend");
    const token = getCookie("accessToken");
    if (!token) throw new Error("No token");
    
    // First get file info
    const infoRes = await fetch(`${backend}/files/${id}`, {
      headers: { Authorization: token },
    });
    
    if (!infoRes.ok) throw new Error("Failed to get file info");
    const fileInfo = await infoRes.json();
    
    // Then get file blob
    const blobRes = await fetch(`${backend}/files/download/${id}`, {
      headers: { Authorization: token },
    });
    
    if (!blobRes.ok) throw new Error("Failed to download file");
    const blob = await blobRes.blob();
    const url = URL.createObjectURL(blob);
    
    return {
      name: fileInfo.name || `file-${id}`,
      url: url
    };
  } catch (error) {
    console.error("Error getting file info:", error);
    return null;
  }
}

function getFileType(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  if (["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"].includes(ext)) return "image";
  if (["mp4", "avi", "mov", "wmv", "flv", "webm", "mkv"].includes(ext)) return "video";
  if (["mp3", "wav", "ogg", "flac", "aac", "m4a"].includes(ext)) return "audio";
  if (ext === "pdf") return "pdf";
  if (["doc", "docx"].includes(ext)) return "docx";
  return "other";
}

const SingleFilePreview = ({ file }: { file: FilePreview }) => {
  const type = getFileType(file.name);

  const handleDownload = () => {
    if (!file.url) return;
    const a = document.createElement("a");
    a.href = file.url;
    a.download = file.name;
    a.click();
  };

  const getFileIcon = () => {
    switch (type) {
      case "pdf":
        return <FileTextIcon className="w-8 h-8 text-red-500" />;
      case "docx":
        return <FileTextIcon className="w-8 h-8 text-blue-500" />;
      case "audio":
        return <Music className="w-8 h-8 text-purple-500" />;
      default:
        return <FileIcon className="w-8 h-8 text-gray-400" />;
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          {file.loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
          ) : file.error || !file.url ? (
            <FileIcon className="w-5 h-5 text-gray-500" />
          ) : (
            <div className="w-5 h-5 flex items-center justify-center">
              {getFileIcon()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {file.name}
            </span>
          </div>
        </div>
        {file.url && (
          <button
            onClick={handleDownload}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Pobierz plik"
          >
            <Download className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
        )}
      </div>

      {/* Preview area */}
      <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 overflow-hidden">
        {file.loading ? (
          <div className="h-32 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
          </div>
        ) : file.error || !file.url ? (
          <div className="h-32 flex items-center justify-center">
            <div className="text-center">
              <FileIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Nie udało się załadować pliku
              </span>
            </div>
          </div>
        ) : type === "image" ? (
          <img
            src={file.url}
            alt={file.name}
            className="w-full h-32 object-cover"
          />
        ) : type === "video" ? (
          <video
            controls
            className="w-full h-32 object-cover"
            preload="metadata"
          >
            <source src={file.url} />
          </video>
        ) : type === "audio" ? (
          <div className="p-4 text-center">
            <Music className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <audio controls className="w-full">
              <source src={file.url} />
            </audio>
          </div>
        ) : type === "pdf" ? (
          <div className="h-32 flex items-center justify-center">
            <div className="text-center">
              <FileTextIcon className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center justify-center gap-1"
              >
                Otwórz PDF <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ) : type === "docx" ? (
          <div className="h-32 flex items-center justify-center">
            <div className="text-center">
              <FileTextIcon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <span className="text-sm text-gray-600 dark:text-gray-300 mb-2 block">
                Dokument Word
              </span>
              <button
                onClick={handleDownload}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center justify-center gap-1"
              >
                Pobierz <Download className="w-3 h-3" />
              </button>
            </div>
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center">
            <div className="text-center">
              <FileIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <span className="text-sm text-gray-500 dark:text-gray-400 mb-2 block">
                Plik
              </span>
              <button
                onClick={handleDownload}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center justify-center gap-1"
              >
                Pobierz <Download className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function ProjectStatusPreview({
  isOpen,
  onClose,
  update,
  user,
}: ProjectStatusPreviewProps) {
  const [filePreviews, setFilePreviews] = useState<FilePreview[]>([]);

  // Load file previews when dialog opens and it's a status update
  useEffect(() => {
    if (isOpen && update.type === StatusUpdateType.ProjectStatus && update.linkedFiles.length > 0) {
      const loadFiles = async () => {
        const previews: FilePreview[] = update.linkedFiles.map(fileId => ({
          id: fileId,
          name: `Ładowanie...`,
          url: null,
          loading: true,
          error: false,
        }));

        setFilePreviews(previews);

        // Load each file info and URL
        for (const fileId of update.linkedFiles) {
          try {
            const fileInfo = await getFileInfo(fileId);
            
            setFilePreviews(prev => 
              prev.map(p => 
                p.id === fileId 
                  ? { 
                      ...p, 
                      name: fileInfo?.name || `file-${fileId}`,
                      url: fileInfo?.url || null, 
                      loading: false, 
                      error: !fileInfo 
                    }
                  : p
              )
            );
          } catch (error) {
            console.error("Error loading file:", error);
            setFilePreviews(prev => 
              prev.map(p => 
                p.id === fileId 
                  ? { ...p, name: `file-${fileId}`, url: null, loading: false, error: true }
                  : p
              )
            );
          }
        }
      };

      loadFiles();
    } else {
      setFilePreviews([]);
    }
  }, [isOpen, update.type, update.linkedFiles]);

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      filePreviews.forEach(file => {
        if (file.url) {
          URL.revokeObjectURL(file.url);
        }
      });
    };
  }, [filePreviews]);

  const date = new Date(update.happenedAt)
  const formatted = date.toLocaleString("pl-PL", {
    dateStyle: "medium",
    timeStyle: "short",
  })
  const ago = formatDistanceToNow(date, { locale: pl, addSuffix: true })
  const typeText = typeLabels[update.type] ?? "Nieznany typ"
  const initials = `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileTextIcon className="h-5 w-5 text-blue-600 dark:text-blue-500" />
              <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {typeText}
              </DialogTitle>
            </div>
          </div>
          
          {/* Replace DialogDescription with a plain div */}
          <div className="mt-2 flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-xs font-medium text-gray-700 dark:text-gray-200">
                {initials}
              </span>
              <span className="text-gray-800 dark:text-gray-100">
                {user.firstName} {user.lastName}
              </span>
            </div>
            <span className="text-gray-500 dark:text-gray-400">•</span>
            <time
              dateTime={date.toISOString()}
              title={formatted}
              className="text-gray-600 dark:text-gray-400"
            >
              {formatted} ({ago})
            </time>
          </div>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          <div className="text-gray-800 dark:text-gray-200 leading-relaxed">
            {update.summary}
          </div>
          
          {update.type === StatusUpdateType.ProjectStatus && (
            <span
              className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                statusClasses[update.status]
              }`}
            >
              {statusLabels[update.status]}
            </span>
          )}
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="grid grid-cols-1 gap-y-4 text-sm">
              <div>
                <div className="font-medium text-gray-700 dark:text-gray-300">
                  Nazwa aktualizacji
                </div>
                <div className="mt-1 text-gray-900 dark:text-gray-100">
                  {update.name}
                </div>
              </div>
              
              <div>
                <div className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Załączniki
                </div>
                <div>
                  {update.type === StatusUpdateType.ProjectStatus && update.linkedFiles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filePreviews.map((file) => (
                        <SingleFilePreview key={file.id} file={file} />
                      ))}
                    </div>
                  ) : update.linkedFiles.length > 0 ? (
                    <div className="space-y-2">
                      {update.linkedFiles.map((fileId, i) => (
                        <div key={i} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                          <FileTextIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Plik {fileId}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 dark:text-gray-400">
                      Brak załączników
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="mt-6">
          <button
            onClick={onClose}
            className="ml-auto rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Zamknij
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
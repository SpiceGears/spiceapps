import { getBackendUrl } from "@/app/serveractions/backend-url";
import {
  Loader2,
  Upload,
  File as FileIcon,
  FileText,
  Music,
  MoreVertical,
  Download,
  Trash,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { getCookie } from "typescript-cookie";
import { SFile, FilePerms } from "@/models/SFile";
import { Project } from "@/models/Project";

interface UploadingFile {
  file: File;
  status: "uploading" | "error";
}

export interface ProjectFileProps {
  project: Project;
}

interface FilePreviewProps {
  files: SFile[];
}

async function getFileUrl(id: string): Promise<string | undefined> {
  try {
    const backend = await getBackendUrl();
    if (!backend) throw new Error();
    const token = getCookie("accessToken");
    if (!token) throw new Error();
    const res = await fetch(`${backend}/files/download/${id}`, {
      headers: { Authorization: token },
    });
    if (!res.ok) throw new Error();
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } catch {
    toast.error("Błąd", { description: "Nie udało się pobrać pliku." });
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

const SingleFilePreview = ({ file }: { file: SFile }) => {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const u = await getFileUrl(file.id);
      if (u) setUrl(u);
      else setError(true);
      setLoading(false);
    })();
  }, [file.id]);

  const handleDownload = () => {
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
  };

  const type = getFileType(file.name);

  return (
    <div className="relative flex flex-col bg-white dark:bg-gray-800 
                    rounded-lg shadow-lg overflow-hidden group">
      {/* Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="absolute top-2 right-2 p-1 rounded-full 
                       bg-white dark:bg-gray-700 
                       opacity-0 group-hover:opacity-100 
                       transition"
          >
            <MoreVertical size={18} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={handleDownload}>
            <Download size={16} className="mr-2" />
            Pobierz
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => { }}>
            <Trash size={16} className="mr-2" />
            Usuń
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Preview pane */}
      <div className="h-80 bg-gray-100 dark:bg-gray-700 
                      flex items-center justify-center overflow-hidden">
        {loading ? (
          <Loader2 className="animate-spin text-gray-500" />
        ) : error || !url ? (
          <FileIcon size={48} className="text-gray-500" />
        ) : type === "image" ? (
          <img
            src={url}
            alt={file.name}
            className="object-cover w-full h-full"
          />
        ) : type === "video" ? (
          <video
            controls
            className="object-cover w-full h-full"
            preload="metadata"
          >
            <source src={url} />
          </video>
        ) : type === "audio" ? (
          <div className="flex flex-col items-center">
            <Music size={48} />
            <audio controls className="mt-2 w-full">
              <source src={url} />
            </audio>
          </div>
        ) : type === "pdf" ? (
          <div className="flex flex-col items-center">
            <FileText size={48} className="text-red-500" />
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="mt-2 text-sm text-blue-600 hover:underline"
            >
              Otwórz PDF
            </a>
          </div>
        ) : type === "docx" ? (
          <div className="flex flex-col items-center">
            <FileText size={48} className="text-blue-600" />
            <p className="mt-2 text-sm text-gray-900 dark:text-gray-100">
              Word Dokument
            </p>
            <button
              onClick={handleDownload}
              className="mt-2 text-sm text-blue-600 hover:underline"
            >
              Pobierz
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <FileIcon size={48} className="text-gray-500" />
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t 
                      border-gray-200 dark:border-gray-700">
        <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
          {file.name}
        </p>
        {file.description && (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 truncate">
            {file.description}
          </p>
        )}
      </div>
    </div>
  );
};

const FilePreview = ({ files }: FilePreviewProps) => {
  if (!files.length) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 
                    lg:grid-cols-3 xl:grid-cols-3 gap-8 mt-8">
      {files.map((f) => (
        <SingleFilePreview key={f.id} file={f} />
      ))}
    </div>
  );
};

export default function ProjectFile({ project }: ProjectFileProps) {
  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const [files, setFiles] = useState<SFile[]>([]);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

const fetchFiles = async () => {
  try {
    const backendUrl = await getBackendUrl();
    if (!backendUrl) throw new Error("No backend URL");

    const token = getCookie("accessToken") || "";
    const res = await fetch(
      `${backendUrl}/files/folders/getFiles`,
      {
        headers: {
          Authorization: token,
          FolderPath: `proj-${project.id}`,
        },
      }
    );

    // If your API returns 500 when no files:
    if (res.status === 500) {
      setFiles([]);
      return;
    }

    if (!res.ok) {
      // real errors
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Unknown error");
    }

    // 200 with a real payload (possibly an empty array)
    const files = await res.json();
    setFiles(files);
  } catch (e) {
    toast.error("Błąd", {
      description: "Nie udało się pobrać plików.",
    });
  }
};

  useEffect(() => {
    fetchFiles();
  }, [project.id]);

  const uploadFile = async (file: File) => {
    setUploading((u) => [...u, { file, status: "uploading" }]);
    try {
      const b = await getBackendUrl();
      const token = getCookie("accessToken") || "";
      const fd = new FormData();
      fd.append("file", file);
      fd.append("name", file.name);
      fd.append("description", "Plik przesłany przez użytkownika");
      fd.append("tags", "projectFile");
      fd.append("scopes", "");
      fd.append("perm", String(FilePerms.readExternal));
      fd.append("ownerWriteOnly", "false");
      fd.append("folderPath", `proj-${project.id}`);

      const res = await fetch(`${b}/files/create`, {
        method: "POST",
        headers: { Authorization: token },
        body: fd,
      });
      if (!res.ok) throw await res.json();
      toast.success("Sukces", { description: `${file.name} przesłany` });
      fetchFiles();
    } catch {
      toast.error("Błąd", { description: "Nie udało się przesłać pliku." });
    } finally {
      setUploading((u) => u.filter((x) => x.file !== file));
    }
  };

  const handleFiles = (fls: FileList) =>
    Array.from(fls).forEach(uploadFile);

  return (
    <>
      <h2 className="text-2xl font-bold mt-8 dark:text-gray-100">
        Pliki
      </h2>

      <div
        className={`mt-6 p-8 h-48 border-2 border-dashed rounded-lg
                    flex flex-col items-center justify-center
                    transition-colors cursor-pointer
                    ${drag
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-gray-300 dark:border-gray-600"
          }`}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDrag(false);
        }}
        onClick={() => inputRef.current?.click()}
      >
        <Upload size={36} className="text-gray-500 dark:text-gray-400" />
        <p className="mt-2 text-lg text-gray-700 dark:text-gray-300 text-center">
          Przeciągnij i upuść lub kliknij, aby dodać pliki
        </p>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && <FilePreview files={files} />}

      {uploading.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 
                        lg:grid-cols-3 xl:grid-cols-3 gap-8 mt-8">
          {uploading.map((u, i) => (
            <div
              key={i}
              className="h-80 bg-gray-100 dark:bg-gray-700
                         rounded-lg flex items-center justify-center"
            >
              <Loader2 className="animate-spin text-gray-500" />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
import { getBackendUrl } from "@/app/serveractions/backend-url";
import {
  Loader2,
  Upload,
  File,
  FileText,
  Music,
  Video,
  Image,
} from "lucide-react";
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

const getFileUrl = async (fileId: string) => {
  try {
    const backend = await getBackendUrl();
    if (!backend) {
      toast.error("Error", { description: "SpiceHub is offline" });
      return;
    }
    const token = getCookie("accessToken");
    if (!token) {
      toast.error("Error", {
        description:
          "An unknown error occurred. Please try again later.",
      });
      return;
    }

    const url = `${backend}/files/download/${fileId}`;
    const response = await fetch(url, {
      headers: { Authorization: token },
    });
    if (!response.ok) {
      toast.error("Error", {
        description: "Failed to fetch file URL",
      });
      return;
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    toast.error("Error", {
      description:
        "An unknown error occurred. Please try again later.",
    });
  }
};

const getFileType = (
  fileName: string
): "image" | "video" | "audio" | "pdf" | "docx" | "other" => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  const imageExtensions = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "webp",
    "svg",
  ];
  const videoExtensions = [
    "mp4",
    "avi",
    "mov",
    "wmv",
    "flv",
    "webm",
    "mkv",
  ];
  const audioExtensions = [
    "mp3",
    "wav",
    "ogg",
    "flac",
    "aac",
    "m4a",
  ];
  const pdfExtensions = ["pdf"];
  const docxExtensions = ["docx", "doc"];

  if (imageExtensions.includes(extension || "")) return "image";
  if (videoExtensions.includes(extension || "")) return "video";
  if (audioExtensions.includes(extension || "")) return "audio";
  if (pdfExtensions.includes(extension || "")) return "pdf";
  if (docxExtensions.includes(extension || "")) return "docx";
  return "other";
};

interface SingleFilePreviewProps {
  file: SFile;
}

const SingleFilePreview = ({ file }: SingleFilePreviewProps) => {
  const [url, setUrl] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUrl = async () => {
      try {
        setLoading(true);
        const fileUrl = await getFileUrl(file.id);
        if (fileUrl) {
          setUrl(fileUrl);
        } else {
          setUrlError(true);
        }
      } catch {
        setUrlError(true);
      } finally {
        setLoading(false);
      }
    };
    loadUrl();
  }, [file.id]);

  if (loading) {
    return (
      <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    );
  }

  if (urlError || !url) {
    return (
      <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex flex-col items-center justify-center">
        <File className="h-12 w-12 text-gray-400 mb-2" />
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          {file.name}
        </p>
        <p className="text-xs text-red-500 mt-1">
          Failed to load
        </p>
      </div>
    );
  }

  const fileType = getFileType(file.name);

  const renderPreview = () => {
    switch (fileType) {
      case "image":
        return (
          <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <img
              src={url}
              alt={file.name}
              className="w-full h-full object-cover"
            />
          </div>
        );
      case "video":
        return (
          <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <video
              controls
              className="w-full h-full object-cover"
              preload="metadata"
            >
              <source src={url} />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      case "audio":
        return (
          <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex flex-col items-center justify-center p-4">
            <Music className="h-12 w-12 text-gray-400 mb-4" />
            <audio controls className="w-full">
              <source src={url} />
              Your browser does not support audio.
            </audio>
          </div>
        );
      case "pdf":
        return (
          <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <FileText className="h-12 w-12 text-red-500 mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              PDF Document
            </p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:text-blue-600 mt-1"
            >
              Open PDF
            </a>
          </div>
        );
      case "docx":
        return (
          <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <FileText className="h-12 w-12 text-blue-500 mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Word Document
            </p>
            <a
              href={url}
              download={file.name}
              className="text-xs text-blue-500 hover:text-blue-600 mt-1"
            >
              Download
            </a>
          </div>
        );
      default:
        return (
          <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <File className="h-12 w-12 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              {file.name}
            </p>
            <a
              href={url}
              download={file.name}
              className="text-xs text-blue-500 hover:text-blue-600 mt-1"
            >
              Download
            </a>
          </div>
        );
    }
  };

  return (
    <div className="space-y-2">
      {renderPreview()}
      <div className="px-2">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
          {file.name}
        </p>
        {file.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
      {files.map((file) => (
        <SingleFilePreview key={file.id} file={file} />
      ))}
    </div>
  );
};

export default function ProjectFile({
  project,
}: ProjectFileProps) {
  const [uploadingFiles, setUploadingFiles] = useState<
    UploadingFile[]
  >([]);
  const [files, setFiles] = useState<SFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchFiles = async () => {
    try {
      const backend = await getBackendUrl();
      if (!backend) {
        toast.error("Error", { description: "SpiceHub is offline" });
        return;
      }
      const token = getCookie("accessToken");
      if (!token) {
        toast.error("Error", {
          description:
            "An unknown error occurred. Please try again later.",
        });
        return;
      }
      const url = `${backend}/files/folders/getFiles`;
      const response = await fetch(url, {
        headers: {
          Authorization: token,
          FolderPath: `proj-${project?.id}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        toast.error("Błąd", {
          description:
            errorData.message ||
            "Nie udało się pobrać plików",
        });
        return;
      }
      const data = await response.json();
      setFiles(data || []);
    } catch {
      toast.error("Błąd", {
        description: "Nie udało się pobrać plików",
      });
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [project?.id]);

  const uploadFile = async (file: File) => {
    setUploadingFiles((prev) => [
      ...prev,
      { file, status: "uploading" },
    ]);

    try {
      const backend = await getBackendUrl();
      if (!backend) {
        toast.error("Error", { description: "SpiceHub is offline" });
        throw new Error("No backend");
      }

      const token = getCookie("accessToken");
      if (!token) {
        toast.error("Error", {
          description:
            "An unknown error occurred. Please try again later.",
        });
        throw new Error("No token");
      }

      const fileData: ArrayBuffer = await file.arrayBuffer();

      const name = file.name;
      const description = "Plik przesłany przez użytkownika";
      const tags = ["projectFile"];
      const scopes: string[] = [];
      const perm = FilePerms.readExternal;
      const ownerWriteOnly = false;
      const folder = `proj-${project?.id}`;

      const response = await fetch(`${backend}/files/create`, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/octet-stream",
          Name: name,
          Description: description,
          Tags: JSON.stringify(tags),
          Scopes: JSON.stringify(scopes),
          Perm: String(perm),
          OwnerWriteOnly: String(ownerWriteOnly),
          FolderPath: folder,
        },
        body: fileData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error("Błąd", {
          description:
            errorData.message || "Nie udało się przesłać pliku",
        });
        return;
      }

      setUploadingFiles((prev) =>
        prev.filter((f) => f.file !== file)
      );
      fetchFiles();
      toast.success("Sukces", {
        description: `Plik "${file.name}" został przesłany pomyślnie`,
      });
    } catch {
      setUploadingFiles((prev) =>
        prev.filter((f) => f.file !== file)
      );
      toast.error("Błąd", {
        description: "Nie udało się przesłać pliku",
      });
    }
  };

  const handleFiles = (filesList: FileList) => {
    const fileArray = Array.from(filesList);
    const newFiles = fileArray.filter((file) => {
      const dup = uploadingFiles.some(
        (f) => f.file.name === file.name
      );
      if (dup) {
        toast.error("Błąd", {
          description: `Plik "${file.name}" jest już w trakcie przesyłania`,
        });
      }
      return !dup;
    });
    if (!newFiles.length) {
      toast.error("Błąd", {
        description: "Nie udało się dodać plików",
      });
      return;
    }
    newFiles.forEach(uploadFile);
  };

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) handleFiles(e.target.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files)
      handleFiles(e.dataTransfer.files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const renderUploadingFiles = () => {
    if (!uploadingFiles.length) return null;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
        {uploadingFiles.map((u, i) => (
          <div key={i} className="space-y-2">
            <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-gray-500 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Uploading {u.file.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const hasFiles = files.length > 0;

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8">
        Pliki
      </h2>
      <div
        className={`flex gap-4 mt-4 ${
          hasFiles ? "flex-col lg:flex-row" : ""
        }`}
      >
        <div
          className={`border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg ${
            hasFiles
              ? "lg:w-80 lg:h-80 p-4 flex-shrink-0"
              : "p-8"
          } flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
            isDragOver
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : ""
          }`}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="h-14 w-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <Upload className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-center">
            {hasFiles
              ? "Dodaj więcej plików"
              : "Tutaj możesz dodać pliki do projektu."}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
            Przeciągnij i upuść pliki lub kliknij, aby dodać
          </p>
          <input
            ref={fileInputRef}
            id="file-upload"
            type="file"
            className="hidden"
            multiple
            onChange={handleFileSelect}
          />
        </div>
        {hasFiles && (
          <div className="flex-1">
            <FilePreview files={files} />
          </div>
        )}
      </div>
      {renderUploadingFiles()}
    </>
  );
}
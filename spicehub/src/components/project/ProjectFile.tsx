import { getBackendUrl } from "@/app/serveractions/backend-url";
import { Upload } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner";
import { getCookie } from "typescript-cookie";
import { SFile, FilePerms } from "@/models/SFile";
import { set } from "date-fns";
import { Project } from "@/models/Project";

interface UploadingFile {
  file: File;
  status: "uploading" | "error";
}

export interface ProjectFileProps {
  project: Project;
}


export default function ProjectFile({ project }: ProjectFileProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [files, setFiles] = useState<SFile[]>([]);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchFiles = async () => {
    try {
      const backend = await getBackendUrl();
      if (!backend) {
        toast.error("Error", { description: "SpiceHub is offline" })
        return;
      }
      const token = getCookie("accessToken");
      if (!token) {
        toast.error("Error", { description: "An unknown error occurred. Please try again later." })
        return;
      }

      const response = await fetch(`${backend}/files/folders/getFiles`, {
        headers: {
          "Authorization": token,
          "FolderPath": `proj-${project?.id}`,
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error("Błąd", { description: errorData.message || "Nie udało się pobrać plików" });
        return;
      }

      const data = await response.json();
      setFiles(data.files);
    } catch (error) {
      toast.error("Błąd", { description: "Nie udało się pobrać plików" });
    }
  }

  useEffect(() => {
    fetchFiles();
  }, [project?.id]);

  const uploadFile = async (file: File) => {
    setUploadingFiles(prev => [
      ...prev,
      {
        file,
        status: "uploading"
      }
    ]);

    try {
      const backend = await getBackendUrl();
      if (!backend) {
        toast.error("Error", { description: "SpiceHub is offline" })
        setUploadingFiles(prev => prev.filter(f => f.file !== file));
        throw new Error("Backend is not set!");
      }
      const token = getCookie("accessToken");
      if (!token) {
        toast.error("Error", { description: "An unknown error occurred. Please try again later." })
        setUploadingFiles(prev => prev.filter(f => f.file !== file));
        throw new Error("Access token is not set!");
      }

      const formData = new FormData();
      formData.append("file", file);

      const name = file.name;
      const description = "Plik przeslany przez uzytkownika";
      const tags: string[] = ["projectFile"];
      const scopes: string[] = [];
      const perm = FilePerms.readExternal;
      const ownerWriteOnly = false;
      const folder = `proj-${project?.id}`;

      const response = await fetch(`${backend}/files/create`, {
        method: "POST",
        headers: {
          "Authorization": token,
          "Name": name,
          "Description": description,
          "Tags": JSON.stringify(tags),
          "Scopes": JSON.stringify(scopes),
          "Perm": String(perm),
          "OwnerWriteOnly": String(ownerWriteOnly),
          "FolderPath": folder
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error("Błąd", { description: errorData.message || "Nie udało się przesłać pliku" });
        setUploadingFiles(prev => prev.filter(f => f.file !== file));
        return;
      }

      setUploadingFiles(prev => prev.filter(f => f.file !== file));
      fetchFiles();
      toast.success("Sukces", { description: `Plik "${file.name}" został przesłany pomyślnie` });
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadingFiles(prev => prev.filter(f => f.file !== file));
      toast.error("Błąd", { description: "Nie udało się przesłać pliku" });
    }
  }

  const handleFiles = (files: FileList) => {
    const fileArray = Array.from(files)

    const newFiles = fileArray.filter(file => {
      const isDuplicate = uploadingFiles.some(f => f.file.name === file.name);
      if (isDuplicate) {
        toast.error("Błąd", { description: `Plik "${file.name}" jest już w trakcie przesyłania` });
      }
      return !isDuplicate;
    });

    if (newFiles.length === 0) {
      toast.error("Błąd", { description: "Nie udało się dodać plików" });
    } else {
      newFiles.forEach(file => uploadFile(file));
    }

    newFiles.forEach(file => {
      uploadFile(file);
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click();
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8">
        Pliki
      </h2>
      <div
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 mt-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="h-14 w-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
          <Upload className="h-6 w-6 text-gray-500 dark:text-gray-400" />
        </div>
        <p className="text-gray-700 dark:text-gray-300 text-center">
          Tutaj możesz dodać pliki do projektu.
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
    </>
  )
}
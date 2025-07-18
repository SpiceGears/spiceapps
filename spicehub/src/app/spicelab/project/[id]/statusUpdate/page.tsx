"use client"

import { useState, use, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { format } from "date-fns"
import { pl } from "date-fns/locale"
import { 
    ArrowLeft, 
    Paperclip, 
    Plus, 
    ChevronDown, 
    Upload,
    X,
    File as FileIcon,
    FileText,
    Music,
    Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Project, ProjectStatus } from "@/models/Project"
import { SFile, FilePerms } from "@/models/SFile"
import { getBackendUrl } from "@/app/serveractions/backend-url"
import { ErrorRes } from "@/models/ErrorRes"
import { getCookie } from "typescript-cookie"
import { toast } from "sonner"

interface editStatusPayload {
    name: string,
    summary: string,
    filesLinked: string[]
    status: ProjectStatus
}

interface PendingFile {
    file: File
    id: string // temporary ID for display
    uploading?: boolean
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

const FilePreview = ({ file, onRemove }: { file: PendingFile, onRemove: (id: string) => void }) => {
    const type = getFileType(file.file.name);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (type === "image") {
            const url = URL.createObjectURL(file.file);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [file.file, type]);

    const getFileIcon = () => {
        switch (type) {
            case "image":
                return previewUrl ? (
                    <img 
                        src={previewUrl} 
                        alt={file.file.name}
                        className="w-full h-full object-cover"
                    />
                ) : <FileIcon className="w-8 h-8 text-gray-400" />;
            case "pdf":
                return <FileText className="w-8 h-8 text-red-500" />;
            case "docx":
                return <FileText className="w-8 h-8 text-blue-500" />;
            case "audio":
                return <Music className="w-8 h-8 text-purple-500" />;
            default:
                return <FileIcon className="w-8 h-8 text-gray-400" />;
        }
    };

    return (
        <div className="relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Remove button */}
            <button
                onClick={() => onRemove(file.id)}
                className="absolute top-2 right-2 z-10 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                disabled={file.uploading}
            >
                <X className="w-4 h-4" />
            </button>

            {/* File preview */}
            <div className="h-32 bg-gray-50 dark:bg-gray-700 flex items-center justify-center relative">
                {file.uploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                )}
                {getFileIcon()}
            </div>

            {/* File info */}
            <div className="p-3">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {file.file.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(file.file.size / 1024 / 1024).toFixed(1)} MB
                </p>
            </div>
        </div>
    );
};

export default function UpdateStatusPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const [status, setStatus] = useState("healthy")
    const [title, setTitle] = useState("")
    const [summary, setSummary] = useState("")
    const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([])
    const [isUploading, setIsUploading] = useState(false)
    const [dragActive, setDragActive] = useState(false)
    
    const router = useRouter()
    const searchParams = useSearchParams()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const { id } = use(params)

    const [project, setProject] = useState<Project>();
    const [isLoadingProject, setIsLoadingProject] = useState(true)

    //for select component to not complain
    const statusStringRec: Record<string, ProjectStatus> = {
        "healthy": ProjectStatus.Healthy,
        "delayed": ProjectStatus.Delayed,
        "endangered": ProjectStatus.Endangered,
        "abandoned": ProjectStatus.Abandoned,
        "finished": ProjectStatus.Finished,
    }

    // Set status from query parameter and initialize title
    useEffect(() => {
        // Set default title with current date using date-fns
        const currentDate = format(new Date(), "MMM d", { locale: pl })
        setTitle(`${currentDate} - Aktualizacja statusu`)
    }, [])

    const getStatusColor = (status: ProjectStatus) => {
        switch (status) {
            case ProjectStatus.Healthy:
                return "bg-green-500"
            case ProjectStatus.Delayed:
                return "bg-yellow-500"
            case ProjectStatus.Endangered:
                return "bg-red-500"
            case ProjectStatus.Finished:
                return "bg-cyan-500"
            default:
                return "bg-gray-500"
        }
    }

    const getStatusLabel = (status: ProjectStatus) => {
        switch (status) {
            case ProjectStatus.Healthy:
                return "Na dobrej drodze"
            case ProjectStatus.Endangered:
                return "Zagrożony"
            case ProjectStatus.Delayed:
                return "Opóźniony"
            case ProjectStatus.Abandoned:
                return "Porzucony"
            case ProjectStatus.Finished:
                return "Ukończony"
            default:
                return "Nieznany"
        }
    }

    const handleFileSelect = (files: FileList) => {
        const newFiles = Array.from(files).map(file => ({
            file,
            id: Math.random().toString(36).substr(2, 9), // temporary ID
        }));
        setPendingFiles(prev => [...prev, ...newFiles]);
    };

    const handleFileDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files) {
            handleFileSelect(e.dataTransfer.files);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
    };

    const removeFile = (fileId: string) => {
        setPendingFiles(prev => prev.filter(f => f.id !== fileId));
    };

    const uploadFile = async (file: File): Promise<string> => {
        const backend = await getBackendUrl();
        const token = getCookie("accessToken") || "";
        const fd = new FormData();
        fd.append("file", file);
        fd.append("name", file.name);
        fd.append("description", "Załącznik do aktualizacji statusu");
        fd.append("tags", "statusUpdate");
        fd.append("scopes", "");
        fd.append("perm", String(FilePerms.readExternal));
        fd.append("ownerWriteOnly", "false");
        fd.append("folderPath", `proj-${id}`);

        const res = await fetch(`${backend}/files/create`, {
            method: "POST",
            headers: { Authorization: token },
            body: fd,
        });

        if (!res.ok) {
            throw new Error(`Failed to upload ${file.name}`);
        }

        const uploadedFile = await res.json();
        return uploadedFile.id;
    };

    const handleSave = async () => {
        setIsUploading(true);
        
        try {
            // Upload files first
            const uploadedFileIds: string[] = [];
            
            if (pendingFiles.length > 0) {
                // Update UI to show uploading state
                setPendingFiles(prev => prev.map(f => ({ ...f, uploading: true })));
                
                // Upload files sequentially
                for (const pendingFile of pendingFiles) {
                    try {
                        const fileId = await uploadFile(pendingFile.file);
                        uploadedFileIds.push(fileId);
                        toast.success(`${pendingFile.file.name} przesłany pomyślnie`);
                    } catch (error) {
                        toast.error(`Nie udało się przesłać ${pendingFile.file.name}`);
                        throw error;
                    }
                }
            }

            // Create payload with uploaded file IDs
            const payload: editStatusPayload = {
                name: title,
                summary: summary,
                status: statusStringRec[status],
                filesLinked: uploadedFileIds
            };

            // Save status update
            const backend = await getBackendUrl();
            if (!backend) throw new Error("No backend URL");
            const at = getCookie("accessToken");
            if (!at) throw new Error("No access token");

            const res = await fetch(`${backend}/api/project/${id}/editStatus`, {
                method: 'POST',
                headers: {
                    Authorization: at,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                toast.success("Aktualizacja statusu zapisana pomyślnie");
                router.push(`/spicelab/project/${id}`);
            } else {
                throw new Error(await res.text());
            }

        } catch (error) {
            console.error("Save failed:", error);
            toast.error("Nie udało się zapisać aktualizacji statusu");
        } finally {
            setIsUploading(false);
            setPendingFiles(prev => prev.map(f => ({ ...f, uploading: false })));
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
            {/* Header */}
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.back()}
                            className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                            disabled={isUploading}
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-pink-500 rounded-full" />
                            <span className="text-sm text-gray-900 dark:text-white">
                                test
                            </span>
                            <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Aktualizacja statusu
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={handleSave}
                            disabled={isUploading}
                            className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                        >
                            {isUploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {isUploading ? "Zapisywanie..." : "Zapisz"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="space-y-8">
                    {/* Title Input */}
                    <div className="space-y-2">
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isUploading}
                            className="
                            w-full
                            text-4xl font-semibold
                            text-gray-900 dark:text-gray-100
                            bg-white dark:bg-gray-800
                            border border-gray-300 dark:border-gray-700
                            rounded-md
                            px-4 py-2
                            placeholder-gray-400 dark:placeholder-gray-500
                            focus:outline-none
                            "
                            placeholder="Aktualizacja statusu - "
                        />
                        <div className="h-px bg-gray-200 dark:bg-gray-700" />
                    </div>

                    {/* Status Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-gray-900 dark:text-gray-300 w-20">
                                Status *
                            </label>
                            <Select value={status} onValueChange={setStatus} disabled={isUploading}>
                                <SelectTrigger className="w-48 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`w-2 h-2 rounded-full ${getStatusColor(
                                                statusStringRec[status]
                                            )}`}
                                        />
                                        <span>{getStatusLabel(statusStringRec[status])}</span>
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
                                    <SelectItem value={"healthy"} className="text-gray-900 dark:text-white">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500" />
                                            Na dobrej drodze
                                        </div>
                                    </SelectItem>
                                    <SelectItem value={"delayed"} className="text-gray-900 dark:text-white">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                            Opóźniony
                                        </div>
                                    </SelectItem>
                                    <SelectItem value={"endangered"} className="text-gray-900 dark:text-white">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-red-500" />
                                            Zagrożony
                                        </div>
                                    </SelectItem>
                                    <SelectItem value={"abandoned"} className="text-gray-900 dark:text-white">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-gray-500" />
                                            Porzucony
                                        </div>
                                    </SelectItem>
                                    <SelectItem value={"finished"} className="text-gray-900 dark:text-white">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-cyan-500" />
                                            Zakończony
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* File Upload Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white justify-start p-0"
                            >
                                <Paperclip className="w-4 h-4 mr-2" />
                                Dodaj załącznik
                            </Button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                className="hidden"
                                onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                                disabled={isUploading}
                            />
                        </div>

                        {/* Drag & Drop Area */}
                        <div
                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                                dragActive
                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                    : "border-gray-300 dark:border-gray-600"
                            }`}
                            onDrop={handleFileDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Przeciągnij pliki tutaj lub kliknij, aby dodać załączniki
                            </p>
                        </div>

                        {/* File Previews */}
                        {pendingFiles.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {pendingFiles.map(file => (
                                    <FilePreview
                                        key={file.id}
                                        file={file}
                                        onRemove={removeFile}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Summary */}
                    <div className="space-y-3">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                            Podsumowanie
                        </h2>
                        <Textarea
                            placeholder="Jak idzie ten projekt?"
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            disabled={isUploading}
                            className="min-h-32 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
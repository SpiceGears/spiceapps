// app/spicelab/project/page.tsx
"use client"

import { useState, useEffect, useRef, use } from "react"
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
  Loader2,
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
import { Project, ProjectStatus } from "@/models/Project"
import { SFile, FilePerms } from "@/models/SFile"
import { getBackendUrl } from "@/app/serveractions/backend-url"
import { ErrorRes } from "@/models/ErrorRes"
import { getCookie } from "typescript-cookie"
import { toast } from "sonner"

interface editStatusPayload {
  name: string
  summary: string
  filesLinked: string[]
  status: ProjectStatus
}

interface PendingFile {
  file: File
  id: string
  uploading?: boolean
}

function getFileType(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() || ""
  if (["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"].includes(ext))
    return "image"
  if (["mp4", "avi", "mov", "wmv", "flv", "webm", "mkv"].includes(ext))
    return "video"
  if (["mp3", "wav", "ogg", "flac", "aac", "m4a"].includes(ext)) return "audio"
  if (ext === "pdf") return "pdf"
  if (["doc", "docx"].includes(ext)) return "docx"
  return "other"
}

const FilePreview = ({
  file,
  onRemove,
}: {
  file: PendingFile
  onRemove: (id: string) => void
}) => {
  const type = getFileType(file.file.name)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (type === "image") {
      const url = URL.createObjectURL(file.file)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [file.file, type])

  const getFileIcon = () => {
    switch (type) {
      case "image":
        return previewUrl ? (
          <img
            src={previewUrl}
            alt={file.file.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <FileIcon className="w-8 h-8 text-gray-400" />
        )
      case "pdf":
        return <FileText className="w-8 h-8 text-red-500" />
      case "docx":
        return <FileText className="w-8 h-8 text-blue-500" />
      case "audio":
        return <Music className="w-8 h-8 text-purple-500" />
      default:
        return <FileIcon className="w-8 h-8 text-gray-400" />
    }
  }

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <button
        onClick={() => onRemove(file.id)}
        className="absolute top-2 right-2 z-10 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors disabled:opacity-50"
        disabled={file.uploading}
      >
        <X className="w-4 h-4" />
      </button>
      <div className="h-32 bg-gray-50 dark:bg-gray-700 flex items-center justify-center relative">
        {file.uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
        )}
        {getFileIcon()}
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
          {file.file.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {(file.file.size / 1024 / 1024).toFixed(1)} MB
        </p>
      </div>
    </div>
  )
}

export default function UpdateStatusPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [status, setStatus] = useState<keyof typeof statusStringRec>(
    "healthy"
  )
  const [title, setTitle] = useState("")
  const [summary, setSummary] = useState("")
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const router = useRouter()
  const { id } = use(params)

  const statusStringRec: Record<string, ProjectStatus> = {
    healthy: ProjectStatus.Healthy,
    delayed: ProjectStatus.Delayed,
    endangered: ProjectStatus.Endangered,
    abandoned: ProjectStatus.Abandoned,
    finished: ProjectStatus.Finished,
  }

  useEffect(() => {
    const currentDate = format(new Date(), "MMM d", { locale: pl })
    setTitle(`${currentDate} - Aktualizacja statusu`)
  }, [])

  const getStatusColor = (s: ProjectStatus) => {
    switch (s) {
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

  const getStatusLabel = (s: ProjectStatus) => {
    switch (s) {
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
    const newFiles = Array.from(files).map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
    }))
    setPendingFiles((prev) => [...prev, ...newFiles])
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    if (e.dataTransfer.files) handleFileSelect(e.dataTransfer.files)
  }
  const removeFile = (id: string) =>
    setPendingFiles((prev) => prev.filter((f) => f.id !== id))

  async function uploadFile(file: File): Promise<string> {
    const backend = await getBackendUrl()
    const token = getCookie("accessToken") || ""
    const fd = new FormData()
    fd.append("file", file)
    fd.append("name", file.name)
    fd.append("description", "Załącznik")
    fd.append("tags", "statusUpdate")
    fd.append("perm", String(FilePerms.readExternal))
    fd.append("ownerWriteOnly", "false")
    fd.append("folderPath", `proj-${id}`)

    const res = await fetch(`${backend}/files/create`, {
      method: "POST",
      headers: { Authorization: token },
      body: fd,
    })
    if (!res.ok) throw new Error("Upload failed")
    return (await res.json()).id
  }

  const handleSave = async () => {
    setIsUploading(true)
    try {
      const uploadedFileIds: string[] = []
      for (let pf of pendingFiles) {
        setPendingFiles((p) =>
          p.map((x) =>
            x.id === pf.id ? { ...x, uploading: true } : x
          )
        )
        const fid = await uploadFile(pf.file)
        uploadedFileIds.push(fid)
        toast.success(`${pf.file.name} przesłany`)
      }

      const payload: editStatusPayload = {
        name: title,
        summary,
        status: statusStringRec[status],
        filesLinked: uploadedFileIds,
      }

      const backend = await getBackendUrl()
      const token = getCookie("accessToken") || ""
      const res = await fetch(
        `${backend}/api/project/${id}/editStatus`,
        {
          method: "POST",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      )
      if (!res.ok) throw new Error(await res.text())
      toast.success("Zapisano!")
      router.push(`/spicelab/project/${id}`)
    } catch (e) {
      console.error(e)
      toast.error("Błąd zapisu")
    } finally {
      setIsUploading(false)
      setPendingFiles((p) => p.map((x) => ({ ...x, uploading: false })))
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              disabled={isUploading}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold">
              Aktualizacja statusu
            </h1>
          </div>
          <Button
            onClick={handleSave}
            disabled={isUploading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isUploading && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            {isUploading ? "Zapisuję..." : "Zapisz"}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">

        {/* Title */}
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isUploading}
          placeholder="Tytuł aktualizacji"
          className="     w-full
     text-md      
     sm:text-md  
     font-semibold
     bg-white dark:bg-gray-800
     border-gray-300 dark:border-gray-700
     placeholder-gray-500 dark:placeholder-gray-400"
        />

        {/* Status */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <label className="w-full sm:w-auto text-sm font-medium">
            Status *
          </label>
          <Select
            value={status}
            onValueChange={setStatus}
            disabled={isUploading}
          >
            <SelectTrigger>
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${getStatusColor(
                    statusStringRec[status]
                  )}`}
                />
                <span>{getStatusLabel(statusStringRec[status])}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="healthy">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"/>
                  Na dobrej drodze
                </div>
              </SelectItem>
              <SelectItem value="delayed">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-500"/>
                  Opóźniony
                </div>
              </SelectItem>
              <SelectItem value="endangered">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"/>
                  Zagrożony
                </div>
              </SelectItem>
              <SelectItem value="abandoned">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-500"/>
                  Porzucony
                </div>
              </SelectItem>
              <SelectItem value="finished">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-500"/>
                  Ukończony
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* File Upload */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex-1 text-left"
            >
              <Paperclip className="w-4 h-4 mr-2"/> Dodaj pliki
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) =>
                e.target.files && handleFileSelect(e.target.files)
              }
              disabled={isUploading}
            />
          </div>

          {pendingFiles.length > 0 && (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
                         gap-4"
            >
              {pendingFiles.map((f) => (
                <FilePreview
                  key={f.id}
                  file={f}
                  onRemove={removeFile}
                />
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Podsumowanie</label>
          <Textarea
            placeholder="Opisz postęp"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            disabled={isUploading}
            className="min-h-[8rem] bg-white dark:bg-gray-800 resize-none"
          />
        </div>

      </div>
    </div>
  )
}
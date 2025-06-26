// app/spicelab/project/[id]/updateStatus/page.tsx
"use client"

import { useState, use, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { format } from "date-fns"
import { pl } from "date-fns/locale"
import { ArrowLeft, Paperclip, Plus, ChevronDown } from "lucide-react"
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
import { getBackendUrl } from "@/app/serveractions/backend-url"
import { ErrorRes } from "@/models/ErrorRes"
import { getCookie } from "typescript-cookie"
import { toast } from "sonner"


interface editStatusPayload 
{
    name: string,
    summary: string,
    filesLinked: string[]
    status: ProjectStatus
}


export default function UpdateStatusPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const [status, setStatus] = useState("healthy")
    const [title, setTitle] = useState("")
    const [summary, setSummary] = useState("")
    const router = useRouter()
    const searchParams = useSearchParams()

    const { id } = use(params)

    const [project, setProject] = useState<Project>();
    const [isLoadingProject, setIsLoadingProject] = useState(true)

    //for select component to not complain
    const statusStringRec: Record<string, ProjectStatus> = 
    {
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

    const handleSave = () => {
        // Here you would typically save the status update
        console.log("Saving status update:", {
            title,
            status,
            summary,
        })
        const payload: editStatusPayload = 
        {
            name: title,
            summary: summary,
            status: statusStringRec[status],
            filesLinked: []
        }
        const fetchSaveChanges = async () => 
        {
            const backend = await getBackendUrl();
            if (!backend) throw new Error("No backend URL");
            const at = getCookie("accessToken");
            if (!at) throw new Error("No access token");

            const res = await fetch(`${backend}/api/project/${id}/editStatus`, 
                {
                    method: 'POST',
                    headers: {
                        Authorization: at, 
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                })
            if (res.ok) {router.push(`/spicelab/project/${id}`)}
            else throw (await res.text());
        }

        fetchSaveChanges().catch((e) => 
            {
                console.error("Fetch failed: ", e)
                if (e instanceof Error) 
                {
                    console.warn("failure before the fetch, ", e.message)
                }
                else 
                {
                    toast(`${e}`) 
                }
                
            })


        //router.push(`/spicelab/project/${id}`)
    }

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
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Zapisz
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
                            <Select value={status} onValueChange={setStatus}>
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
                                    <SelectItem
                                        value={"healthy"}
                                        className="text-gray-900 dark:text-white"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500" />
                                            Na dobrej drodze
                                        </div>
                                    </SelectItem>
                                    <SelectItem
                                        value={"delayed"}
                                        className="text-gray-900 dark:text-white"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                            Opóźniony
                                        </div>
                                    </SelectItem>
                                    <SelectItem
                                        value={"endangered"}
                                        className="text-gray-900 dark:text-white"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-red-500" />
                                            Zagrożony
                                        </div>
                                    </SelectItem>
                                    <SelectItem
                                        value={"abandoned"}
                                        className="text-gray-900 dark:text-white"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-gray-500" />
                                            Porzucony
                                        </div>
                                    </SelectItem>
                                    <SelectItem
                                        value={"finished"}
                                        className="text-gray-900 dark:text-white"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-cyan-500" />
                                            Zakończony
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Draft Collaborators */}
                        {/* <div className="flex items-center gap-4">
                            
                        </div> */}
                    </div>

                    {/* Add Attachment */}
                    <Tooltip>
                    <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white justify-start p-0"
                    >
                        <Paperclip className="w-4 h-4 mr-2" />
                        Dodaj załącznik
                    </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Dostępne od wersji 1.0</p>
                    </TooltipContent>
                    </Tooltip>

                    {/* Summary */}
                    <div className="space-y-3">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                            Podsumowanie
                        </h2>
                        <Textarea
                            placeholder="Jak idzie ten projekt?"
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            className="min-h-32 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
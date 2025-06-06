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

type User = {
    id: string
    name: string
    avatarUrl?: string
    initials: string
}

const mockUsers: User[] = [
    { id: "1", name: "Michał Kulik", initials: "MK" },
    { id: "2", name: "Anna Nowak", initials: "AN" },
    { id: "3", name: "Piotr Wiśniewski", initials: "PW" },
    { id: "4", name: "Maria Kowalczyk", initials: "MK" },
]

export default function UpdateStatusPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const [status, setStatus] = useState("on-track")
    const [selectedCollaborators, setSelectedCollaborators] = useState<User[]>([
        mockUsers[0], // Default to first user
    ])
    const [owner, setOwner] = useState(mockUsers[0])
    const [title, setTitle] = useState("")
    const [summary, setSummary] = useState("")
    const router = useRouter()
    const searchParams = useSearchParams()

    const { id } = use(params)

    // Set status from query parameter and initialize title
    useEffect(() => {
        const statusParam = searchParams.get("status")
        if (statusParam) {
            // Map the status values from the dropdown to the ones used in this component
            const statusMapping: { [key: string]: string } = {
                "in-progress": "at-risk",
                "todo": "on-track",
                "completed": "on-track",
                "active": "on-track",
                "on-hold": "at-risk",
            }

            const mappedStatus = statusMapping[statusParam] || "on-track"
            setStatus(mappedStatus)
        }

        // Set default title with current date using date-fns
        const currentDate = format(new Date(), "MMM d", { locale: pl })
        setTitle(`Aktualizacja statusu - ${currentDate}`)
    }, [searchParams])

    const getStatusColor = (status: string) => {
        switch (status) {
            case "on-track":
                return "bg-green-500"
            case "at-risk":
                return "bg-yellow-500"
            case "off-track":
                return "bg-red-500"
            default:
                return "bg-gray-500"
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "on-track":
                return "Na dobrej drodze"
            case "at-risk":
                return "Zagrożony"
            case "off-track":
                return "Opóźniony"
            default:
                return "Nieznany"
        }
    }

    const handleSave = () => {
        // Here you would typically save the status update
        console.log("Saving status update:", {
            title,
            status,
            collaborators: selectedCollaborators,
            owner,
            summary,
        })
        router.push(`/spicelab/project/${id}`)
    }

    const addCollaborator = (user: User) => {
        if (!selectedCollaborators.find((c) => c.id === user.id)) {
            setSelectedCollaborators([...selectedCollaborators, user])
        }
    }

    const removeCollaborator = (userId: string) => {
        setSelectedCollaborators(
            selectedCollaborators.filter((c) => c.id !== userId)
        )
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
                                                status
                                            )}`}
                                        />
                                        <span>{getStatusLabel(status)}</span>
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
                                    <SelectItem
                                        value="on-track"
                                        className="text-gray-900 dark:text-white"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500" />
                                            Na dobrej drodze
                                        </div>
                                    </SelectItem>
                                    <SelectItem
                                        value="at-risk"
                                        className="text-gray-900 dark:text-white"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                            Zagrożony
                                        </div>
                                    </SelectItem>
                                    <SelectItem
                                        value="off-track"
                                        className="text-gray-900 dark:text-white"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-red-500" />
                                            Opóźniony
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Draft Collaborators */}
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-gray-900 dark:text-gray-300 w-20">
                                Osoby
                            </label>
                            <div className="flex items-center gap-2">
                                {selectedCollaborators.map((collaborator) => (
                                    <div
                                        key={collaborator.id}
                                        className="flex items-center justify-center w-8 h-8 bg-yellow-600 rounded-full text-xs font-medium cursor-pointer text-white"
                                        onClick={() => {
                                            removeCollaborator(collaborator.id);
                                        }}
                                    >
                                        {collaborator.initials}
                                    </div>
                                ))}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="w-8 h-8 border border-dashed border-gray-300 dark:border-gray-500 rounded-full text-gray-500 dark:text-gray-400"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
                                        {mockUsers
                                            .filter(
                                                (user) =>
                                                    !selectedCollaborators.find((c) => c.id === user.id)
                                            )
                                            .map((user) => (
                                                <DropdownMenuItem
                                                    key={user.id}
                                                    onClick={() => addCollaborator(user)}
                                                    className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center justify-center w-6 h-6 bg-yellow-600 rounded-full text-xs text-white">
                                                            {user.initials}
                                                        </div>
                                                        {user.name}
                                                    </div>
                                                </DropdownMenuItem>
                                            ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>

                    {/* Add Attachment */}
                    <Button
                        variant="ghost"
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white justify-start p-0"
                    >
                        <Paperclip className="w-4 h-4 mr-2" />
                        Dodaj załącznik
                    </Button>

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
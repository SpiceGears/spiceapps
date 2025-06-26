"use client"

import { projectContext } from "@/app/spicelab/project/[id]/projectContext";
import { ProjectUpdateEntry, StatusUpdateType } from "@/models/Project"
import { CarTaxiFront } from "lucide-react";
import React, { useContext } from "react"
import ProjectUpdateIcon from "./ProjectUpdateIcon";
import { Skeleton } from "@/components/ui/skeleton";

export interface TimelineItemProps {
    update: ProjectUpdateEntry;
}

export function StatusUpdate({update}: TimelineItemProps) {
    const ctx = useContext(projectContext);
    
    return (
        <div
            className="
        flex items-start gap-2
        bg-gray-100 text-gray-900
        dark:bg-gray-800 dark:text-gray-100
        rounded-lg p-4
      "
        >
            {/* line + dot */}
            <div className="flex flex-col items-center mr-4">
                {/* <span className="block w-2 h-2 rounded-full bg-yellow-500 mt-3" /> */}
                { !ctx.loading && <><ProjectUpdateIcon icon={update.type} />
                <span className="flex-1 w-px bg-gray-200 dark:bg-gray-700" /></>}
                {ctx.loading && <>
                <Skeleton className="block w-5 h-5 text-green-500 mt-2 -ml-1"/>
                <Skeleton className="flex-1 w-px"/>
                </>}
            </div>

            {/* content */}
            {!ctx.loading && <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {update.name}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    {ctx.users.filter(f => f.id == update.user)[0].firstName + " " + ctx.users.filter(f => f.id == update.user)[0].lastName} · {new Date(update.happenedAt).toLocaleString('pl-PL')}
                </span>
            </div>}
            {ctx.loading && <div className="flex flex-col">
                <Skeleton className="text-sm font-medium"/>
                <Skeleton className="text-xs"/>
                </div>}
        </div>
    )
}
export enum TaskStatus 
{
    Planned = -1,
    OnTrack = 0,
    Finished = 1,
    Problem = 2,
}

export enum TaskPriority
{
    Low = 1,
    Medium = 2,
    High = 3
}

export interface Section 
{
    id: string;
    name: string;
}

export interface Task 
{
    id: string;
    assignedUsers: string[]
    scopesRequired: string[]
    dependencies: string[]
    status: TaskStatus
    priority: Number
    name: string
    description: string
    percentage: Number
    created: Date
    creator: string
    deadlineDate: Date
    sectionId: string
    finished: Date | undefined | null | unknown
}
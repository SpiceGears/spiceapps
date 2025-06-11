export enum TaskStatus 
{
    Planned = -1,
    OnTrack = 0,
    Finished = 1,
    Problem = 2,
}

export interface Section 
{
    id: string;
    name: string;
    tasks: Task[]
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
    finished: Date | undefined | null | unknown
}
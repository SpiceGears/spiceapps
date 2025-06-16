import { Section, TaskStatus } from "./Task";

export interface Project {
  id: string;
    name: string;
    description: string;
    status: ProjectStatus;
    creator: string;
    scopesRequired: string[];
    sections: Section[]
}

export enum ProjectStatus 
{
  Healthy = 0,
    Endangered = 1,
    Delayed = 2,
    Abandoned = -2,
    Finished = -1,
}
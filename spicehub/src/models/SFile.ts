import { Project } from "./Project";

export interface SFile 
{
    id: string;
    name: string;
    description: string;
    tags: string[];
    scopes: string[];
    owner: string;
    ownerWriteOnly: boolean;
    projects: Project[];
}

export enum FilePerms 
{
    normal = 0,
    publicReadOnly = 1,
    publicAll = 2,
    readExternal = 3,
}
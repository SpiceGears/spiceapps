import { TaskSection, TaskStatus } from "./Task";

export interface Project {
  id: string;
    name: string;
    description: string;
    status: TaskStatus;
    creator: string;
    scopesRequired: string[];
    sections: TaskSection[]
}
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
/** Project status */ 
export enum ProjectStatus {
  Healthy = 0,
  Endangered = 1,
  Delayed = 2,
  Abandoned = -2,
  Finished = -1,
}
/** Project Update Entry */
export interface ProjectUpdateEntry {
  /** Primary key */
  id: string;

  /** ID of the user who made the update */
  user: string;

  /** ID of the project this entry belongs to */
  projectId: string;

  /** Optional task ID, if this update refers to a task */
  task?: string | null;

  /** Timestamp (ISO 8601) when the update happened */
  happenedAt: string;

  /** Any linked file IDs */
  linkedFiles: string[];

  /** Short title or name for the update */
  name: string;

  /** Detailed description or summary of the update */
  summary: string;

  /** Current project status (enum) */
  status: ProjectStatus;

  /** Type of update (enum) */
  type: StatusUpdateType;
}

/**project update type*/
export enum StatusUpdateType {
  ProjectCreated = -1,
  ProjectStatus = 0,

  SectionAdd = 11,
  SectionEdit = 12,
  SectionDelete = 13,

  TaskAdd = 21,
  TaskEdit = 22,
  TaskDelete = 23,
  TaskStatusUpdate = 24,
  TaskMoveToSection = 25,
}
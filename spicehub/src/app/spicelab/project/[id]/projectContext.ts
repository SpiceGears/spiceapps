import { Project, ProjectUpdateEntry } from "@/models/Project";
import { Task } from "@/models/Task";
import { UserInfo } from "@/models/User";
import { createContext, Dispatch, SetStateAction } from "react";

export type ProjectContext =
{
  project: Project | undefined,
  tasks: Task[],
  users: UserInfo[],
  events: ProjectUpdateEntry[],
  loading: boolean,
  
  refresh: boolean, //the refresh value to listen for data re-fetch
  setRefresh: Dispatch<SetStateAction<boolean>> | undefined//the setstate for refreshing and re-fetching data
}

export const projectContext = createContext<ProjectContext>({
  project: undefined, 
  tasks: [], 
  users: [], 
  events: [],
  loading: true, 
  refresh: false, 
  setRefresh: undefined});
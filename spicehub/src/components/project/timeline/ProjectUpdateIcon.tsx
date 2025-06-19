import { StatusUpdateType } from '@/models/Project'
import { ChevronsLeftRightEllipsis, Edit, FileCog, FileMinus, FilePen, FilePlus, FolderEdit, FolderInput, FolderPlus, ListMinus, ListPlus } from 'lucide-react';
import React from 'react'

const ProjectUpdateIcon = (props: {icon: StatusUpdateType}) => {
  switch (props.icon) {
    case StatusUpdateType.ProjectCreated:
        return (<FolderPlus className="block w-5 h-5 text-green-500 mt-2 -ml-1"/>)
        break;
    case StatusUpdateType.ProjectStatus:
        return (<FolderEdit className="block w-5 h-5 text-green-500 mt-2 -ml-1"/>)
        break;
    case StatusUpdateType.SectionAdd:
        return (<ListPlus className="block w-5 h-5 text-green-500 mt-2 -ml-1"/>)
        break;
    case StatusUpdateType.SectionDelete:
        return (<ListMinus className="block w-5 h-5 text-green-500 mt-2 -ml-1"/>)
        break;
    case StatusUpdateType.SectionEdit:
        return (<Edit className="block w-5 h-5 text-green-500 mt-2 -ml-1"/>)
        break;
    case StatusUpdateType.TaskAdd:
        return (<FilePlus className="block w-5 h-5 text-green-500 mt-2 -ml-1"/>)
        break;
    case StatusUpdateType.TaskEdit:
        return (<FileCog className="block w-5 h-5 text-green-500 mt-2 -ml-1"/>)
        break;
    case StatusUpdateType.TaskDelete:
        return (<FileMinus className="block w-5 h-5 text-green-500 mt-2 -ml-1"/>)
        break;
    case StatusUpdateType.TaskStatusUpdate:
        return (<FilePen className="block w-5 h-5 text-green-500 mt-2 -ml-1"/>)
        break;
    case StatusUpdateType.TaskMoveToSection:
        return (<FolderInput className="block w-5 h-5 text-green-500 mt-2 -ml-1"/>)
        break;
    default:
        return (<ChevronsLeftRightEllipsis className="block w-5 h-5 text-green-500 mt-2 -ml-1"/>)
        break;
  }
}

export default ProjectUpdateIcon
// components/FileItem.tsx
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Folder,
  File as FileIcon,
  Edit2,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { FileNode } from "@/lib/types"

export default function FileItem({
  node,
  onOpen,
  onRename,
  onDelete,
}: {
  node: FileNode
  onOpen: () => void
  onRename: () => void
  onDelete: () => void
}) {
  const Icon = node.type === "folder" ? Folder : FileIcon
  return (
    <Card>
      <CardContent
        className="cursor-pointer"
        onClick={onOpen}
      >
        <div className="flex justify-center">
          <Icon className="h-10 w-10 text-muted-foreground" />
        </div>
        <p className="truncate mt-2 text-center">{node.name}</p>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              onClick={onRename}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Rename</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete</TooltipContent>
        </Tooltip>
      </CardFooter>
    </Card>
  )
}
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Task } from '@/models/Task'
import { UserInfo } from '@/models/User'

type Props = {
    user: UserInfo | null;
    tasks: Task[];
}

export default function Welcome({ user, tasks }: Props) {
    return (
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarFallback className="bg-purple-500 text-white">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Witaj, {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Masz {tasks.length} przypisanych zadań
            </p>
          </div>
        </div>
      </div>
    )
}
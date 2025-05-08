'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Plus } from 'lucide-react'
import Welcome from '@/components/dashboard/Welcome'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-900 p-8 text-slate-100">
        <Welcome />
      <div className="space-y-8">
        {/* My tasks */}
        <Card className="bg-slate-800">
          <CardHeader className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">My tasks</h3>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 12H6.01M12 12h.01M18 12h.01"
                    />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom">
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Archive</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upcoming">
              <TabsList className="mb-4">
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="overdue">Overdue (2)</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              <TabsContent value="upcoming">
                <Button variant="outline" className="w-full">
                  + Create task
                </Button>
              </TabsContent>
              <TabsContent value="overdue">
                {/* your content */}
              </TabsContent>
              <TabsContent value="completed">
                {/* your content */}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Projects & People */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Projects */}
          <Card className="bg-slate-800">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Projects</CardTitle>
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      Recents
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="ml-1 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Recents</DropdownMenuItem>
                    <DropdownMenuItem>Starred</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>All Projects</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 12H6.01M12 12h.01M18 12h.01"
                        />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>New Project</DropdownMenuItem>
                    <DropdownMenuItem>Archive All</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full border-dashed text-slate-300"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create project
              </Button>

              {/* List of projects */}
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <Avatar className="bg-pink-500">
                    <AvatarFallback>PT</AvatarFallback>
                  </Avatar>
                  <span>test</span>
                </li>
                <li className="flex items-center space-x-2 opacity-60">
                  <Avatar className="bg-teal-400">
                    <AvatarFallback>TS</AvatarFallback>
                  </Avatar>
                  <span>test (Archived)</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

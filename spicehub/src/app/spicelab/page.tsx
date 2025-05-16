'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'
import { ChevronDown, ArrowLeft, Flag } from 'lucide-react'
import Link from "next/link"
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
import Welcome from '@/components/dashboard/Welcome'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"

export default function HomePage() {
  const options = [
    { label: "Mój tydzień", value: "tydzien" },
    { label: "Mój miesiąc", value: "miesiac" },
    { label: "Lifetime", value: "lifetime" },
    { label: "Mój sezon", value: "sezon" },
  ];
  const [selected, setSelected] = useState(options[0]);
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-gray-100">
      <Welcome />
      <div className="space-y-8">
        <div className="flex justify-center items-center">
            <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <Button
              variant="full"
              className="w-40 h-12 rounded-md shadow-sm border bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium flex items-center justify-between px-4"
              >
              {selected.label}
              <ChevronDown
                className={`ml-2 h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
              />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {options.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onSelect={() => setSelected(option)}
              >
                {option.label}
              </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
            </DropdownMenu>
            <Card
            className="
              w-40 h-10
              rounded-md shadow-sm border
              bg-white border-gray-200
              dark:bg-gray-800 dark:border-gray-700
              text-gray-700 dark:text-gray-300 font-medium flex items-center justify-center ml-4
            "
            >
            <CardContent className="h-full flex items-center justify-center p-0">
              <span className="text-sm font-medium">
              Wykonano 0 zadań
              </span>
            </CardContent>
            </Card>
        </div>
      </div>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <Card className="max-w-3xl mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-100">
        {/* Header with avatar, title and back button */}
        <CardHeader className="flex items-center justify-between pb-0 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback className="bg-purple-500 text-white">
                MK
              </AvatarFallback>
            </Avatar>
        <CardTitle className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Moje zadania
            </CardTitle>
          </div>
        </CardHeader>

        {/* Tabs */}
        <CardContent className="pt-2 text-gray-700 dark:text-gray-100">
          <Tabs defaultValue="upcoming" className="space-y-4">
            <TabsList>
              <TabsTrigger value="upcoming">Nadchodzące</TabsTrigger>
              <TabsTrigger value="overdue">Zaległe</TabsTrigger>
              <TabsTrigger value="done">Ukończone</TabsTrigger>
            </TabsList>

            {/* Upcoming */}
            <TabsContent value="upcoming" className="p-0">
              <Table className="bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 border border-gray-200 dark:border-gray-700">
                <TableHeader>
                  <TableRow>
                    <TableHead>Nazwa zadania</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priorytet</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>test</TableCell>
                    <TableCell>Skończone</TableCell>
                    <TableCell>
                      <Flag className="h-4 w-4 text-orange-500" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>test</TableCell>
                    <TableCell>Problem</TableCell>
                    <TableCell>
                      <Flag className="h-4 w-4 text-orange-500" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>testtest</TableCell>
                    <TableCell>W trakcie</TableCell>
                    <TableCell>
                      <Flag className="h-4 w-4 text-orange-500" />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>

            {/* Overdue */}
            <TabsContent value="overdue" className="p-0">
              <div className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                Brak zaległych zadań.
              </div>
            </TabsContent>

            {/* Done */}
            <TabsContent value="done" className="p-0">
              <div className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                Brak ukończonych zadań.
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
    </div>
  )
}

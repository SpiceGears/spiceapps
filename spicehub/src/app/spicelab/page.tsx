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
  const projects = [
    { name: "test", description: "test" },
    { name: "test", description: "test" },
    { name: "test", description: "test" },
    { name: "testniewiemktory", description: "hahaha" },
    { name: "4thegwra", description: "4hergwas" },
    { name: "tewqgvqwaet", description: "weqgvrqwff" },
    { name: "RQTGWETFGGHVQ", description: "TWagvWERAH" },
  ]
  const [selected, setSelected] = useState(options[0]);
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen p-8 text-gray-100 bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
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
              w-40 h-12
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
      {/* Widgets Row */}
      <div className="flex flex-wrap gap-8 max-w-7xl mx-auto mb-12 my-12">
        {/* User Tasks Widget */}
        <Card className="flex-1 min-w-[420px] max-w-[calc(50%-1rem)] h-[520px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-100">
          <CardHeader className="flex items-center justify-between pb-0 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback className="bg-purple-500 text-white">MK</AvatarFallback>
              </Avatar>
              <CardTitle className="text-lg font-medium text-gray-900 dark:text-gray-100">Moje zadania</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-2 text-gray-700 dark:text-gray-100">
            <Tabs defaultValue="upcoming" className="space-y-4">
              <TabsList>
                <TabsTrigger value="upcoming">Aktualne</TabsTrigger>
                <TabsTrigger value="overdue">Zaległe</TabsTrigger>
                <TabsTrigger value="done">Ukończone</TabsTrigger>
              </TabsList>
              <TabsContent value="upcoming" className="p-0">
                <div className="overflow-x-auto">
                  <Table className="min-w-full bg-transparent text-gray-700 dark:text-gray-100">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold">Nazwa zadania</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Priorytet</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>cos2</TableCell>
                        <TableCell>Skończone</TableCell>
                        <TableCell><Flag className="h-4 w-4 text-orange-500" /></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>cos1</TableCell>
                        <TableCell>Problem</TableCell>
                        <TableCell><Flag className="h-4 w-4 text-orange-500" /></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              <TabsContent value="overdue" className="p-0">
                <div className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">Brak zaległych zadań.</div>
              </TabsContent>
              <TabsContent value="done" className="p-0">
                <div className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">Brak ukończonych zadań.</div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        {/* Projects Widget */}
        <Card className="flex-1 min-w-[420px] max-w-[calc(50%-1rem)] h-[520px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-100">
          <CardHeader className="flex items-center justify-between pb-0 border-b border-gray-200 dark:border-gray-700">
            <CardTitle>Projekty</CardTitle>
            <Link href="#" className="text-sm text-gray-600 hover:underline dark:text-gray-400">Ostatnie</Link>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="overflow-x-auto">
              <Table className="min-w-full bg-transparent text-gray-700 dark:text-gray-100">
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Nazwa projektu</TableHead>
                    <TableHead className="font-semibold">Opis projektu</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Priorytet</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((proj, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{proj.name}</TableCell>
                    <TableCell>{proj.description}</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

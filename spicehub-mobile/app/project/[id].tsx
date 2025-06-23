import { router, useLocalSearchParams } from 'expo-router'
import {
  ScrollView,
  Alert,
  Pressable,
  View,
  Text,
  LayoutChangeEvent,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/Constants/TeamColors'
import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { Task, TaskStatus } from '@/models/Task'
import { BackendUrl } from '@/Constants/backend'
import * as SecureStore from 'expo-secure-store'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import OverviewTab from '@/components/project/tabs/Overview'
import { Project } from '@/models/Project'
import BottomSheet, { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper'
import ProjectScreenHeader from '@/components/project/Header'
import ProjectMenu from '@/components/project/BottomSheets/ProjectMenu'

export default function ProjectScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [activeTab, setActiveTab] = useState<"Overview" | "Table">("Overview");
  const insets = useSafeAreaInsets()

  useEffect(() => {
    async function fetchProject() {
      try {
        const token = await SecureStore.getItemAsync('accessToken')
        if (!token) return

        const res = await fetch(`${BackendUrl}/api/project/${id}`, {
          method: 'GET',
          headers: { Authorization: token },
        })
        if (!res.ok) throw new Error(await res.text())
        setProject(await res.json())
      } catch (e: any) {
        Alert.alert('Error', e.message || e.toString())
      }
    }
    fetchProject()
  }, [id])

  return (
    <>
      <ProjectScreenHeader
        project={project!}
      />
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 100,
        }}
        className="flex-1 bg-white"
      >

        {activeTab === "Overview" ? (
          <OverviewTab project={project!} />
        ) : (
          <OverviewTab project={project!} />
        )}
        <Button>Test</Button>
      </ScrollView>
      <ProjectMenu onSheetChange={(idx: number) => {
        console.log("sheet moved to index", idx);
      }} />
    </>
  )
}
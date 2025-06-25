import { router, useLocalSearchParams, useRouter } from 'expo-router'
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
import ProjectEdit from '@/components/project/BottomSheets/ProjectEdit'
import ProjectDelete from '@/components/project/BottomSheets/ProjectDelete'

export default function ProjectScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [activeTab, setActiveTab] = useState<"Overview" | "Table">("Overview");
  const insets = useSafeAreaInsets()
  const router = useRouter();

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

  const onProjectEditSave = async (
    name: string,
    description: string
  ) => {
    try {
      const token = await SecureStore.getItemAsync("accessToken");
      if (!token) return;
      
      const res = await fetch(
        `${BackendUrl}/api/project/${id}/edit`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            name,
            description,
            scopes: project?.scopesRequired,
            status: project?.status,
            priority: 0
          }),
        }
      );
      if (!res.ok) throw new Error(await res.text());
      const updated: Project = await res.json();
      setProject(updated);
      Alert.alert("Saved!", "Project updated successfully.");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  const deleteProject = async () => {
    try {
      const token = await SecureStore.getItemAsync("accessToken");
      if(!token) return;
      const res = await fetch(`${BackendUrl}/api/project/${id}`,{
        method: "DELETE",
        headers: { Authorization: token }
      })
      if(!res.ok) throw new Error(await res.text());
      router.replace("/(tabs)/spicelab");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  }

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
      </ScrollView>
      <ProjectMenu onSheetChange={(idx: number) => {
        console.log("project menu sheet moved to index", idx);
      }} />
      <ProjectEdit
        onSheetChange={(idx: number) => {
          console.log("project edit sheet moved to index", idx);
        }} 
        initialName={project?.name}
        initialDescription={project?.description}
        onSave={onProjectEditSave}  
      />
      <ProjectDelete 
      onSheetChange={(idx: number) => {
        console.log("project menu sheet moved to index", idx);
      }} 
      deleteProject={deleteProject}
      />
    </>
  )
}
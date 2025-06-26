import {  useLocalSearchParams, useRouter } from 'expo-router'
import {
  ScrollView,
  Alert,
  Text,
} from 'react-native'
import { useEffect, useState, useMemo } from 'react'
import { Section, Task } from '@/models/Task'
import { BackendUrl } from '@/Constants/backend'
import * as SecureStore from 'expo-secure-store'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import OverviewTab from '@/components/project/tabs/Overview'
import { Project } from '@/models/Project'
import ProjectScreenHeader from '@/components/project/Header'
import ProjectMenu from '@/components/project/BottomSheets/ProjectMenu'
import ProjectEdit from '@/components/project/BottomSheets/ProjectEdit'
import ProjectDelete from '@/components/project/BottomSheets/ProjectDelete'
import Navigation from '@/components/project/Navigation'
import TabSelection from '@/components/project/BottomSheets/TabSelection'
import TasksTab from '@/components/project/tabs/Table'

export default function ProjectScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<"Overview" | "Table" | "Dashboard">("Overview");
  const [sectionsData, setSectionsData] = useState<Section[]>([]); // Fixed: Array type
  const [tasksData, setTasksData] = useState<Task[]>([]); // Fixed: Array type
  const insets = useSafeAreaInsets()
  const router = useRouter();

  // Combine sections with their tasks and count tasks
  const combinedSectionsData = useMemo(() => {
    return sectionsData.map(section => {
      const sectionTasks = tasksData.filter(task => task.sectionId === section.id);
      return {
        ...section,
        tasks: sectionTasks,
        taskCount: sectionTasks.length
      };
    });
  }, [sectionsData, tasksData]);

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

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const token = await SecureStore.getItemAsync("accessToken");
        if (!token) return;
        const res = await fetch(`${BackendUrl}/api/project/${id}/getSections`, {
          method: "GET",
          headers: { Authorization: token }
        })
        if (!res.ok) throw new Error(await res.text());
        setSectionsData(await res.json());
      } catch (e: any) {
        Alert.alert('Error', e.message || e.toString()) // Fixed: e.text() to e.message
      }
    }
    fetchSections();
  }, [id])

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = await SecureStore.getItemAsync("accessToken");
        if(!token) return;
        const res = await fetch(`${BackendUrl}/api/project/${id}/getTasks` ,{
          method: "GET",
          headers: { Authorization: token }
        })
        if(!res.ok) throw new Error(await res.text());
        setTasksData(await res.json());
      } catch (e: any) {
        Alert.alert('Error', e.message || e.toString()); // Fixed: e.text() to e.message
      }
    }
    fetchTasks()
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
      if (!token) return;
      const res = await fetch(`${BackendUrl}/api/project/${id}`, {
        method: "DELETE",
        headers: { Authorization: token }
      })
      if (!res.ok) throw new Error(await res.text());
      router.replace("/(tabs)/spicelab");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  }

  const setCurrentTab = (tab: "Overview" | "Table" | "Dashboard") => {
    setActiveTab(tab)
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
        className="flex-1 bg-light-bg"
      >

        {activeTab === "Overview" && <OverviewTab project={project!} />}
        {activeTab === "Table" && <TasksTab sectionsData={combinedSectionsData} />}
        {activeTab === "Dashboard" && <Text className='flex-1 bg-white m-8'>…your DashboardTab…</Text>}
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
      <TabSelection onSheetChange={(idx: number) => {
        console.log("project menu sheet moved to index", idx);
      }}
        setCurrentTab={setCurrentTab}
      />
      <Navigation
        currentTab={activeTab}
      />
    </>
  )
}
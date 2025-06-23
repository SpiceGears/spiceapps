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
import BottomSheet, { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper'

export default function ProjectScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [activeTab, setActiveTab] = useState<"Overview" | "Table">("Overview");
  const insets = useSafeAreaInsets()

  // state for the header’s measured height
  const [headerHeight, setHeaderHeight] = useState(0)

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

  function getHeaderColor(scopes?: string[]) {
    if (!scopes?.length || scopes.length > 1) return COLORS.NEUTRAL
    for (let s of scopes) {
      const key = s.trim().toUpperCase() as keyof typeof COLORS
      if (key in COLORS) return COLORS[key]
    }
    return COLORS.NEUTRAL
  }
  const headerBg = getHeaderColor(project?.scopesRequired)

  // called when header layout is done
  function onHeaderLayout(e: LayoutChangeEvent) {
    setHeaderHeight(e.nativeEvent.layout.height)
  }
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const handleNavigationSheetClose = () => bottomSheetModalRef.current?.close();
  const handleNavigationSheetOpen = () => bottomSheetModalRef.current?.present();

  const navigationSheetSnapPoints = useMemo(() => ['40%'], []);

  return (
    <>
      {/* ABSOLUTE HEADER */}
      <View
        // measure ourselves, pin to the top, padding + z-index via Tailwind
        className="absolute top-0 left-0 right-0 z-10 px-4 pb-5"
        style={{
          paddingTop: insets.top + 8,    // safe-area top inset
          backgroundColor: headerBg, // dynamic header color
        }}
        onLayout={onHeaderLayout}
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Pressable onPress={() => router.replace('/(tabs)/spicelab')}>
              <Ionicons name="arrow-back" size={22} color="#000" />
            </Pressable>
            <Text className="ml-3 mb-0.5 text-[20px] text-black">Powrót</Text>
          </View>
          <Pressable onPress={handleNavigationSheetOpen}>
            <Ionicons name="ellipsis-horizontal" size={28} color="#000" />
          </Pressable>
        </View>
        <View className="flex-row items-center mt-8">
          <Ionicons name="folder" size={25} color="#000" />
          <Text className="ml-5 text-2xl font-bold text-black">
            {project?.name}
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={{ paddingTop: headerHeight }}
      >

        {activeTab === "Overview" ? (
          <OverviewTab project={project!} />
        ) : (
          <OverviewTab project={project!} />
        )}
        <Button onPress={handleNavigationSheetClose}>Test</Button>
      </ScrollView>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={navigationSheetSnapPoints}
        onChange={handleSheetChanges}
      >
        <BottomSheetView className="p-4">
          <Text className="text-lg mb-4">Awesome options 🎉</Text>
          <Button onPress={handleNavigationSheetClose}>Dismiss</Button>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  )
}
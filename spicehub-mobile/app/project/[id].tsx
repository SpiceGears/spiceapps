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
import { useEffect, useState } from 'react'
import { Project } from '@/models/Project'
import { BackendUrl } from '@/Constants/backend'
import * as SecureStore from 'expo-secure-store'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function Task() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [project, setProject] = useState<Project | null>(null)
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

  return (
    <>
      {/* ABSOLUTE HEADER */}
      <View
        // measure ourselves, pin to the top, padding + z-index via Tailwind
        className="absolute top-0 left-0 right-0 z-10 px-4 pb-5"
        style={{
          paddingTop: insets.top,    // safe-area top inset
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
          <Pressable onPress={() => {/* open menu */}}>
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
        <Text className="m-8 text-gray-700 text-2xl">
          Here’s your screen’s main content.
        </Text>
      </ScrollView>
    </>
  )
}
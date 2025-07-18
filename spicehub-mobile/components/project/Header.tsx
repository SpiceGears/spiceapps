// ProjectScreenHeader.tsx
import {
  Pressable,
  View,
  Text,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { router } from 'expo-router'

import { Department, DepartmentColors } from '@/Constants/TeamColors'
import { Project } from '@/models/Project'
import { useSheets } from '@/contexts/SheetsContext'

interface HeaderProps {
  project: Project
}

export default function ProjectScreenHeader({ project }: HeaderProps) {
  const insets = useSafeAreaInsets()
  const { open } = useSheets()


function getHeaderColor(scopes: string[]) {
  if (scopes.length !== 1) {
    return DepartmentColors[Department.NEUTRAL];
  }

  const raw = scopes[0].trim();
  const parts = raw.split(".");
  const deptSlug = parts.length > 1 ? parts[1].toLowerCase() : parts[0].toLowerCase();

  const key = deptSlug as Department;
  return DepartmentColors[key] ?? DepartmentColors[Department.NEUTRAL];
}

  const headerBg = getHeaderColor(project?.scopesRequired)

  return (
    <View
      className="absolute top-0 left-0 right-0 z-10 px-4 pb-5"
      style={{
        paddingTop: insets.top + 8,
        backgroundColor: headerBg,
      }}
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Pressable onPress={() => router.replace('/(tabs)/spicelab')}>
            <Ionicons name="arrow-back" size={22} color="#000" />
          </Pressable>
          <Text className="ml-3 mb-0.5 text-[20px] text-light-text">
            Powrót
          </Text>
        </View>
        <Pressable onPress={() => open('projectSettings')}>
          <Ionicons
            name="ellipsis-horizontal"
            size={28}
            color="#000"
          />
        </Pressable>
      </View>
      <View className="flex-row items-center mt-8">
        <Ionicons name="folder" size={25} color="#000" />
        <Text className="ml-5 text-2xl font-bold text-light-text">
          {project?.name}
        </Text>
      </View>
    </View>
  )
}
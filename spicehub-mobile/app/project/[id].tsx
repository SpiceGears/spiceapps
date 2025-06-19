import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert, Pressable, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/Constants/TeamColors';
import { useEffect, useState } from 'react';
import { Project } from '@/models/Project';
import { BackendUrl } from '@/Constants/backend';
import * as SecureStore from 'expo-secure-store';

export default function Task() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(true || false); 

  useEffect(() => {
    async function fetchProject() {
      try {
        const token = await SecureStore.getItemAsync('accessToken');
        if (!token) return;

        const res = await fetch(`${BackendUrl}/api/project/${id}`, {
          method: 'GET',
          headers: {
            Authorization: token,
          },
        });
        if (!res.ok) throw new Error(await res.text());
        setProject(await res.json());
      } catch (e: any) {
        Alert.alert('Error', e.message || e.toString());
      }
    }
    fetchProject();
  }, [id]);

  function getHeaderColor(scopes?: string[]): string {
    if (!scopes?.length || scopes?.length > 1) {
      return COLORS.NEUTRAL;
    }

    for (let scope of scopes) {
      const key = scope.trim().toUpperCase() as keyof typeof COLORS;
      if (key in COLORS) {
        return COLORS[key];
      }
    }

    return COLORS.NEUTRAL;
  }

  const headerBg = getHeaderColor(project?.scopesRequired);

  return (
    <SafeAreaView
      edges={['top']}
      className="bg-transparent"
      style={{ backgroundColor: headerBg }}
    >
      <View className="px-4 py-5">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Pressable onPress={() => router.replace('/(tabs)/spicelab')}>
              <Ionicons name="arrow-back" size={22} color="#000" />
            </Pressable>
            <Text className="text-[20px] ml-5">Project</Text>
          </View>
          <Pressable onPress={() => setIsProjectMenuOpen(true)}>
            <Ionicons name="ellipsis-horizontal" size={28} color="#000" />
          </Pressable>
        </View>
        <View className="flex-row items-center mt-8">
          <Ionicons name="folder" size={25} color="#000" />
          <Text className="text-2xl font-bold text-black ml-5">
            {project?.name}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
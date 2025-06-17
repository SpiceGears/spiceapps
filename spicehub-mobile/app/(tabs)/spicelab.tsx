import { BackendUrl } from '@/Constants/backend';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import {
  Appbar,
  Card,
  Text,
  List,
  Avatar,
  FAB,
} from 'react-native-paper';
import { useUserData } from '@/hooks/userData';
import * as SecureStore from 'expo-secure-store';
import { Task } from '@/models/Task';
import { Project } from '@/models/Project';
import { router } from 'expo-router';

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const { data, loading, error } = useUserData();

  // fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const accessToken = await SecureStore.getItemAsync(
          'accessToken'
        );
        const userId = data?.id;
        if (!userId || !accessToken) return;
        const response = await fetch(
          `${BackendUrl}/api/user/${userId}/getAssignedTasks`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: accessToken,
            },
          }
        );
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP ${response.status}: ${errorText}`
          );
        }
        const tasksData = await response.json();
        setTasks(tasksData);
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
      }
    };
    if (!loading && !error && data?.id) fetchTasks();
  }, [data, loading, error]);

  // fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const accessToken = await SecureStore.getItemAsync(
          'accessToken'
        );
        if (!accessToken) return;
        const response = await fetch(
          `${BackendUrl}/api/project`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: accessToken,
            },
          }
        );
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP ${response.status}: ${errorText}`
          );
        }
        const projectData = await response.json();
        setProjects(projectData);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      }
    };
    fetchProjects();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.Action icon="format-list-bulleted" />
        <Appbar.Content title="Tasks" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>My Tasks</Text>
        {tasks.length === 0 ? (
          <Text>No tasks to do</Text>
        ) : (
          tasks.map((task, i) => (
            <Card key={i} style={styles.taskCard}>
              <Card.Title
                title={task.name}
                subtitle={`Due: ${task.deadlineDate}`}
                left={(props) => (
                  <Avatar.Icon
                    {...props}
                    icon="circle-outline"
                  />
                )}
              />
            </Card>
          ))
        )}

        <Text style={styles.sectionTitle}>Projects</Text>
        {projects.length === 0 ? (
          <Text>No Projects found</Text>
        ) : (
          projects.map((proj, i) => (
            <List.Item
              key={i}
              title={proj.name}
              left={(props) => (
                <List.Icon
                  {...props}
                  icon="briefcase-outline"
                />
              )}
            />
          ))
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        onPress={() => {
            router.replace("/(project)/NewProject");
        }}
        style={styles.fab}
        color="#ffffff"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16 },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#121416',
    marginBottom: 8,
    marginTop: 16,
  },
  taskCard: {
    marginBottom: 8,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: "#1976d2",
    color: "#ffffff"
  },
});
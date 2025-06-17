import { BackendUrl } from '@/Constants/backend';
import { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  Appbar,
  Card,
  Text,
  Avatar,
  FAB,
  Menu,
  IconButton,
  List,
  useTheme,
} from 'react-native-paper';
import { useUserData } from '@/hooks/userData';
import * as SecureStore from 'expo-secure-store';
import { Task } from '@/models/Task';
import { Project } from '@/models/Project';
import { router } from 'expo-router';

export default function TasksScreen() {
  const theme = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const { data, loading, error } = useUserData();

  // Task filter state
  const [taskMenuVisible, setTaskMenuVisible] = useState(false);
  const [taskFilter, setTaskFilter] = useState<
    'All' | 'Pending' | 'Completed'
  >('All');

  // Project filter state
  const [projMenuVisible, setProjMenuVisible] = useState(false);
  const [projFilter, setProjFilter] = useState<'All' | 'Active'>(
    'All'
  );

  // Apply filters
  const filteredTasks = tasks.filter((t) => {
    if (taskFilter === 'All') return true;
    if (taskFilter === 'Pending') return !t.finished;
    return t.finished;
  });
  const filteredProjects = projects.filter((p) => {
    if (projFilter === 'All') return true;
    return p.status !== -2 && p.status !== -1;
  });

  // Fetch tasks
  useEffect(() => {
    async function fetchTasks() {
      try {
        const token = await SecureStore.getItemAsync('accessToken');
        const userId = data?.id;
        if (!userId || !token) return;
        const resp = await fetch(
          `${BackendUrl}/api/user/${userId}/getAssignedTasks`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
            },
          }
        );
        if (!resp.ok) throw new Error(await resp.text());
        setTasks(await resp.json());
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
      }
    }
    if (!loading && !error && data?.id) fetchTasks();
  }, [data, loading, error]);

  // Fetch projects
  useEffect(() => {
    async function fetchProjects() {
      try {
        const token = await SecureStore.getItemAsync('accessToken');
        if (!token) return;
        const resp = await fetch(`${BackendUrl}/api/project`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });
        if (!resp.ok) throw new Error(await resp.text());
        setProjects(await resp.json());
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      }
    }
    fetchProjects();
  }, []);

  const cardStyle = {
    backgroundColor: theme.colors.surface,
    elevation: 2,
    borderRadius: 12,
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <Appbar.Header>
        <Appbar.Action icon="format-list-bulleted" />
        <Appbar.Content title="Dashboard" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        {/* TASKS CARD */}
        <Card style={[styles.sectionCard, cardStyle]}>
          <Card.Content>
            <View style={styles.headerRow}>
              <Text variant="titleMedium">My Tasks</Text>
              <Menu
                visible={taskMenuVisible}
                onDismiss={() => setTaskMenuVisible(false)}
                anchor={
                  <IconButton
                    icon="filter-variant"
                    onPress={() => setTaskMenuVisible(true)}
                  />
                }
              >
                <Menu.Item
                  title="All"
                  onPress={() => {
                    setTaskFilter('All');
                    setTaskMenuVisible(false);
                  }}
                />
                <Menu.Item
                  title="Pending"
                  onPress={() => {
                    setTaskFilter('Pending');
                    setTaskMenuVisible(false);
                  }}
                />
                <Menu.Item
                  title="Completed"
                  onPress={() => {
                    setTaskFilter('Completed');
                    setTaskMenuVisible(false);
                  }}
                />
              </Menu>
            </View>

            {filteredTasks.length === 0 ? (
              <Text
                style={[
                  styles.emptyText,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                No tasks to show
              </Text>
            ) : (
              filteredTasks.map((task, i) => (
                <List.Item
                  key={i}
                  title={task.name}
                  description={`Due: ${task.deadlineDate}`}
                  left={(props) => (
                    <Avatar.Icon {...props} icon="circle-outline" />
                  )}
                />
              ))
            )}
          </Card.Content>
        </Card>

        {/* PROJECTS CARD */}
        <Card style={[styles.sectionCard, cardStyle]}>
          <Card.Content>
            <View style={styles.headerRow}>
              <Text variant="titleMedium">Projects</Text>
              <Menu
                visible={projMenuVisible}
                onDismiss={() => setProjMenuVisible(false)}
                anchor={
                  <IconButton
                    icon="filter-variant"
                    onPress={() => setProjMenuVisible(true)}
                  />
                }
              >
                <Menu.Item
                  title="All"
                  onPress={() => {
                    setProjFilter('All');
                    setProjMenuVisible(false);
                  }}
                />
                <Menu.Item
                  title="Active"
                  onPress={() => {
                    setProjFilter('Active');
                    setProjMenuVisible(false);
                  }}
                />
              </Menu>
            </View>

            {filteredProjects.length === 0 ? (
              <Text
              style={[
                styles.emptyText,
                { color: theme.colors.onSurfaceVariant },
              ]}
              >
              No projects to show
              </Text>
            ) : (
              filteredProjects.map((proj, i) => (
              <List.Item
                key={i}
                title={proj.name}
                description={`Status: ${
                proj.status !== -2 && proj.status !== -1
                  ? 'Active'
                  : 'Inactive'
                }`}
                left={(props) => (
                <Avatar.Icon
                  {...props}
                  icon="briefcase-outline"
                  color="#1976d2"
                  style={[props.style, { backgroundColor: 'transparent' }]}
                />
                )}
              />
              ))
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      <FAB
        icon="plus"
        onPress={() => router.replace('/(project)/NewProject')}
        style={[styles.fab, { backgroundColor: "#1976d2" }]}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  sectionCard: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 8,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});
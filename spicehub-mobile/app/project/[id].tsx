import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
} from "react-native";
import {
  Appbar,
  Avatar,
  Button,
  Divider,
  List,
  Paragraph,
  FAB,
  Title,
} from "react-native-paper";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { BackendUrl } from "../../Constants/backend";
import * as SecureStore from "expo-secure-store";
import { Project } from "@/models/Project";

type ProjectTasksScreenProps = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<{ params: { id: string; title: string } }, "params">;
};

const ProjectTasksScreen = ({ navigation }: { navigation: any }) => {
  const { id, title = "Project Name" } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<"Overview" | "Tasks">("Overview");
  const [menuVisible, setMenuVisible] = useState(false);
  const [taskMenuVisible, setTaskMenuVisible] = useState<number | null>(null);
  const [projectData, setProjectData] = useState<Project>();

  // Sample task data - replace with your actual data
  const sections = [
    {
      id: 1,
      name: "To Do",
      taskCount: 5,
      tasks: [
        {
          id: 1,
          name: "Complete project proposal",
          description: "Write and review the Q2 project proposal document",
          isCompleted: false,
          status: "In Progress",
          priority: "High",
          dueDate: "2025-06-20",
        },
        {
          id: 2,
          name: "Team meeting",
          description: "Weekly sync with development team",
          isCompleted: true,
          status: "Done",
          priority: "Medium",
          dueDate: "2025-06-18",
        },
        {
          id: 3,
          name: "Code review",
          description: "Review pull requests from team members",
          isCompleted: false,
          status: "Pending",
          priority: "High",
          dueDate: "2025-06-19",
        },
      ],
    },
    {
      id: 2,
      name: "In Progress",
      taskCount: 3,
      tasks: [
        {
          id: 4,
          name: "UI Design",
          description: "Create mockups for new feature",
          isCompleted: false,
          status: "In Progress",
          priority: "Medium",
          dueDate: "2025-06-22",
        },
        {
          id: 5,
          name: "Database optimization",
          description: "Improve query performance",
          isCompleted: false,
          status: "In Progress",
          priority: "Low",
          dueDate: "2025-06-25",
        },
      ],
    },
    {
      id: 3,
      name: "Done",
      taskCount: 8,
      tasks: [
        {
          id: 6,
          name: "Setup CI/CD",
          description: "Configure automated deployment pipeline",
          isCompleted: true,
          status: "Done",
          priority: "High",
          dueDate: "2025-06-15",
        },
      ],
    },
  ];

  const taskMenuOptions = [
    { title: "Edit Task", icon: "pencil" },
    { title: "Move Task", icon: "arrow-right" },
    { title: "Duplicate Task", icon: "content-copy" },
    { title: "Delete Task", icon: "delete", destructive: true },
  ];

  useEffect(() => {
    const fetchProject = async () => {
      const accessToken = await SecureStore.getItemAsync("accessToken");
      if (!accessToken) {
        console.warn("No access token found");
        return;
      }
      try {
        const response = await fetch(`${BackendUrl}/api/project/${id}`, {
          method: "GET",
          headers: {
            Authorization: accessToken,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch project");
        }
        const projectData = await response.json();
        setProjectData(projectData);
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };
    fetchProject();
  }, []);

  const files = ["test.pdf", "Dtest.zip", "testh.docx"];

  const menuOptions = [
    { title: "Edit Project", icon: "pencil" },
    { title: "Share Project", icon: "share" },
    { title: "Archive Project", icon: "archive" },
    { title: "Delete Project", icon: "delete", destructive: true },
  ];

  const handleMenuOption = (option: string) => {
    setMenuVisible(false);
    console.log("Selected:", option);
  };

  const handleTaskMenuOption = (option: string, taskId: number) => {
    setTaskMenuVisible(null);
    console.log("Selected task option:", option, "for task:", taskId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Done":
        return "#4CAF50";
      case "In Progress":
        return "#2196F3";
      case "Pending":
        return "#FF9800";
      default:
        return "#9E9E9E";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "#F44336";
      case "Medium":
        return "#FF9800";
      case "Low":
        return "#4CAF50";
      default:
        return "#9E9E9E";
    }
  };

  const renderTaskCard = (task: any) => (
    <View key={task.id} style={styles.taskCard}>
      <View style={styles.taskHeader}>
        <TouchableOpacity style={styles.checkbox}>
          <View
            style={[
              styles.checkboxInner,
              task.isCompleted && styles.checkboxChecked,
            ]}
          >
            {task.isCompleted && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </View>
        </TouchableOpacity>
        <View style={styles.taskContent}>
          <Text
            style={[
              styles.taskName,
              task.isCompleted && styles.completedText,
            ]}
          >
            {task.name}
          </Text>
          <Text
            style={[
              styles.taskDescription,
              task.isCompleted && styles.completedText,
            ]}
          >
            {task.description}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.taskMenuButton}
          onPress={() => setTaskMenuVisible(task.id)}
        >
          <Text style={styles.taskMenuDots}>⋯</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.taskFooter}>
        <View style={styles.badges}>
          <View
            style={[
              styles.badge,
              { backgroundColor: getStatusColor(task.status) },
            ]}
          >
            <Text style={styles.badgeText}>{task.status}</Text>
          </View>
          <View
            style={[
              styles.badge,
              { backgroundColor: getPriorityColor(task.priority) },
            ]}
          >
            <Text style={styles.badgeText}>{task.priority}</Text>
          </View>
        </View>
        <Text style={styles.dueDate}>{task.dueDate}</Text>
      </View>
    </View>
  );

  const renderSection = (section: any) => (
    <View key={section.id} style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionName}>{section.name}</Text>
        <View style={styles.sectionHeaderRight}>
          <View style={styles.taskCountContainer}>
            <View style={styles.taskCountDot}>
              <Text style={styles.taskCountText}>{section.taskCount}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.sectionMenuButton}>
            <Text style={styles.menuDots}>⋯</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.tasksContainer}>
        {section.tasks.map(renderTaskCard)}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.replace("/(tabs)/spicelab")} />
        <Appbar.Content title={projectData?.name} />
        <Appbar.Action
          icon="dots-vertical"
          onPress={() => setMenuVisible(true)}
        />
      </Appbar.Header>

      <View style={styles.tabsContainer}>
        {(["Overview", "Tasks"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === "Overview" ? (
        <ScrollView contentContainerStyle={styles.content}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 8,
              color: "#333",
            }}
          >
            Description
          </Text>
          <Text style={styles.paragraph}>{projectData?.description}</Text>

          <Divider style={styles.sectionDivider} />

          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 8,
              color: "#333",
            }}
          >
            Files
          </Text>
          <List.Section>
            {files.map((file) => (
              <List.Item
                key={file}
                title={file}
                left={(props) => <List.Icon {...props} icon="file" />}
              />
            ))}
          </List.Section>
          <Button
            mode="outlined"
            onPress={() => {
              /* handle upload file */
            }}
            style={styles.button}
            textColor="#1976d2"
          >
            Upload File
          </Button>
        </ScrollView>
      ) : (
        <View style={styles.tasksTabContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {sections.map(renderSection)}
          </ScrollView>
        </View>
      )}

      {/* Project Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.bottomSheet}>
            <View style={styles.bottomSheetHandle} />
            <Text style={styles.bottomSheetTitle}>Project Options</Text>
            {menuOptions.map((option) => (
              <TouchableOpacity
                key={option.title}
                style={styles.menuOption}
                onPress={() => handleMenuOption(option.title)}
              >
                <List.Icon
                  icon={option.icon}
                  color={option.destructive ? "#e74c3c" : "#666"}
                />
                <Text
                  style={[
                    styles.menuOptionText,
                    option.destructive && styles.destructiveText,
                  ]}
                >
                  {option.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Task Menu Modal */}
      <Modal
        visible={taskMenuVisible !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setTaskMenuVisible(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setTaskMenuVisible(null)}
        >
          <View style={styles.bottomSheet}>
            <View style={styles.bottomSheetHandle} />
            <Text style={styles.bottomSheetTitle}>Task Options</Text>
            {taskMenuOptions.map((option) => (
              <TouchableOpacity
                key={option.title}
                style={styles.menuOption}
                onPress={() => handleTaskMenuOption(option.title, taskMenuVisible!)}
              >
                <List.Icon
                  icon={option.icon}
                  color={option.destructive ? "#e74c3c" : "#666"}
                />
                <Text
                  style={[
                    styles.menuOptionText,
                    option.destructive && styles.destructiveText,
                  ]}
                >
                  {option.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => {
          /* handle add task */
        }}
        color="#fff"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#dbe1e6",
    backgroundColor: "#fff",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 3,
    borderColor: "#1976d2",
  },
  tabText: {
    fontSize: 16,
    color: "#60768a",
    fontWeight: "bold",
  },
  activeTabText: {
    color: "#1976d2",
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 16,
    color: "#666",
    lineHeight: 22,
  },
  sectionDivider: {
    marginVertical: 16,
  },
  button: {
    alignSelf: "flex-start",
    marginTop: 12,
    color: "#1976d2",
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 24,
    backgroundColor: "#1976d2",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  bottomSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 12,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#ddd",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  menuOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  menuOptionText: {
    fontSize: 16,
    marginLeft: 16,
    color: "#333",
  },
  destructiveText: {
    color: "#e74c3c",
  },
  // Tasks Tab Styles
  tasksTabContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 20,
  },
  horizontalScrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  sectionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginRight: 16,
    padding: 16,
    width: 300,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  sectionName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  sectionHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  taskCountContainer: {
    marginRight: 12,
  },
  taskCountDot: {
    backgroundColor: "#1976d2",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  taskCountText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  sectionMenuButton: {
    padding: 4,
  },
  menuDots: {
    fontSize: 20,
    color: "#666666",
    fontWeight: "bold",
  },
  tasksContainer: {
    gap: 12,
  },
  taskCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#1976d2",
  },
  taskHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  checkbox: {
    marginRight: 12,
    paddingTop: 2,
  },
  checkboxInner: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#cccccc",
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  checkmark: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  taskContent: {
    flex: 1,
  },
  taskName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
  completedText: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },
  taskMenuButton: {
    padding: 4,
    marginLeft: 8,
  },
  taskMenuDots: {
    fontSize: 16,
    color: "#666666",
    fontWeight: "bold",
  },
  taskFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  badges: {
    flexDirection: "row",
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "500",
  },
  dueDate: {
    fontSize: 12,
    color: "#666666",
    fontWeight: "500",
  },
});

export default ProjectTasksScreen;
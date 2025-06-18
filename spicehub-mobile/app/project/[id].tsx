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
    FAB,
    Card,
    IconButton,
    Checkbox,
} from "react-native-paper";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { BackendUrl } from "../../Constants/backend";
import * as SecureStore from "expo-secure-store";
import { Project } from "@/models/Project";
import { Section, Task, TaskStatus } from "@/models/Task";

interface SectionWithTasks extends Section {
    tasks: Task[];
}

type ProjectTasksScreenProps = {
    navigation: NativeStackNavigationProp<any>;
    route: RouteProp<{ params: { id: string; title: string } }, "params">;
};

const ProjectTasksScreen = ({ navigation }: { navigation: any }) => {
    const { id, title = "Project Name" } = useLocalSearchParams();
    const [activeTab, setActiveTab] = useState<"Overview" | "Tasks">("Overview");
    const [menuVisible, setMenuVisible] = useState(false);
    const [sectionMenuVisible, setSectionMenuVisible] = useState(false);
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [projectData, setProjectData] = useState<Project>();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [sections, setSections] = useState<Section[]>([]);
    const [sectionsWithTasks, setSectionsWithTasks] = useState<SectionWithTasks[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!id) return;
        
        const fetchProject = async () => {
            const accessToken = await SecureStore.getItemAsync("accessToken");
            if (!accessToken) return;
            
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
    }, [id]);

    useEffect(() => {
        if (!id) return;
        
        const fetchSections = async () => {
            const accessToken = await SecureStore.getItemAsync("accessToken");
            if (!accessToken) return;
            
            try {
                const response = await fetch(`${BackendUrl}/api/project/${id}/getSections`, {
                    method: "GET",
                    headers: {
                        Authorization: accessToken,
                        "Content-Type": "application/json",
                    },
                });
                
                if (!response.ok) {
                    throw new Error("Failed to fetch sections");
                }
                
                const sections = await response.json();
                setSections(sections);
            } catch (err) {
                console.error("Error fetching sections:", err);
            }
        };
        
        fetchSections();
    }, [id]);

    useEffect(() => {
        if (!id) return;
        
        const fetchTasks = async () => {
            const accessToken = await SecureStore.getItemAsync("accessToken");
            if (!accessToken) return;
            
            try {
                const response = await fetch(`${BackendUrl}/api/project/${id}/getTasks`, {
                    method: "GET",
                    headers: {
                        Authorization: accessToken,
                        "Content-Type": "application/json",
                    },
                });
                
                if (!response.ok) {
                    throw new Error("Failed to fetch tasks");
                }
                
                const tasks = await response.json();
                setTasks(tasks);
            } catch (err) {
                console.error("Error fetching tasks:", err);
            }
        };
        
        fetchTasks();
    }, [id]);

    // Combine sections with their tasks
    useEffect(() => {
        if (sections.length > 0) {
            const tasksBySection = tasks.reduce((acc, task) => {
                const sectionId = task.sectionId;
                if (!acc[sectionId]) {
                    acc[sectionId] = [];
                }
                acc[sectionId].push(task);
                return acc;
            }, {} as Record<string, Task[]>);

            const sectionsWithTasks: SectionWithTasks[] = sections.map(section => ({
                ...section,
                tasks: tasksBySection[section.id] || []
            }));

            setSectionsWithTasks(sectionsWithTasks);
        }
    }, [sections, tasks]);

    // Helper functions using your actual TaskStatus enum
    const getStatusString = (status: TaskStatus): string => {
        switch (status) {
            case TaskStatus.Planned: return "Planowane";
            case TaskStatus.OnTrack: return "Dobrze idzie";
            case TaskStatus.Finished: return "Ukończone";
            case TaskStatus.Problem: return "Problem";
            default: return "planned";
        }
    };

    const getPriorityString = (priority: number): string => {
        switch (priority) {
            case 1: return "Niski";
            case 2: return "Średni";
            case 3: return "Wysoki";
            case 4: return "Priorytetowy";
            default: return "Średni";
        }
    };

    const formatDate = (date: Date | string): string => {
        if (!date) return "";
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleDateString();
    };

    const isTaskCompleted = (task: Task): boolean => {
        return task.status === TaskStatus.Finished || task.finished != null;
    };

    const files = ["test.pdf", "Dtest.zip", "testh.docx"];

    const menuOptions = [
        { title: "Edit Project", icon: "pencil" },
        { title: "Share Project", icon: "share" },
        { title: "Archive Project", icon: "archive" },
        { title: "Delete Project", icon: "delete", destructive: true },
    ];

    const sectionMenuOptions = [
        { title: "Edit Section", icon: "pencil" },
        { title: "Add Task", icon: "plus" },
        { title: "Delete Section", icon: "delete", destructive: true },
    ];

    const handleMenuOption = (option: string) => {
        setMenuVisible(false);
        console.log("Selected:", option);
    };

    const handleSectionMenuOption = (option: string) => {
        setSectionMenuVisible(false);
        console.log("Section option:", option, "for section:", selectedSection);
    };

    const toggleTaskCompletion = async (sectionId: string, taskId: string) => {
        if (isLoading) return; // Prevent multiple simultaneous requests
        
        const currentTask = tasks.find(t => t.id === taskId);
        if (!currentTask) return;

        const newStatus = isTaskCompleted(currentTask) ? TaskStatus.OnTrack : TaskStatus.Finished;
        const newFinished = isTaskCompleted(currentTask) ? null : new Date();

        setIsLoading(true);

        // Update local state immediately for better UX
        setSectionsWithTasks((prevSections) =>
            prevSections.map((section) =>
                section.id === sectionId
                    ? {
                        ...section,
                        tasks: section.tasks.map((task) =>
                            task.id === taskId
                                ? { 
                                    ...task, 
                                    status: newStatus,
                                    finished: newFinished
                                }
                                : task
                        ),
                    }
                    : section
            )
        );

        // Also update the tasks array
        setTasks(prevTasks => 
            prevTasks.map(task => 
                task.id === taskId 
                    ? { ...task, status: newStatus, finished: newFinished }
                    : task
            )
        );

        // API call to update task status on server
        try {
            const accessToken = await SecureStore.getItemAsync("accessToken");
            if (!accessToken) {
                throw new Error("No access token found");
            }

            const response = await fetch(`${BackendUrl}/api/project/${id}/${taskId}/updateStatus`, {
                method: "PUT",
                headers: {
                    Authorization: accessToken,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    status: newStatus,
                    finished: newFinished 
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to update task status: ${response.status}`);
            }

            // Optionally handle the response
            const updatedTask = await response.json();
            console.log("Task updated successfully:", updatedTask);

        } catch (error) {
            console.error("Error updating task status:", error);
            
            // Revert local state changes if API call fails
            setSectionsWithTasks((prevSections) =>
                prevSections.map((section) =>
                    section.id === sectionId
                        ? {
                            ...section,
                            tasks: section.tasks.map((task) =>
                                task.id === taskId
                                    ? currentTask // Revert to original task
                                    : task
                            ),
                        }
                        : section
                )
            );

            setTasks(prevTasks => 
                prevTasks.map(task => 
                    task.id === taskId 
                        ? currentTask // Revert to original task
                        : task
                )
            );

            // Show error message to user
            alert("Failed to update task status. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const getPriorityColor = (priority: number): string => {
        switch (priority) {
            case 4: return "#e74c3c"; // urgent - red
            case 3: return "#f39c12"; // high - orange
            case 2: return "#f1c40f"; // medium - yellow
            case 1: return "#27ae60"; // low - green
            default: return "#95a5a6"; // default - gray
        }
    };

    const getStatusColor = (status: TaskStatus): string => {
        switch (status) {
            case TaskStatus.Finished: return "#27ae60"; // green
            case TaskStatus.OnTrack: return "#3498db"; // blue
            case TaskStatus.Problem: return "#e74c3c"; // red
            case TaskStatus.Planned: return "#95a5a6"; // gray
            default: return "#95a5a6";
        }
    };

    const renderTask = (task: Task, sectionId: string) => {
        const completed = isTaskCompleted(task);
        const priorityString = getPriorityString(Number(task.priority));
        const statusString = getStatusString(task.status);

        return (
            <Card key={task.id} style={styles.taskCard}>
                <Card.Content>
                    <View style={styles.taskHeader}>
                        <View style={styles.taskTitleRow}>
                            <Checkbox
                                status={completed ? "checked" : "unchecked"}
                                onPress={() => toggleTaskCompletion(sectionId, task.id)}
                                disabled={isLoading}
                            />
                            <Text
                                style={[
                                    styles.taskTitle,
                                    completed && styles.completedTask,
                                ]}
                            >
                                {task.name}
                            </Text>
                        </View>
                    </View>

                    {task.description && (
                        <Text
                            style={[
                                styles.taskDescription,
                                completed && styles.completedTask,
                            ]}
                            numberOfLines={2}
                        >
                            {task.description}
                        </Text>
                    )}

                    <View style={styles.taskMetadata}>
                        <View style={styles.taskChips}>
                            <View
                                style={[
                                    styles.priorityChip,
                                    { backgroundColor: getPriorityColor(Number(task.priority)) + '20' }
                                ]}
                            >
                                <Text style={[styles.chipText, { color: getPriorityColor(Number(task.priority)) }]}>
                                    {priorityString.toUpperCase()}
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.statusChip,
                                    { backgroundColor: getStatusColor(task.status) + '20' }
                                ]}
                            >
                                <Text style={[styles.chipText, { color: getStatusColor(task.status) }]}>
                                    {statusString.replace('-', ' ').toUpperCase()}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.taskFooter}>
                            <View style={styles.assignedUsers}>
                                {task.assignedUsers && task.assignedUsers.slice(0, 3).map((user, index) => (
                                    <Avatar.Text
                                        key={index}
                                        size={24}
                                        label={user.charAt(0).toUpperCase()}
                                        style={[styles.userAvatar, { marginLeft: index > 0 ? -8 : 0 }]}
                                    />
                                ))}
                                {task.assignedUsers && task.assignedUsers.length > 3 && (
                                    <Text style={styles.moreUsers}>
                                        +{task.assignedUsers.length - 3}
                                    </Text>
                                )}
                            </View>
                            {task.deadlineDate && (
                                <Text style={styles.dueDate}>
                                    Due: {formatDate(task.deadlineDate)}
                                </Text>
                            )}
                        </View>
                    </View>
                </Card.Content>
            </Card>
        );
    };

    const renderSection = (section: SectionWithTasks) => (
        <View key={section.id} style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{section.name}</Text>
                <View style={styles.sectionActions}>
                    <Text style={styles.taskCount}>{section.tasks.length}</Text>
                    <IconButton
                        icon="dots-vertical"
                        size={20}
                        onPress={() => {
                            setSelectedSection(section.id);
                            setSectionMenuVisible(true);
                        }}
                    />
                </View>
            </View>
            <ScrollView
                style={styles.tasksScrollView}
                showsVerticalScrollIndicator={false}
            >
                {section.tasks.map((task) => renderTask(task, section.id))}
            </ScrollView>
        </View>
    );

    // const handleBackPress = () => {
    //     if (navigation && navigation.goBack) {
    //         navigation.goBack();
    //     } else {
    //         router.back();
    //     }
    // };

    return (
        <SafeAreaView style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.replace("/(tabs)/spicelab")} />
                <Appbar.Content title={projectData?.name || "Project"} />
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

            {activeTab === "Overview" && (
                <ScrollView contentContainerStyle={styles.content}>
                    <Text style={styles.sectionHeaderText}>Description</Text>
                    <Text style={styles.paragraph}>
                        {projectData?.description || "No description available"}
                    </Text>

                    <Divider style={styles.sectionDivider} />

                    <Text style={styles.sectionHeaderText}>Files</Text>
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
            )}

            {activeTab === "Tasks" && (
                <View style={styles.tasksContainer}>
                    {sectionsWithTasks.length > 0 ? (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.boardContainer}
                        >
                            {sectionsWithTasks.map((section) => renderSection(section))}
                        </ScrollView>
                    ) : (
                        <View style={styles.emptyTasksContainer}>
                            <Text style={styles.emptyState}>No sections found</Text>
                            <Text style={styles.emptyStateSubtext}>
                                Create sections to organize your tasks
                            </Text>
                        </View>
                    )}
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

            {/* Section Menu Modal */}
            <Modal
                visible={sectionMenuVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setSectionMenuVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setSectionMenuVisible(false)}
                >
                    <View style={styles.bottomSheet}>
                        <View style={styles.bottomSheetHandle} />
                        <Text style={styles.bottomSheetTitle}>Section Options</Text>
                        {sectionMenuOptions.map((option) => (
                            <TouchableOpacity
                                key={option.title}
                                style={styles.menuOption}
                                onPress={() => handleSectionMenuOption(option.title)}
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
    sectionHeaderText: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#333",
    },
    sectionDivider: {
        marginVertical: 16,
    },
    paragraph: {
        fontSize: 16,
        marginBottom: 16,
        color: "#666",
        lineHeight: 22,
    },
    button: {
        alignSelf: "flex-start",
        marginTop: 12,
    },
    tasksContainer: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    emptyTasksContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 60,
    },
    emptyState: {
        fontSize: 18,
        color: "#666",
        marginBottom: 8,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: "#999",
        textAlign: "center",
    },
    boardContainer: {
        padding: 16,
        minHeight: "100%",
    },
    section: {
        width: 280,
        marginRight: 16,
        backgroundColor: "#fff",
        borderRadius: 8,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        maxHeight: "100%",
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    sectionActions: {
        flexDirection: "row",
        alignItems: "center",
    },
    taskCount: {
        fontSize: 12,
        color: "#666",
        backgroundColor: "#f0f0f0",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 8,
    },
    tasksScrollView: {
        flex: 1,
        padding: 16,
    },
    taskCard: {
        marginBottom: 12,
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    taskHeader: {
        marginBottom: 8,
    },
    taskTitleRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    taskTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        flex: 1,
        marginLeft: 8,
    },
    completedTask: {
        textDecorationLine: "line-through",
        color: "#999",
    },
    taskDescription: {
        fontSize: 14,
        color: "#666",
        marginBottom: 12,
        lineHeight: 20,
    },
    taskMetadata: {
        gap: 8,
    },
    taskChips: {
        flexDirection: "row",
        gap: 6,
        marginBottom: 8,
    },
    priorityChip: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    statusChip: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    chipText: {
        fontSize: 10,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    taskFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    assignedUsers: {
        flexDirection: "row",
        alignItems: "center",
    },
    userAvatar: {
        backgroundColor: "#1976d2",
    },
    moreUsers: {
        fontSize: 12,
        color: "#666",
        marginLeft: 4,
    },
    dueDate: {
        fontSize: 12,
        color: "#666",
    },
    fab: {
        position: "absolute",
        right: 16,
        bottom: 24,
        backgroundColor: "#0b80ee",
    },
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
});

export default ProjectTasksScreen;
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
} from 'react-native';
import {
  Provider as PaperProvider,
  Appbar,
  TextInput,
  Button,
  Menu,
  Portal,
} from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import { BackendUrl } from '@/Constants/backend';
import { router } from 'expo-router';

export default function NewProject() {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [deptMenuVisible, setDeptMenuVisible] = useState(false);
  const [department, setDepartment] = useState<string[]>([]);

  const openDeptMenu = () => setDeptMenuVisible(true);
  const closeDeptMenu = () => setDeptMenuVisible(false);

  // toggle a dept in/out of the selection array
  const toggleDepartment = (dept: string) => {
    setDepartment((prev) =>
      prev.includes(dept)
        ? prev.filter((d) => d !== dept)
        : [...prev, dept]
    );
    // do *not* auto-close; allow multi-select
  };

  const createProject = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync('accessToken');
      if (!accessToken) return;

      const payload = {
        name: projectName,
        description,
        scopes: department, // now an array
      };

      const response = await fetch(
        `${BackendUrl}/api/project/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: accessToken,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      await response.json();
      router.replace('/(tabs)/spicehub');
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const deptOptions = [
    'NaDr',
    'Programmers',
    'Mechanics',
    'SocialMedia',
    'Marketing',
    'Executive',
    'Mentor',
  ];

  return (
    <PaperProvider>
      <Portal.Host>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <Appbar.Header style={styles.header}>
            <Appbar.Action
              icon="close"
              onPress={() => router.replace('/(tabs)/spicehub')}
              color="#111518"
            />
            <Appbar.Content
              title="New Project"
              titleStyle={styles.headerTitle}
            />
            <Appbar.Action icon="" disabled />
          </Appbar.Header>

          <View style={styles.container}>
            <TextInput
              label="Project Name"
              mode="outlined"
              value={projectName}
              onChangeText={setProjectName}
              placeholder="Project Name"
              style={styles.input}
              activeOutlineColor="#1976d2"
            />

            <TextInput
              label="Description"
              mode="outlined"
              value={description}
              onChangeText={setDescription}
              placeholder="Description"
              multiline
              numberOfLines={4}
              style={[styles.input, styles.textArea]}
              activeOutlineColor="#1976d2"
            />

            <Menu
              visible={deptMenuVisible}
              onDismiss={closeDeptMenu}
              anchor={
                <TextInput
                  label="Department"
                  mode="outlined"
                  value={department.join(', ')}
                  placeholder="Select departments"
                  editable={false}
                  style={styles.input}
                  right={
                    <TextInput.Icon
                      icon="chevron-down"
                      onPress={openDeptMenu}
                      color="#60768a"
                    />
                  }
                />
              }
            >
              {deptOptions.map((item) => (
                <Menu.Item
                  key={item}
                  onPress={() => toggleDepartment(item)}
                  title={
                    department.includes(item)
                      ? `✓ ${item}`
                      : item
                  }
                />
              ))}
            </Menu>
          </View>

          <View style={styles.footer}>
            <View style={{ marginBottom: 26 }}>
              <Button
                mode="contained"
                onPress={createProject}
                style={styles.button}
                contentStyle={styles.buttonContent}
                disabled={
                  !projectName || department.length === 0
                }
                labelStyle={styles.buttonLabel}
              >
                Create Project
              </Button>
            </View>
          </View>
        </SafeAreaView>
      </Portal.Host>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: '#ffffff', elevation: 0 },
  headerTitle: {
    color: '#111518',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  input: {
    backgroundColor: '#f0f2f5',
    borderRadius: 12,
    height: 56,
    marginBottom: 16,
  },
  textArea: { height: 144, textAlignVertical: 'top' },
  footer: { padding: 16, backgroundColor: '#ffffff' },
  button: { borderRadius: 24, backgroundColor: '#0b80ee' },
  buttonContent: { height: 48 },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
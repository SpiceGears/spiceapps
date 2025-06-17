import { router } from 'expo-router';
import * as React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Appbar,
  Card,
  Text,
  IconButton,
  useTheme,
} from 'react-native-paper';

export default function App() {
  return (
    <>
      <Appbar.Header>
        <Appbar.Action icon="menu" onPress={() => {}} />
        <Appbar.Content title="Dashboard" />
      </Appbar.Header>
      <DashboardRoute />
    </>
  );
}

function DashboardRoute() {
  const theme = useTheme();
  const [isOpen] = React.useState(true); // workshop open/closed
  const badgeLabel = isOpen ? 'Open' : 'Closed';
  const successColor = '#4caf50';
  const badgeColor = isOpen ? successColor : theme.colors.error;

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {/* WORKSHOP WIDGET */}
      <Card
        style={[
          styles.card,
          { backgroundColor: theme.colors.surface, elevation: 2 },
        ]}
      >
        <Card.Content>
          <View style={[styles.header, { justifyContent: 'flex-start' }]}>
            <Text variant="titleMedium">Workshop</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: badgeColor },
              ]}
            >
              <Text style={styles.statusText}>{badgeLabel}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoBlock}>
              <IconButton
                icon="account-group-outline"
                size={20}
                iconColor={theme.colors.primary}
                style={styles.iconButton}
              />
              <View>
                <Text
                  variant="labelSmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Participants
                </Text>
                <Text variant="bodyLarge">12</Text>
              </View>
            </View>
            <View style={styles.infoBlock}>
              <IconButton
                icon="clock-outline"
                size={20}
                iconColor={theme.colors.primary}
                style={styles.iconButton}
              />
              <View>
                <Text
                  variant="labelSmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Duration
                </Text>
                <Text variant="bodyLarge">10:00</Text>
              </View>
            </View>
            <IconButton
              icon="chevron-right"
              size={24}
              iconColor={theme.colors.primary}
              onPress={() => {
                /* workshop details */
              }}
            />
          </View>
        </Card.Content>
      </Card>

      {/* SEASON WIDGET */}
      <Card
        style={[
          styles.card,
          { backgroundColor: theme.colors.surface, elevation: 2 },
        ]}
      >
        <Card.Content>
          <View style={styles.header}>
            <IconButton
              icon="earth"
              size={20}
              iconColor={theme.colors.onSurfaceVariant}
              style={styles.iconButton}
            />
            <Text
              variant="titleMedium"
              style={[styles.flex, { color: theme.colors.onSurfaceVariant }]}
            >
              Off-Season
            </Text>
            <IconButton
              icon="chevron-right"
              size={24}
              iconColor={theme.colors.onSurfaceVariant}
              onPress={() => {}}
            />
          </View>
          <Text
            variant="bodySmall"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            No active season — enjoy the off-season!
          </Text>
        </Card.Content>
      </Card>

      {/* SPICELAB WIDGET */}
      <Card
        style={[
          styles.card,
          { backgroundColor: theme.colors.surface, elevation: 2 },
        ]}
      >
        <Card.Content>
          <View style={[styles.header, { justifyContent: 'flex-start' }]}>
            <Text variant="titleMedium">SpiceLab</Text>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoBlock}>
              <IconButton
                icon="format-list-bulleted"
                size={20}
                iconColor={theme.colors.primary}
                style={styles.iconButton}
              />
              <View>
                <Text
                  variant="labelSmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Nierobione zadania
                </Text>
                <Text variant="bodyLarge">1</Text>
              </View>
            </View>
            <View style={styles.infoBlock}>
              <IconButton
                icon="information-outline"
                size={20}
                iconColor={theme.colors.primary}
                style={styles.iconButton}
              />
              <View>
                <Text
                  variant="labelSmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Ważne projekty
                </Text>
                <Text variant="bodyLarge">1</Text>
              </View>
            </View>
            <IconButton
              icon="chevron-right"
              size={24}
              iconColor={theme.colors.primary}
              onPress={() => {
                /* navigate to SpiceLab */
              }}
            />
          </View>
        </Card.Content>
      </Card>
      <View style={{ alignItems: 'center', marginTop: 16 }}>
        <Appbar.Action
          icon="login"
          color={theme.colors.primary}
          size={32}
          onPress={() => {
            router.replace("/auth")
          }}
          accessibilityLabel="Go to Auth"
          style={{ backgroundColor: theme.colors.elevation.level1, borderRadius: 24 }}
        />
        <Text variant="labelLarge" style={{ marginTop: 8 }}>
          Go to Auth
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  card: {
    borderRadius: 12,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    marginLeft: 8,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  iconButton: {
    margin: 0,
    padding: 0,
    marginRight: 8,
  },
  flex: {
    flex: 1,
  },
});
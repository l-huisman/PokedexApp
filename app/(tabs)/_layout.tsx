import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { HapticTab } from '@/components/haptic-tab';
import { DesignTokens } from '@/constants/design-tokens';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const activeColorScheme = colorScheme === 'dark' ? 'dark' : 'light';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[activeColorScheme].tint,
        tabBarInactiveTintColor: DesignTokens.colors.midnight,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Pokémons',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="catching-pokemon" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="favorite-border" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Platform.select({
      ios: 'rgba(237, 246, 255, 0.5)',
      default: DesignTokens.colors.background,
    }),
    borderTopWidth: 0,
    elevation: 0,
    height: Platform.select({ ios: 84, default: 60 }),
    paddingTop: 4,
  },
  tabBarLabel: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 10,
  },
});

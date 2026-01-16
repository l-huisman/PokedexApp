import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { HapticTab } from '@/components/haptic-tab';
import { useTheme } from '@/contexts/theme-context';
import { useThemedColors } from '@/hooks/use-themed-tokens';

export default function TabLayout() {
  const { isDark } = useTheme();
  const colors = useThemedColors();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.midnight,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: Platform.select({
            ios: isDark ? 'rgba(18, 18, 18, 0.5)' : 'rgba(237, 246, 255, 0.5)',
            default: colors.background,
          }),
          borderTopWidth: 0,
          elevation: 0,
          height: Platform.select({ ios: 84, default: 60 }),
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontFamily: 'Rubik_500Medium',
          fontSize: 10,
        },
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

import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={20} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#087f23',
        tabBarInactiveTintColor: '#b6b6b6',
        tabBarLabelStyle: {
          fontSize: 8,
          letterSpacing: 1,
          textTransform: 'uppercase',
        },
        tabBarStyle: {
          height: Platform.select({ ios: 72, default: 66 }),
          paddingTop: 7,
          paddingBottom: Platform.select({ ios: 18, default: 10 }),
          borderTopWidth: 0,
          backgroundColor: '#ffffff',
          shadowColor: '#000000',
          shadowOpacity: 0.08,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: -4 },
          elevation: 12,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color }) => <TabBarIcon name="heart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="categorias/[nombre]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="marcas/[nombre]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="tastes/[nombre]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="ficha/[id]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

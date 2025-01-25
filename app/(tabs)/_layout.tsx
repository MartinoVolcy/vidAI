import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
//import { useSupabaseClient } from '@supabase/auth-helpers-react'; // Ensure Supabase auth is set up
import { supabase } from '@/lib/supabase';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  //const supabase = useSupabaseClient(); // Initialize Supabase client

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        alert('Error logging out');
      } else {
        console.log('Logged out successfully');
        // Redirect to login or perform any other action after logout
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('Unexpected error during logout');
    }
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'left', // Align title to the left
        headerTitle: '', // Prevent showing the tab name
        headerLeft: () => (
          <Text style={styles.headerTitle}>VidAI</Text> // Custom "VidAI" component
        ),
        headerRight: () => (
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout} // Supabase logout function
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        ),
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Upload',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="paperplane.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Saved Videos',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 24, // Increase font size for a bigger logo
    fontWeight: 'bold',
    color: '#fff', // White color for the logo
    marginLeft: 20, // Space from the edge
  },
  logoutButton: {
    marginRight: 10, // Space from the edge
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

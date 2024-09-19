import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}>
      <Tabs.Screen
        name="homeScreen"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="loginForm"
        options={{
          title: 'Explore',
        }}
      />
      <Tabs.Screen
        name='ProductDetails'
        options={{
          title: 'Details',
        }}
      />
    </Tabs>
  );
}

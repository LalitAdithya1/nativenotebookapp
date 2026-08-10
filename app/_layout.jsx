import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { NotebookProvider } from '../src/context/NotebookContext.jsx';

export default function RootLayout() {
  return (
    <NotebookProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#F8FAFC' },
          animation: 'slide_from_right',
        }}
      />
    </NotebookProvider>
  );
}

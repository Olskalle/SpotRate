import { MarkerProvider } from '@/context/MarkerContext';
import { MarkerImageProvider } from '@/context/MarkerImageContext';
import { Stack } from 'expo-router';
import { StatusBar } from "expo-status-bar";
import React from 'react';

export default function RootLayout() {
  return (
    <>
      <MarkerProvider>
        <MarkerImageProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="light" />
        </MarkerImageProvider>
      </MarkerProvider>
    </>
  );
}

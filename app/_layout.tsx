import { MarkerProvider } from '@/context/MarkerContext';
import { MarkerImageProvider } from '@/context/MarkerImageContext';
import { db } from '@/database/client';
import migrations from '@/drizzle/migrations';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { Stack } from 'expo-router';
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from 'react';

export default function RootLayout() {

  const { success, error } = useMigrations(db, migrations);

  if (error) {
    console.error("Failed to apply migrations", error);
  }

  if (success) {
    console.log("Migrated successfully");
  }

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

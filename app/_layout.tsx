import { setupErrorLogging } from '../utils/errorLogger';
import { StatusBar } from 'expo-status-bar';
import { Stack, useGlobalSearchParams } from 'expo-router';
import { commonStyles } from '../styles/commonStyles';
import { Platform, SafeAreaView } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'natively_emulate_web';

export default function RootLayout() {
  const { emulate } = useGlobalSearchParams();
  const insets = useSafeAreaInsets();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setupErrorLogging();
    setIsReady(true);
  }, [emulate]);

  if (!isReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: commonStyles.container.backgroundColor,
            paddingTop: Platform.OS === 'ios' ? 0 : insets.top,
          },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="diagnostic" />
        <Stack.Screen name="scribe" />
        <Stack.Screen name="scanner" />
        <Stack.Screen name="genomic" />
        <Stack.Screen name="lab" />
        <Stack.Screen name="motion" />
        <Stack.Screen name="vitals" />
        <Stack.Screen name="agent" />
        <Stack.Screen name="training" />
      </Stack>
    </SafeAreaProvider>
  );
}
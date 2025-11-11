import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useFonts } from 'expo-font';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from './context/_AuthContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
    ...MaterialIcons.font,
    ...FontAwesome5.font,
  });

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <Stack>
          <Stack.Screen name="welcome" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          <Stack.Screen name="user/dashboard" options={{ title: 'Panel de Usuario' }} />
          <Stack.Screen name="technician/dashboard" options={{ title: 'Panel de Técnico' }} />
          <Stack.Screen name="admin/index" options={{ title: 'Panel de Administrador' }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
        </Stack>
      </AuthProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

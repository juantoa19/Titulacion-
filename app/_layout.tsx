import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useFonts } from 'expo-font';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from './context/_AuthContext'; // 1. Importar useAuth
import React, { useEffect } from 'react'; // 2. Importar React y useEffect
import { ActivityIndicator, View } from 'react-native'; // 3. Importar ActivityIndicator

export const unstable_settings = {
  anchor: '(tabs)',
};

/**
 * Este componente es el "Guardián".
 * Se ejecutará dentro de AuthProvider y tendrá acceso al 'user'.
 */
function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  const segments = useSegments(); // Nos dice en qué "sección" de la app estamos
  const router = useRouter();

  useEffect(() => {
    // No hacer nada mientras carga el estado de autenticación
    if (isLoading) {
      return;
    }

    const inAuthGroup = segments[0] === 'auth';

    if (!user && !inAuthGroup) {
      // Si NO hay usuario Y NO está en el grupo 'auth' (login/register)
      // lo mandamos al login.
      router.replace('/auth/login');
    } else if (user && inAuthGroup) {
      // Si SÍ hay usuario Y SÍ está en el grupo 'auth' (o sea, en login/register)
      // lo mandamos a su panel correspondiente.
      let path: any = '/receptionist/dashboard';
      if (user.role === 'admin') {
        path = '/admin';
      } else if (user.role === 'tecnico') {
        path = '/technician/dashboard';
      }
      router.replace(path);
    }

  }, [user, isLoading, segments, router]); // Se re-ejecuta si el usuario o la ruta cambian

  // Mostrar un spinner mientras 'isLoading' es true
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Cuando ya cargó, muestra las pantallas
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Estas son las pantallas que el guardián de arriba está protegiendo.
        Si el usuario no está logueado, será redirigido ANTES de verlas.
      */}
      <Stack.Screen name="welcome" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      <Stack.Screen name="receptionist/dashboard" />
      <Stack.Screen name="technician/dashboard" />
      <Stack.Screen name="admin/index" />
      
      {/* Esta es la pantalla de 'auth' (login/register). 
        El guardián nos sacará de aquí si ya estamos logueados.
      */}
      <Stack.Screen name="auth" />
    </Stack>
  );
}

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
        {/* Renderizamos nuestro guardián DENTRO del AuthProvider
          para que tenga acceso a useAuth()
        */}
        <RootLayoutNav />
      </AuthProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
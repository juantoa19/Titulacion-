import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { router, useSegments, Href } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { apiFetch, TOKEN_KEY } from '../services/api'; 

// --- 1. INTERFACES (SIN CAMBIOS) ---
export interface User {
  id: number;
  name: string;
  nombre2?: string;
  apellido1: string;
  apellido2?: string;
  cedula: string;
  telefono: string;
  email: string;
  direccion?: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  role: 'admin' | 'tecnico' | 'usuario'; 
}

export interface Ticket {
  id: number;
  user_id: number;
  tecnico_id: number | null;
  tipo_dispositivo: string;
  marca: string;
  modelo: string;
  numero_serie: string | null;
  descripcion_problema: string;
  estado_usuario: 'pendiente' | 'en_revision' | 'reparado' | 'cerrado';
  estado_interno: 'sin_iniciar' | 'en_proceso' | 'completado';
  prioridad: 'baja' | 'media' | 'alta';
  created_at: string;
  updated_at: string;
  usuario?: User;
  tecnico?: User | null;
}

export interface TicketFormData {
  tipo_dispositivo: string;
  marca: string;
  modelo: string;
  numero_serie: string | null;
  descripcion_problema: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string; 
  nombre2?: string | null;
  apellido1: string;
  apellido2?: string | null;
  cedula: string;
  telefono: string;
  direccion?: string | null;
  email: string;
  password: string;
  password_confirmation: string;
}

// Interfaz del Contexto
interface AuthContextType {
  user: User | null;
  token: string | null;
  tickets: Ticket[];
  isLoading: boolean;
  login: (data: LoginData) => Promise<User>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  fetchUserTickets: (currentToken?: string | null) => Promise<void>;
  createTicket: (data: TicketFormData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// --- EL PROVEEDOR (PROVIDER) ---

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true); 
  const segments = useSegments();

  // ... (Efecto loadUserFromToken sin cambios) ...
  useEffect(() => {
    async function loadUserFromToken() {
      try {
        const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
        if (storedToken) {
          setToken(storedToken);
          const data = await apiFetch('/user', 'GET', null, storedToken);
          setUser(data.user);
          await fetchUserTickets(storedToken); 
        }
      } catch (e) {
        console.error('Error al cargar usuario desde token:', e);
        await AsyncStorage.removeItem(TOKEN_KEY);
      } finally {
        setIsLoading(false);
      }
    }
    loadUserFromToken();
  }, []);

  // ... (Efecto Guardián de Rutas sin cambios) ...
  useEffect(() => {
    if (isLoading) return; 
    const inAuthGroup = segments[0] === 'auth';
    if (!user && !inAuthGroup) {
      router.replace('/auth/login' as Href);
    } else if (user && inAuthGroup) {
      redirectToPanel(user.role);
    }
  }, [user, isLoading, segments]);

  // ... (Funciones login, register, logout sin cambios) ...
  const login = async (data: LoginData) => {
    const response = await apiFetch('/login', 'POST', data);
    
    // 1. CREAR EL USUARIO COMPLETO FUSIONANDO EL ROL
    // Como 'role' viene afuera en tu API, lo metemos a la fuerza dentro del objeto user
    const userWithRole = {
      ...response.user,
      role: response.role // <--- AQUÍ ESTÁ LA MAGIA
    };

    setToken(response.token);
    await AsyncStorage.setItem(TOKEN_KEY, response.token);
    
    // 2. GUARDAR EL USUARIO CON EL ROL YA INCLUIDO
    setUser(userWithRole);
    
    // Opcional: Cargar tickets
    await fetchUserTickets(response.token);
    
    // 3. RETORNAR EL USUARIO CORREGIDO (Para que el LoginScreen lo lea bien)
    return userWithRole;
  };

  const register = async (data: RegisterData) => {
    await apiFetch('/signup', 'POST', data);
  };

  const logout = async () => {
    try {
      await apiFetch('/logout', 'POST');
    } catch (e) {
      console.error('Error al hacer logout en API:', e);
    } finally {
      setUser(null);
      setToken(null);
      setTickets([]);
      await AsyncStorage.removeItem(TOKEN_KEY);
    }
  };


  // ... (Funciones fetchUserTickets, createTicket sin cambios) ...
  const fetchUserTickets = async (currentToken?: string | null) => {
    const t = token || currentToken;
    if (!t) return; 
    try {
      const userTickets = await apiFetch('/tickets', 'GET', null, t);
      setTickets(userTickets);
    } catch (e) {
      console.error('Error al cargar tickets:', e);
      if ((e as any).response?.status === 401) {
        logout();
      }
    }
  };

  // --- ¡AQUÍ ESTÁ LA CORRECCIÓN CLAVE! ---
  const createTicket = async (formData: TicketFormData) => {
    if (!token) throw new Error('No autenticado');
    try {
      // 1. Llama a la API para crear el ticket
      const newTicket = await apiFetch('/tickets', 'POST', formData, token);
      
      // 2. CORRECCIÓN: No añadir 'newTicket' al estado local.
      // En su lugar, volvemos a cargar la lista completa desde la API.
      // Esto garantiza que los datos (incluyendo el estado 'pendiente') son 100% correctos.
      await fetchUserTickets(token); 
    } catch (error) {
      console.error('Error al crear ticket:', error);
      throw error;
    }
  };


  // ... (Función redirectToPanel sin cambios) ...
  const redirectToPanel = (role: string) => {
    if (role === 'admin') {
      router.replace('/admin/index' as Href);
    } else if (role === 'tecnico') {
      router.replace('/technician/dashboard' as Href);
    } else {
      router.replace('/user/dashboard' as Href);
    }
  };

  const value = {
    user,
    token,
    tickets,
    isLoading,
    login,
    register,
    logout,
    fetchUserTickets,
    createTicket,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
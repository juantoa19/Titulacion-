import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
// Quitamos useRouter y useSegments de aquí para evitar conflictos
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { apiFetch, TOKEN_KEY } from '../services/api'; 

// --- 1. INTERFACES ---
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
  cliente_cedula: string;
  cliente_nombre: string;
  cliente_direccion?: string;
  cliente_celular?: string;  
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    async function loadUserFromToken() {
      try {
        const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
        if (storedToken) {
          setToken(storedToken);
          const data = await apiFetch('/user', 'GET', null, storedToken);
          // Aseguramos que el rol esté presente en el objeto usuario
          const userWithRole = { ...data, role: data.role || data.roles?.[0]?.name }; 
          setUser(userWithRole);
          
          if (userWithRole.role !== 'admin') {
             await fetchUserTickets(storedToken); 
          }
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

  // --- ELIMINADO: useEffect de redirección (Se mueve a _layout.tsx) ---

  const login = async (data: LoginData) => {
    const response = await apiFetch('/login', 'POST', data);
    
    const userWithRole = {
      ...response.user,
      role: response.role 
    };

    setToken(response.token);
    await AsyncStorage.setItem(TOKEN_KEY, response.token);
    setUser(userWithRole);
    
    if (userWithRole.role !== 'admin') {
        await fetchUserTickets(response.token);
    }
    
    return userWithRole;
  };

  const register = async (data: RegisterData) => {
    await apiFetch('/signup', 'POST', data);
  };

  const logout = async () => {
    try {
      await apiFetch('/logout', 'POST');
    } catch (e) {
      console.error('Error logout API:', e);
    } finally {
      setUser(null);
      setToken(null);
      setTickets([]);
      await AsyncStorage.removeItem(TOKEN_KEY);
    }
  };

  const fetchUserTickets = async (currentToken?: string | null) => {
    const t = token || currentToken;
    if (!t) return; 
    try {
      const userTickets = await apiFetch('/tickets', 'GET', null, t);
      setTickets(userTickets);
    } catch (e) {
      console.error('Error tickets:', e);
    }
  };

  const createTicket = async (formData: TicketFormData) => {
    if (!token) throw new Error('No autenticado');
    try {
      await apiFetch('/tickets', 'POST', formData, token);
      await fetchUserTickets(token); 
    } catch (error) {
      console.error('Error create ticket:', error);
      throw error;
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
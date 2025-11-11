import React, { createContext, useState, useContext, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  role: 'user' | 'technician' | 'admin';
  name: string;
}

type TicketStatus = 'pendiente' | 'en_revision' | 'reparado' | 'cerrado';

interface Ticket {
  id: string;
  ticketId: string;
  userId: string;
  deviceInfo: {
    tipoDispositivo: string;
    marca: string;
    modelo: string;
    numeroSerie?: string;
  };
  problema: string;
  fechaSolicitud: string;
  estado: TicketStatus;
  prioridad?: 'alta' | 'media' | 'baja';
}

interface Notification {
  id: string;
  userId: string; // destinatario
  title: string;
  message: string;
  ticketId?: string;
  date: string;
  read: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  tickets: Ticket[];
  notifications: Notification[];
  createTicket: (ticket: Omit<Ticket, 'id' | 'ticketId' | 'fechaSolicitud' | 'estado'>) => Promise<Ticket>;
  updateTicketStatus: (id: string, newStatus: TicketStatus) => void;
  addNotification: (n: Omit<Notification, 'id' | 'date' | 'read'>) => Notification;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (userId?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const login = async (email: string, password: string) => {
    // Simulación de login - en una app real harías una API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        let role: 'user' | 'technician' | 'admin' = 'user';
        
        // Asignar rol basado en el email
        if (email.includes('admin')) role = 'admin';
        if (email.includes('tech')) role = 'technician';
        
        const mockUser: User = {
          id: '1',
          email,
          role,
          name: email.split('@')[0]
        };
        
        setUser(mockUser);
        resolve();
      }, 1000);
    });
  };

  const register = async (email: string, password: string, name: string, selectedRole: 'user' | 'technician' | 'admin' = 'user') => {
    // Simulación de registro
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const mockUser: User = {
          id: '1',
          email,
          role: selectedRole,
          name
        };
        setUser(mockUser);
        resolve();
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
  };

  // Tickets management
  const createTicket = async (ticket: Omit<Ticket, 'id' | 'ticketId' | 'fechaSolicitud' | 'estado'>) => {
    const id = Math.random().toString(36).slice(2, 9);
    const ticketId = `TKT-${Date.now().toString().slice(-6)}`;
    const newTicket: Ticket = {
      id,
      ticketId,
      ...ticket,
      fechaSolicitud: new Date().toISOString(),
      estado: 'pendiente',
    };
    setTickets(prev => [newTicket, ...prev]);
    return newTicket;
  };

  const updateTicketStatus = (id: string, newStatus: TicketStatus) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, estado: newStatus } : t));

    // Crear una notificación para el owner del ticket
    const ticket = tickets.find(t => t.id === id);
    if (ticket) {
      const notif: Omit<Notification, 'id' | 'date' | 'read'> = {
        userId: ticket.userId,
        title: `Estado cambiado: ${ticket.ticketId}`,
        message: `El estado de tu ticket ${ticket.ticketId} cambió a '${newStatus}'.`,
        ticketId: ticket.ticketId,
      };
      addNotification(notif);
    }
  };

  const addNotification = (n: Omit<Notification, 'id' | 'date' | 'read'>) => {
    const id = Math.random().toString(36).slice(2, 9);
    const newN: Notification = { id, ...n, date: new Date().toISOString(), read: false };
    setNotifications(prev => [newN, ...prev]);
    return newN;
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = (userId?: string) => {
    setNotifications(prev => prev.map(n => (userId ? (n.userId === userId ? { ...n, read: true } : n) : { ...n, read: true })));
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      tickets,
      notifications,
      createTicket,
      updateTicketStatus,
      addNotification,
      markNotificationRead,
      markAllNotificationsRead,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthProvider;

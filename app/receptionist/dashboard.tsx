import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native';
import { useAuth } from '../context/_AuthContext';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { apiFetch } from '../services/api';
import dashboardStyles from './styles/dashboard.styles';

type TicketStatus = 'pendiente' | 'en_revision' | 'reparado' | 'cerrado';
interface Ticket {
  id: string;
  estado: TicketStatus;
}

const mapApiToTicket = (apiTicket: any): Ticket => {
  return {
    id: apiTicket.id.toString(),
    estado: apiTicket.estado_usuario,
  };
};

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchDashboardStats();
    }, [])
  );

  const fetchDashboardStats = async () => {
    try {
      // No ponemos setLoading(true) aquí para evitar parpadeos molestos al volver a la pantalla,
      // a menos que sea la carga inicial o refresh manual.
      const data = await apiFetch('/tickets');
      const mappedTickets: Ticket[] = data.map(mapApiToTicket);
      setTickets(mappedTickets);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardStats();
  };

  const totalTickets = tickets.length;
  const activeTickets = tickets.filter(t => t.estado === 'pendiente').length;
  const inProcessTickets = tickets.filter(t => t.estado === 'en_revision').length;
  const resolvedTickets = tickets.filter(t => t.estado === 'cerrado').length;

  return (
    <ScrollView 
      style={dashboardStyles.container} 
      contentContainerStyle={dashboardStyles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header con información del usuario */}
      <View style={dashboardStyles.header}>
        <View style={dashboardStyles.headerBackground} />
        
        <View style={dashboardStyles.userInfoContainer}>
          <View style={dashboardStyles.userAvatarContainer}>
            <View style={dashboardStyles.userAvatar}>
              <Text style={dashboardStyles.userAvatarText}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={dashboardStyles.onlineIndicator} />
          </View>
          
          <Text style={dashboardStyles.welcomeText}>¡Bienvenido!</Text>
          <Text style={dashboardStyles.userName}>{user?.name || 'Usuario'}</Text>
          <Text style={dashboardStyles.userEmail}>{user?.email || ''}</Text>
          
          <View style={dashboardStyles.roleBadge}>
            <Text style={dashboardStyles.roleText}>
              {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Usuario'}
            </Text>
          </View>
        </View>
      </View>

      {/* Estadísticas rápidas - AHORA DINÁMICAS */}
      <View style={dashboardStyles.statsContainer}>
        <View style={dashboardStyles.statItem}>
          <Text style={dashboardStyles.statNumber}>
            {loading ? '-' : totalTickets}
          </Text>
          <Text style={dashboardStyles.statLabel}>Tickets Totales</Text>
        </View>
        <View style={dashboardStyles.statItem}>
          <Text style={dashboardStyles.statNumber}>
            {loading ? '-' : activeTickets}
          </Text>
          <Text style={dashboardStyles.statLabel}>Tickets Pendientes</Text>
        </View>
        <View style={dashboardStyles.statDivider} />
        <View style={dashboardStyles.statItem}>
          <Text style={dashboardStyles.statNumber}>
            {loading ? '-' : inProcessTickets}
          </Text>
          <Text style={dashboardStyles.statLabel}>En Revisión</Text>
        </View>
        <View style={dashboardStyles.statDivider} />
        <View style={dashboardStyles.statItem}>
          <Text style={dashboardStyles.statNumber}>
            {loading ? '-' : resolvedTickets}
          </Text>
          <Text style={dashboardStyles.statLabel}>Cerrados</Text>
        </View>
      </View>

      {/* Acciones principales */}
      <View style={dashboardStyles.actionsSection}>
        <Text style={dashboardStyles.sectionTitle}>Acciones rápidas</Text>
        
        <TouchableOpacity 
          style={[dashboardStyles.actionCard, dashboardStyles.actionCardPrimary]} 
          onPress={() => router.push('/receptionist/create-ticket' as any)}
          activeOpacity={0.8}
        >
          <View style={dashboardStyles.actionIconContainer}>
            <Ionicons name="add-circle-outline" size={32} color="#10518b" />
          </View>
          <View style={dashboardStyles.actionContent}>
            <Text style={dashboardStyles.actionTitle}>Crear Ticket</Text>
            <Text style={dashboardStyles.actionDescription}>
              Reporta un nuevo problema o solicitud
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#94a3b8" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[dashboardStyles.actionCard, dashboardStyles.actionCardSecondary]} 
          onPress={() => router.push('/receptionist/ticket-status' as any)}
          activeOpacity={0.8}
        >
          <View style={dashboardStyles.actionIconContainer}>
            <Ionicons name="list-outline" size={32} color="#5faee3" />
          </View>
          <View style={dashboardStyles.actionContent}>
            <Text style={dashboardStyles.actionTitle}>Estado de Tickets</Text>
            <Text style={dashboardStyles.actionDescription}>
              Consulta el estado de tus solicitudes
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      {/* Botón de Cerrar Sesión */}
      <TouchableOpacity 
        style={dashboardStyles.logoutButton} 
        onPress={logout}
        activeOpacity={0.7}
      >
        <Ionicons name="log-out-outline" size={20} color="#ef4444" />
        <Text style={dashboardStyles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
      
    </ScrollView>
  );
}
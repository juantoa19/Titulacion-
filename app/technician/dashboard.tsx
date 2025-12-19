import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  RefreshControl 
} from 'react-native';
import { useAuth } from '../context/_AuthContext';
import { apiFetch } from '../services/api';
import dashboardStyles from './styles/dashboard.styles';

type TicketStatus = 'pendiente' | 'en_revision' | 'reparado' | 'cerrado';
type Priority = 'alta' | 'media' | 'baja';

interface Ticket {
  id: string;
  ticketId: string;
  estado: TicketStatus;
  prioridad: Priority;
}

export default function TechnicianDashboard() {
  const { user, logout } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadStats();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadStats = async () => {
    try {
      const data = await apiFetch('/tickets');
      
      const mappedTickets: Ticket[] = data.map((t: any) => ({
        id: t.id.toString(),
        ticketId: `TKT-${t.id}`,
        estado: t.estado_usuario,
        prioridad: t.prioridad || 'baja',
      }));
      
      setTickets(mappedTickets);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudieron cargar las estadísticas');
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadStats();
  };

  const totalTickets = tickets.length;
  const pendientes = tickets.filter(t => t.estado === 'pendiente').length;
  const enRevision = tickets.filter(t => t.estado === 'en_revision').length;

  return (
    <ScrollView 
      style={dashboardStyles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={dashboardStyles.header}>
        <View style={dashboardStyles.headerContent}>
          <View style={dashboardStyles.userInfo}>
            <Text style={dashboardStyles.greeting}>Hola,</Text>
            <Text style={dashboardStyles.userName}>{user?.name}</Text>
            <Text style={dashboardStyles.userEmail}>{user?.email}</Text>
          </View>
        </View>
        <Text style={dashboardStyles.title}>Panel de Técnico</Text>
      </View>

      {/* Estadísticas Conectadas */}
      <Animated.View style={[dashboardStyles.statsContainer, { opacity: fadeAnim }]}>
        <View style={[dashboardStyles.statCard, dashboardStyles.statCardTotal]}>
          <Text style={dashboardStyles.statNumber}>{totalTickets}</Text>
          <Text style={dashboardStyles.statLabel}>Total Tickets</Text>
        </View>
        <View style={[dashboardStyles.statCard, dashboardStyles.statCardPending]}>
          <Text style={dashboardStyles.statNumber}>{pendientes}</Text>
          <Text style={dashboardStyles.statLabel}>Pendientes</Text>
        </View>
        <View style={[dashboardStyles.statCard, dashboardStyles.statCardReview]}>
          <Text style={dashboardStyles.statNumber}>{enRevision}</Text>
          <Text style={dashboardStyles.statLabel}>En Revisión</Text>
        </View>
      </Animated.View>

      {/* Acceso rápido a pantallas de tickets */}
      <View style={dashboardStyles.quickAccessSection}>
        <TouchableOpacity
          style={[dashboardStyles.card, dashboardStyles.cardPrimary]}
          onPress={() => router.push('/technician/tickets-disponibles' as any)}
          activeOpacity={0.8}
        >
          <View style={dashboardStyles.cardIconContainer}>
            <Text style={dashboardStyles.cardIcon}>🎫</Text>
          </View>
          <Text style={dashboardStyles.cardTitle}>Tickets Disponibles</Text>
          <Text style={dashboardStyles.cardSubtitle}>Ver tickets sin técnico asignado</Text>
          <View style={dashboardStyles.cardBadge}>
            <Text style={dashboardStyles.cardBadgeText}>
              {totalTickets - enRevision}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[dashboardStyles.card, dashboardStyles.cardSecondary]}
          onPress={() => router.push('/technician/tickets-asignados' as any)}
          activeOpacity={0.8}
        >
          <View style={dashboardStyles.cardIconContainer}>
            <Text style={dashboardStyles.cardIcon}>📝</Text>
          </View>
          <Text style={dashboardStyles.cardTitle}>Mis Tickets</Text>
          <Text style={dashboardStyles.cardSubtitle}>Ver tickets en los que estoy trabajando</Text>
          <View style={dashboardStyles.cardBadge}>
            <Text style={dashboardStyles.cardBadgeText}>{enRevision}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Botón de Cerrar Sesión */}
      <TouchableOpacity 
        style={dashboardStyles.logoutButton} 
        onPress={logout}
        activeOpacity={0.7}
      >
        <Text style={dashboardStyles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}
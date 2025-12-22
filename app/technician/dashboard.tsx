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
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          tintColor="#5faee3"
          colors={['#5faee3', '#10518b']}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={dashboardStyles.header}>
        <View style={dashboardStyles.headerBackground} />
        <View style={dashboardStyles.headerContent}>
          <View style={dashboardStyles.welcomeContainer}>
            <View style={dashboardStyles.userAvatarContainer}>
              <View style={dashboardStyles.userAvatar}>
                <Text style={dashboardStyles.userAvatarText}>
                  {user?.name?.charAt(0).toUpperCase() || 'T'}
                </Text>
              </View>
              <View style={dashboardStyles.onlineIndicator} />
            </View>
            
            <View style={dashboardStyles.userInfo}>
              <Text style={dashboardStyles.greeting}>¡Bienvenido!</Text>
              <Text style={dashboardStyles.userName}>{user?.name || 'Técnico'}</Text>
              <Text style={dashboardStyles.userEmail}>{user?.email || ''}</Text>
            </View>
            
            <View style={dashboardStyles.roleBadge}>
              <Text style={dashboardStyles.roleText}>Técnico</Text>
            </View>
          </View>
          <Text style={dashboardStyles.title}>Panel de Técnico</Text>
        </View>
      </View>

      {/* Estadísticas principales */}
      <View style={dashboardStyles.statsSection}>
        <Text style={dashboardStyles.sectionTitle}>Estadísticas generales</Text>
        <View style={dashboardStyles.statsGrid}>
          <View style={[dashboardStyles.statCard, dashboardStyles.statCardTotal]}>
            <Text style={dashboardStyles.statNumber}>{totalTickets}</Text>
            <Text style={dashboardStyles.statLabel}>Total Tickets</Text>
          </View>
          
          <View style={[dashboardStyles.statCard, dashboardStyles.statCardPending]}>
            <Text style={dashboardStyles.statNumber}>{pendientes}</Text>
            <Text style={dashboardStyles.statLabel}>Pendientes</Text>
            <View style={dashboardStyles.statusIndicator} />
          </View>
          
          <View style={[dashboardStyles.statCard, dashboardStyles.statCardReview]}>
            <Text style={dashboardStyles.statNumber}>{enRevision}</Text>
            <Text style={dashboardStyles.statLabel}>En revisión</Text>
            <View style={[dashboardStyles.statusIndicator, { backgroundColor: '#5faee3' }]} />
          </View>
        </View>
      </View>

      {/* Distribución por prioridad */}
      <View style={dashboardStyles.prioritySection}>
        <Text style={dashboardStyles.sectionTitle}>Distribución por prioridad</Text>
        <View style={dashboardStyles.priorityContainer}>
          <View style={dashboardStyles.priorityItem}>
            <View style={[dashboardStyles.priorityBadge, dashboardStyles.priorityHigh]} />
            <Text style={dashboardStyles.priorityLabel}>Alta</Text>
            <Text style={dashboardStyles.priorityValue}>
              {tickets.filter(t => t.prioridad === 'alta').length}
            </Text>
          </View>
          
          <View style={dashboardStyles.priorityDivider} />
          
          <View style={dashboardStyles.priorityItem}>
            <View style={[dashboardStyles.priorityBadge, dashboardStyles.priorityMedium]} />
            <Text style={dashboardStyles.priorityLabel}>Media</Text>
            <Text style={dashboardStyles.priorityValue}>
              {tickets.filter(t => t.prioridad === 'media').length}
            </Text>
          </View>
          
          <View style={dashboardStyles.priorityDivider} />
          
          <View style={dashboardStyles.priorityItem}>
            <View style={[dashboardStyles.priorityBadge, dashboardStyles.priorityLow]} />
            <Text style={dashboardStyles.priorityLabel}>Baja</Text>
            <Text style={dashboardStyles.priorityValue}>
              {tickets.filter(t => t.prioridad === 'baja').length}
            </Text>
          </View>
        </View>
      </View>

      {/* Acceso rápido */}
      <View style={dashboardStyles.quickAccessSection}>
        <Text style={dashboardStyles.sectionTitle}>Acceso rápido</Text>
        <View style={dashboardStyles.quickAccessGrid}>
          <TouchableOpacity
            style={[dashboardStyles.quickAccessCard, dashboardStyles.accessPrimary]}
            onPress={() => router.push('/technician/tickets-disponibles' as any)}
            activeOpacity={0.8}
          >
            <View style={dashboardStyles.accessIconContainer}>
              <Text style={dashboardStyles.accessIcon}>🎫</Text>
            </View>
            <Text style={dashboardStyles.accessTitle}>Tickets Disponibles</Text>
            <Text style={dashboardStyles.accessDescription}>Asignarse nuevos tickets</Text>
            <View style={dashboardStyles.accessBadge}>
              <Text style={dashboardStyles.accessBadgeText}>{totalTickets - enRevision}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[dashboardStyles.quickAccessCard, dashboardStyles.accessSecondary]}
            onPress={() => router.push('/technician/tickets-asignados' as any)}
            activeOpacity={0.8}
          >
            <View style={dashboardStyles.accessIconContainer}>
              <Text style={dashboardStyles.accessIcon}>📝</Text>
            </View>
            <Text style={dashboardStyles.accessTitle}>Mis Tickets</Text>
            <Text style={dashboardStyles.accessDescription}>En los que trabajo</Text>
            <View style={dashboardStyles.accessBadge}>
              <Text style={dashboardStyles.accessBadgeText}>{enRevision}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Botón de Cerrar Sesión */}
      <TouchableOpacity 
        style={dashboardStyles.logoutButton} 
        onPress={logout}
        activeOpacity={0.7}
      >
        <Text style={dashboardStyles.logoutButtonIcon}>🚪</Text>
        <Text style={dashboardStyles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}
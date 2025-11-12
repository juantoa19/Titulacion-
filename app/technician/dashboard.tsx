import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl 
} from 'react-native';
import { useAuth } from '../context/_AuthContext';
import { apiFetch } from '../services/api'; // <--- Importar apiFetch

// Interfaces (Mismas que tenías, para mantener consistencia)
type TicketStatus = 'pendiente' | 'en_revision' | 'reparado' | 'cerrado';
type Priority = 'alta' | 'media' | 'baja';

interface Ticket {
  id: string;
  ticketId: string;
  estado: TicketStatus;
  prioridad: Priority;
  // ... otros campos opcionales para el conteo
}

export default function TechnicianDashboard() {
  const { user, logout } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Animaciones
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
      // Obtenemos TODOS los tickets para calcular estadísticas
      const data = await apiFetch('/tickets');
      
      // Mapeamos solo lo necesario para las stats
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

  // Cálculos de estadísticas
  const totalTickets = tickets.length;
  const pendientes = tickets.filter(t => t.estado === 'pendiente').length;
  const enRevision = tickets.filter(t => t.estado === 'en_revision').length;

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Panel de Técnico</Text>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Bienvenido: {user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>
      </View>

      {/* Estadísticas Conectadas */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalTickets}</Text>
          <Text style={styles.statLabel}>Total Tickets</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#ef4444' }]}>
            {pendientes}
          </Text>
          <Text style={styles.statLabel}>Pendientes</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#f59e0b' }]}>
            {enRevision}
          </Text>
          <Text style={styles.statLabel}>En Revisión</Text>
        </View>
      </View>

      {/* Acceso rápido a pantallas de tickets */}
      <View style={styles.quickAccessRow}>
        <TouchableOpacity
          style={[styles.card, styles.cardPrimary]}
          onPress={() => router.push('/technician/tickets-disponibles' as any)}
        >
          <View style={[styles.cardIcon, styles.iconPrimary]}>
            <Text style={styles.iconText}>🎫</Text>
          </View>
          <Text style={styles.cardTitle}>Tickets Disponibles</Text>
          <Text style={styles.cardSubtitle}>Ver tickets sin técnico asignado</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.cardSecondary]}
          onPress={() => router.push('/technician/tickets-asignados' as any)}
        >
          <View style={[styles.cardIcon, styles.iconSecondary]}>
            <Text style={styles.iconText}>📝</Text>
          </View>
          <Text style={styles.cardTitle}>Mis tickets</Text>
          <Text style={styles.cardSubtitle}>Ver tickets en los que estoy trabajando</Text>
        </TouchableOpacity>
      </View>

      {/* Botón de Cerrar Sesión */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // ... Mismos estilos que ya tenías ...
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  header: { backgroundColor: '#ffffff', padding: 20, borderRadius: 16, marginBottom: 16, elevation: 4 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1e293b', textAlign: 'center', marginBottom: 8 },
  userInfo: { alignItems: 'center' },
  userName: { fontSize: 16, fontWeight: '600', color: '#374151' },
  userEmail: { fontSize: 14, color: '#64748b' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statCard: { backgroundColor: '#ffffff', padding: 16, borderRadius: 12, alignItems: 'center', flex: 1, marginHorizontal: 4, elevation: 3 },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#3b82f6' },
  statLabel: { fontSize: 12, color: '#64748b', marginTop: 4 },
  quickAccessRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 },
  card: { flex: 1, backgroundColor: '#fff', padding: 18, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginHorizontal: 6, elevation: 3 },
  cardPrimary: { backgroundColor: '#fff' },
  cardSecondary: { backgroundColor: '#fff' },
  cardIcon: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  iconPrimary: { backgroundColor: '#e6f0ff' },
  iconSecondary: { backgroundColor: '#f7eefc' },
  iconText: { fontSize: 22 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a', textAlign: 'center' },
  cardSubtitle: { fontSize: 12, color: '#64748b', textAlign: 'center', marginTop: 6 },
  logoutButton: { backgroundColor: '#ef4444', padding: 16, borderRadius: 12, alignItems: 'center', elevation: 6 },
  logoutButtonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },
});
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Alert,
  RefreshControl,
  Animated
} from 'react-native';
import { useAuth } from '../context/_AuthContext';
import { FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

type TicketStatus = 'pendiente' | 'en_revision' | 'reparado' | 'cerrado';
type Priority = 'alta' | 'media' | 'baja';

interface Ticket {
  id: string;
  ticketId: string;
  userId: string;
  userInfo: {
    nombre1: string;
    nombre2: string;
    apellido1: string;
    apellido2: string;
    cedula: string;
    telefono: string;
    email: string;
    direccion: string;
  };
  deviceInfo: {
    tipoDispositivo: string;
    marca: string;
    modelo: string;
    numeroSerie?: string;
  };
  problema: string;
  fechaSolicitud: string;
  estado: TicketStatus;
  prioridad: Priority;
  tecnicoAsignado?: string;
}

export default function TechnicianDashboard() {
  const { user, logout } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  // Animaciones
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadTickets();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadTickets = async () => {
    setRefreshing(true);
    try {
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTickets([
        {
          id: '1',
          ticketId: 'TKT-123456',
          userId: 'user1',
          userInfo: {
            nombre1: 'Juan',
            nombre2: 'Carlos',
            apellido1: 'Pérez',
            apellido2: 'Gómez',
            cedula: '12345678',
            telefono: '3001234567',
            email: 'juan@example.com',
            direccion: 'Calle 123 #45-67'
          },
          deviceInfo: {
            tipoDispositivo: 'Laptop',
            marca: 'Dell',
            modelo: 'XPS 13',
            numeroSerie: 'SN123456789'
          },
          problema: 'La laptop no enciende',
          fechaSolicitud: new Date().toISOString(),
          estado: 'pendiente',
          prioridad: 'alta'
        }
      ]);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los tickets');
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const handleTicketPress = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={loadTickets} />
      }
    >
      {/* Header con información del técnico */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <FontAwesome5 name="user-cog" size={24} color="#fff" />
            </View>
            <View>
              <Text style={styles.welcomeText}>Bienvenido,</Text>
              <Text style={styles.userName}>{user?.name}</Text>
              <Text style={styles.userRole}>Técnico de Mantenimiento</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Ionicons name="log-out-outline" size={24} color="#FF4444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Panel de Estadísticas */}
      <View style={styles.content}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="clock-alert" size={24} color="#ef4444" />
            <Text style={styles.statNumber}>{tickets.filter(t => t.estado === 'pendiente').length}</Text>
            <Text style={styles.statLabel}>Pendientes</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="progress-wrench" size={24} color="#3b82f6" />
            <Text style={styles.statNumber}>{tickets.filter(t => t.estado === 'en_revision').length}</Text>
            <Text style={styles.statLabel}>En Revisión</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="check-circle" size={24} color="#10b981" />
            <Text style={styles.statNumber}>{tickets.filter(t => t.estado === 'reparado').length}</Text>
            <Text style={styles.statLabel}>Completados</Text>
          </View>
        </View>

        {/* Lista de Tickets */}
        <View style={styles.ticketsList}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tickets Pendientes</Text>
            <MaterialCommunityIcons name="ticket-outline" size={24} color="#1e293b" />
          </View>

          {tickets.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="ticket-confirmation-outline" size={48} color="#94a3b8" />
              <Text style={styles.emptyStateText}>No hay tickets pendientes</Text>
            </View>
          ) : (
            tickets.map((ticket) => (
              <TouchableOpacity 
                key={ticket.id}
                style={styles.ticketCard}
                onPress={() => handleTicketPress(ticket)}
              >
                <View style={styles.ticketHeader}>
                  <View style={styles.ticketInfo}>
                    <Text style={styles.ticketId}>{ticket.ticketId}</Text>
                    <View style={[
                      styles.priorityBadge,
                      ticket.prioridad === 'alta' && styles.highPriority,
                      ticket.prioridad === 'media' && styles.mediumPriority,
                      ticket.prioridad === 'baja' && styles.lowPriority,
                    ]}>
                      <Text style={styles.priorityText}>{ticket.prioridad.toUpperCase()}</Text>
                    </View>
                  </View>
                  <Text style={styles.ticketDate}>
                    {new Date(ticket.fechaSolicitud).toLocaleDateString()}
                  </Text>
                </View>
                
                <View style={styles.ticketBody}>
                  <Text style={styles.deviceInfo}>
                    {ticket.deviceInfo.tipoDispositivo} - {ticket.deviceInfo.marca} {ticket.deviceInfo.modelo}
                  </Text>
                  <Text style={styles.problemDesc} numberOfLines={2}>
                    {ticket.problema}
                  </Text>
                </View>

                <View style={styles.ticketFooter}>
                  <View style={styles.userDetail}>
                    <FontAwesome5 name="user" size={12} color="#64748b" />
                    <Text style={styles.userName}>
                      {ticket.userInfo.nombre1} {ticket.userInfo.apellido1}
                    </Text>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={20} color="#64748b" />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#1e293b',
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  userName: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userRole: {
    color: '#64748b',
    fontSize: 14,
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  ticketsList: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    gap: 12,
  },
  emptyStateText: {
    color: '#94a3b8',
    fontSize: 16,
  },
  ticketCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 5,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ticketInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ticketId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#e2e8f0',
  },
  highPriority: {
    backgroundColor: '#fee2e2',
  },
  mediumPriority: {
    backgroundColor: '#fef3c7',
  },
  lowPriority: {
    backgroundColor: '#dcfce7',
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1e293b',
  },
  ticketDate: {
    fontSize: 12,
    color: '#64748b',
  },
  ticketBody: {
    marginBottom: 12,
  },
  deviceInfo: {
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 4,
  },
  problemDesc: {
    fontSize: 14,
    color: '#64748b',
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  userDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
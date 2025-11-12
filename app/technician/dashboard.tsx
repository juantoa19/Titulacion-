import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../context/_AuthContext';

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
    try {
      // Simular carga de datos de la API
      const mockTickets: Ticket[] = [
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
          problema: 'La laptop no enciende y hace un sonido de beep constante',
          fechaSolicitud: '2024-01-15T10:30:00Z',
          estado: 'pendiente',
          prioridad: 'alta'
        },
        {
          id: '2',
          ticketId: 'TKT-789012',
          userId: 'user2',
          userInfo: {
            nombre1: 'María',
            nombre2: 'Fernanda',
            apellido1: 'Rodríguez',
            apellido2: 'López',
            cedula: '87654321',
            telefono: '3109876543',
            email: 'maria@example.com',
            direccion: 'Av. Principal #89-10'
          },
          deviceInfo: {
            tipoDispositivo: 'Impresora',
            marca: 'HP',
            modelo: 'LaserJet Pro',
            numeroSerie: 'SN987654321'
          },
          problema: 'La impresora no imprime correctamente, mancha el papel',
          fechaSolicitud: '2024-01-14T14:20:00Z',
          estado: 'en_revision',
          prioridad: 'media'
        },
        {
          id: '3',
          ticketId: 'TKT-345678',
          userId: 'user3',
          userInfo: {
            nombre1: 'Carlos',
            nombre2: 'Andrés',
            apellido1: 'González',
            apellido2: '',
            cedula: '11223344',
            telefono: '3205556677',
            email: 'carlos@example.com',
            direccion: 'Carrera 56 #78-90'
          },
          deviceInfo: {
            tipoDispositivo: 'Celular',
            marca: 'Samsung',
            modelo: 'Galaxy S22',
            numeroSerie: 'SN555666777'
          },
          problema: 'La pantalla tiene líneas de colores y no responde al tacto',
          fechaSolicitud: '2024-01-13T09:15:00Z',
          estado: 'reparado',
          prioridad: 'alta'
        }
      ];
      
      setTickets(mockTickets);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los tickets');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadTickets();
  };

  const updateTicketStatus = (ticketId: string, newStatus: TicketStatus) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, estado: newStatus, tecnicoAsignado: user?.name }
        : ticket
    ));
    setSelectedTicket(null);
    Alert.alert('Éxito', 'Estado del ticket actualizado');
  };

  const updateTicketPriority = (ticketId: string, newPriority: Priority) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, prioridad: newPriority }
        : ticket
    ));
    setSelectedTicket(null);
    Alert.alert('Éxito', 'Prioridad del ticket actualizada');
  };

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case 'pendiente': return '#ef4444';
      case 'en_revision': return '#f59e0b';
      case 'reparado': return '#10b981';
      case 'cerrado': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'alta': return '#ef4444';
      case 'media': return '#f59e0b';
      case 'baja': return '#10b981';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const TicketCard = ({ ticket }: { ticket: Ticket }) => (
    <TouchableOpacity 
      style={styles.ticketCard}
      onPress={() => setSelectedTicket(ticket)}
    >
      <View style={styles.ticketHeader}>
        <Text style={styles.ticketId}>{ticket.ticketId}</Text>
        <View style={styles.statusBadge}>
          <View 
            style={[
              styles.statusDot,
              { backgroundColor: getStatusColor(ticket.estado) }
            ]} 
          />
          <Text style={styles.statusText}>{ticket.estado.replace('_', ' ')}</Text>
        </View>
      </View>
      
      <View style={styles.ticketInfo}>
        <Text style={styles.deviceText}>
          {ticket.deviceInfo.marca} {ticket.deviceInfo.modelo} - {ticket.deviceInfo.tipoDispositivo}
        </Text>
        <Text style={styles.userText}>
          {ticket.userInfo.nombre1} {ticket.userInfo.apellido1}
        </Text>
        <Text style={styles.problemText} numberOfLines={2}>
          {ticket.problema}
        </Text>
      </View>

      <View style={styles.ticketFooter}>
        <View style={styles.priorityBadge}>
          <Text style={[styles.priorityText, { color: getPriorityColor(ticket.prioridad) }]}>
            Prioridad: {ticket.prioridad}
          </Text>
        </View>
        <Text style={styles.dateText}>
          {formatDate(ticket.fechaSolicitud)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const TicketDetailModal = ({ ticket }: { ticket: Ticket }) => (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <ScrollView>
          <Text style={styles.modalTitle}>Detalles del Ticket</Text>
          
          {/* Información del Ticket */}
          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Información del Ticket</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>ID:</Text>
              <Text style={styles.detailValue}>{ticket.ticketId}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Fecha:</Text>
              <Text style={styles.detailValue}>{formatDate(ticket.fechaSolicitud)}</Text>
            </View>
          </View>

          {/* Información del Usuario */}
          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Información del Usuario</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Nombre:</Text>
              <Text style={styles.detailValue}>
                {ticket.userInfo.nombre1} {ticket.userInfo.nombre2} {ticket.userInfo.apellido1} {ticket.userInfo.apellido2}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Cédula:</Text>
              <Text style={styles.detailValue}>{ticket.userInfo.cedula}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Teléfono:</Text>
              <Text style={styles.detailValue}>{ticket.userInfo.telefono}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Email:</Text>
              <Text style={styles.detailValue}>{ticket.userInfo.email}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Dirección:</Text>
              <Text style={styles.detailValue}>{ticket.userInfo.direccion}</Text>
            </View>
          </View>

          {/* Información del Dispositivo */}
          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Información del Dispositivo</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tipo:</Text>
              <Text style={styles.detailValue}>{ticket.deviceInfo.tipoDispositivo}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Marca:</Text>
              <Text style={styles.detailValue}>{ticket.deviceInfo.marca}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Modelo:</Text>
              <Text style={styles.detailValue}>{ticket.deviceInfo.modelo}</Text>
            </View>
            {ticket.deviceInfo.numeroSerie && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>N° Serie:</Text>
                <Text style={styles.detailValue}>{ticket.deviceInfo.numeroSerie}</Text>
              </View>
            )}
          </View>

          {/* Descripción del Problema */}
          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Descripción del Problema</Text>
            <Text style={styles.problemDetail}>{ticket.problema}</Text>
          </View>

          {/* Controles de Estado y Prioridad */}
          <View style={styles.controlsSection}>
            <Text style={styles.sectionTitle}>Actualizar Ticket</Text>
            
            <Text style={styles.controlLabel}>Estado Actual:</Text>
            <View style={styles.controlsRow}>
              {(['pendiente', 'en_revision', 'reparado', 'cerrado'] as TicketStatus[]).map(status => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.controlButton,
                    ticket.estado === status && styles.controlButtonActive
                  ]}
                  onPress={() => updateTicketStatus(ticket.id, status)}
                >
                  <Text style={[
                    styles.controlButtonText,
                    ticket.estado === status && styles.controlButtonTextActive
                  ]}>
                    {status.replace('_', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.controlLabel}>Prioridad Actual:</Text>
            <View style={styles.controlsRow}>
              {(['alta', 'media', 'baja'] as Priority[]).map(priority => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.controlButton,
                    ticket.prioridad === priority && styles.controlButtonActive
                  ]}
                  onPress={() => updateTicketPriority(ticket.id, priority)}
                >
                  <Text style={[
                    styles.controlButtonText,
                    ticket.prioridad === priority && styles.controlButtonTextActive
                  ]}>
                    {priority}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => setSelectedTicket(null)}
        >
          <Text style={styles.closeButtonText}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Panel de Técnico</Text>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Bienvenido: {user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>
      </View>

      {/* Estadísticas */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{tickets.length}</Text>
          <Text style={styles.statLabel}>Total Tickets</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {tickets.filter(t => t.estado === 'pendiente').length}
          </Text>
          <Text style={styles.statLabel}>Pendientes</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {tickets.filter(t => t.estado === 'en_revision').length}
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

      {/* Modal de Detalles */}
      {selectedTicket && <TicketDetailModal ticket={selectedTicket} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  userEmail: {
    fontSize: 14,
    color: '#64748b',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  ticketsContainer: {
    flex: 1,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  ticketCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ticketId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'capitalize',
  },
  ticketInfo: {
    marginBottom: 12,
  },
  deviceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  userText: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 4,
  },
  problemText: {
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 16,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priorityBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  dateText: {
    fontSize: 11,
    color: '#94a3b8',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Modal Styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    maxHeight: '80%',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 20,
  },
  detailSection: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    width: 80,
  },
  detailValue: {
    fontSize: 14,
    color: '#64748b',
    flex: 1,
  },
  problemDetail: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
  },
  controlsSection: {
    marginBottom: 20,
  },
  controlLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 12,
  },
  controlsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  controlButton: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  controlButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  controlButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'capitalize',
  },
  controlButtonTextActive: {
    color: '#ffffff',
  },
  closeButton: {
    backgroundColor: '#6b7280',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Quick access cards (similar look to user dashboard)
  quickAccessRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
    shadowColor: 'rgba(15,23,42,0.06)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  cardPrimary: {
    backgroundColor: '#fff',
  },
  cardSecondary: {
    backgroundColor: '#fff',
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconPrimary: { backgroundColor: '#e6f0ff' },
  iconSecondary: { backgroundColor: '#f7eefc' },
  iconText: { fontSize: 22 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a', textAlign: 'center' },
  cardSubtitle: { fontSize: 12, color: '#64748b', textAlign: 'center', marginTop: 6 },
});
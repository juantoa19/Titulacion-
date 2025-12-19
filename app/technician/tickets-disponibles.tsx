import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useAuth } from '../context/_AuthContext';
import { apiFetch } from '../services/api'; // <--- Importar API

type TicketStatus = 'pendiente' | 'en_revision' | 'reparado' | 'cerrado';
type Priority = 'alta' | 'media' | 'baja';

interface Ticket {
  id: string;
  ticketId: string;
  userInfo: {
    nombre1: string;
    apellido1: string;
    cedula: string;
    telefono: string;
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
  prioridad?: Priority;
  tecnicoAsignado?: string;
}

/**
 * Mapea los datos de la API (snake_case) al formato del Frontend (camelCase)
 */
const mapApiToTicket = (apiTicket: any): Ticket => {
  const cliente = apiTicket.cliente || {}; // Objeto de usuario (cliente)
  
  // Dividir el nombre del usuario
  const nombreCompleto = (cliente.nombre || 'Usuario Desconocido').split(' ');
  const nombre1 = nombreCompleto[0] || '';
  const apellido1 = nombreCompleto.length > 1 ? nombreCompleto[1] : '';

  return {
    id: apiTicket.id.toString(),
    ticketId: `TKT-${apiTicket.id}`,
    userInfo: {
      nombre1: nombre1,
      apellido1: apellido1,
      cedula: cliente.cedula || 'N/A',     // Correcto
      telefono: cliente.celular || 'N/A',  // Correcto
      direccion: cliente.direccion || 'N/A'// Correcto
    },
    deviceInfo: {
      tipoDispositivo: apiTicket.tipo_dispositivo,
      marca: apiTicket.marca,
      modelo: apiTicket.modelo,
      numeroSerie: apiTicket.numero_serie,
    },
    problema: apiTicket.descripcion_problema,
    fechaSolicitud: apiTicket.created_at, // Usamos created_at para la fecha de solicitud
    estado: apiTicket.estado_usuario,
    prioridad: apiTicket.prioridad,
    tecnicoAsignado: apiTicket.tecnico ? apiTicket.tecnico.name : undefined,
  };
};

export default function TicketsDisponibles() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // useFocusEffect se ejecuta cada vez que la pantalla entra en foco
  useFocusEffect(
    useCallback(() => {
      fetchTickets();
    }, [])
  );

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/tickets'); // Endpoint que trae todos los tickets
      
      const mappedTickets: Ticket[] = data
        .filter((t: any) => t.tecnico_id === null) // Filtramos los no asignados
        .map(mapApiToTicket); // Mapeamos al formato local

      setTickets(mappedTickets);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudieron cargar los tickets disponibles');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const onRefresh = () => {
      setRefreshing(true);
      fetchTickets();
  };

  const handleTakeTicket = async () => {
    if (selectedTicket && user?.name) {
      try {
        // Llamada al endpoint personalizado 'assign'
        await apiFetch(`/tickets/${selectedTicket.id}/assign`, 'POST');
        
        Alert.alert('Éxito', `Ticket ${selectedTicket.ticketId} asignado a ${user.name}`);
        setSelectedTicket(null);
        // Navegar a "Mis Tickets" después de tomarlo
        router.push('/technician/tickets-asignados' as any);

      } catch (error: any) {
         Alert.alert('Error', error.response?.data?.message || 'No se pudo asignar el ticket');
      }
    }
  };

  // --- Funciones de UI (Helpers) ---

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case 'pendiente': return '#ef4444';
      case 'en_revision': return '#f59e0b';
      case 'reparado': return '#10b981';
      case 'cerrado': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority?: Priority) => {
     switch (priority) {
      case 'alta': return '#ef4444';
      case 'media': return '#f59e0b';
      case 'baja': return '#10b981';
      default: return '#6b7280';
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  // --- Componentes de UI (Render) ---

  const TicketCard = ({ ticket }: { ticket: Ticket }) => (
    <TouchableOpacity style={styles.card} onPress={() => setSelectedTicket(ticket)}>
      <View style={styles.ticketHeader}>
        <Text style={styles.ticketId}>{ticket.ticketId}</Text>
        <View style={styles.statusBadge}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(ticket.estado) }]} />
          <Text style={styles.statusText}>{ticket.estado.replace('_', ' ')}</Text>
        </View>
      </View>

      <Text style={styles.deviceText}>{ticket.deviceInfo.marca} {ticket.deviceInfo.modelo} • {ticket.deviceInfo.tipoDispositivo}</Text>
      <Text style={styles.userText}>{ticket.userInfo.nombre1} {ticket.userInfo.apellido1} • {ticket.userInfo.telefono}</Text>
      <Text style={styles.problemText} numberOfLines={2}>{ticket.problema}</Text>

      <View style={styles.cardFooter}>
        <Text style={styles.dateText}>{formatDate(ticket.fechaSolicitud)}</Text>
        {ticket.prioridad ? <Text style={[styles.priorityText, { color: getPriorityColor(ticket.prioridad) }]}>{ticket.prioridad.toUpperCase()}</Text> : null}
      </View>
    </TouchableOpacity>
  );

  const TicketDetailModal = ({ ticket }: { ticket: Ticket }) => (
    <Modal transparent animationType="fade" visible={!!selectedTicket}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.modalTitle}>{ticket.ticketId}</Text>

            {/* Estado y Prioridad */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Estado:</Text>
              <View style={[styles.statusBadge, { marginLeft: 8 }]}>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(ticket.estado) }]} />
                <Text style={styles.statusText}>{ticket.estado.replace('_', ' ')}</Text>
              </View>
            </View>
            {ticket.prioridad && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Prioridad:</Text>
                <Text style={[styles.priorityText, { marginLeft: 8, color: getPriorityColor(ticket.prioridad) }]}>
                  {ticket.prioridad.toUpperCase()}
                </Text>
              </View>
            )}

            {/* Info Usuario */}
            <Text style={styles.sectionTitle}>Información del Usuario</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Nombre:</Text>
              <Text style={styles.detailValue}>{ticket.userInfo.nombre1} {ticket.userInfo.apellido1}</Text>
            </View>
            {ticket.userInfo.cedula && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Cédula:</Text>
                <Text style={styles.detailValue}>{ticket.userInfo.cedula}</Text>
              </View>
            )}
            {ticket.userInfo.telefono && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Teléfono:</Text>
                <Text style={styles.detailValue}>{ticket.userInfo.telefono}</Text>
              </View>
            )}
            {ticket.userInfo.direccion && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Dirección:</Text>
                <Text style={styles.detailValue}>{ticket.userInfo.direccion}</Text>
              </View>
            )}

            {/* Info Dispositivo */}
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

            {/* Problema */}
            <Text style={styles.sectionTitle}>Descripción del Problema</Text>
            <View style={styles.problemBox}>
              <Text style={styles.problemDetailText}>{ticket.problema}</Text>
            </View>

            <View style={styles.dateRow}>
              <Text style={styles.dateText}>Fecha de solicitud: {formatDate(ticket.fechaSolicitud)}</Text>
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setSelectedTicket(null)}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, styles.takeButton]} onPress={handleTakeTicket}>
              <Text style={styles.takeButtonText}>Tomar Ticket</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tickets Disponibles</Text>
      {loading ? (
         <ActivityIndicator size="large" color="#0b3d91" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <TicketCard ticket={item} />}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay tickets disponibles por el momento.</Text>
            </View>
          }
          refreshControl={
             <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
      {selectedTicket && <TicketDetailModal ticket={selectedTicket} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8fafc' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12, color: '#0f172a' },
  emptyContainer: {
    marginTop: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
  },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: 'rgba(15,23,42,0.06)', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 3 },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  ticketId: { fontWeight: '700', color: '#0f172a', fontSize: 16 },
  statusBadge: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  statusText: { fontSize: 12, color: '#64748b', textTransform: 'capitalize' },
  deviceText: { color: '#374151', fontWeight: '600', marginBottom: 6 },
  userText: { color: '#64748b', marginBottom: 6 },
  problemText: { color: '#94a3b8', lineHeight: 18 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, alignItems: 'center' },
  dateText: { color: '#94a3b8', fontSize: 12 },
  priorityText: { fontWeight: '700', fontSize: 12 },

  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, maxHeight: '85%' },
  modalTitle: { fontSize: 24, fontWeight: '800', color: '#0f172a', marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginTop: 16, marginBottom: 10 },
  detailRow: { flexDirection: 'row', marginBottom: 10, alignItems: 'center' },
  detailLabel: { fontSize: 14, fontWeight: '600', color: '#374151', width: 90 },
  detailValue: { fontSize: 14, color: '#64748b', flex: 1 },
  problemBox: { backgroundColor: '#f8fafc', padding: 12, borderRadius: 8, marginBottom: 12 },
  problemDetailText: { fontSize: 14, color: '#64748b' },
  dateRow: { marginTop: 20, marginBottom: 20 },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 16 },
  modalButton: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  cancelButton: { backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#cbd5e1' },
  cancelButtonText: { color: '#64748b', fontWeight: '700', fontSize: 16 },
  takeButton: { backgroundColor: '#0b3d91' },
  takeButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
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
import { useAuth } from '../context/_AuthContext';
import { apiFetch } from '../services/api'; 
import { useFocusEffect } from 'expo-router';

// Tipos
type TicketStatus = 'pendiente' | 'en_revision' | 'reparado' | 'cerrado';
type Priority = 'alta' | 'media' | 'baja';

interface Ticket {
  id: string;
  ticketId: string;
  userId: string;
  userInfo: {
    nombre1: string;
    nombre2?: string;
    apellido1: string;
    apellido2?: string;
    cedula?: string;
    telefono?: string;
    email?: string;
    direccion?: string;
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
  recepcionista?: string;
  // --- Nuevos Campos de Cierre ---
  observaciones_tecnico?: string;
  costo_total?: number;
  abono?: number;
}

// Mapeo de datos (Igual que en el técnico)
const mapApiToTicket = (apiTicket: any): Ticket => {
  const usuario = apiTicket.cliente || {}; // Ojo: en el Controller usamos 'cliente' relationship
  const tecnico = apiTicket.tecnico || {};
  const recepcionista = apiTicket.recepcionista || {};
  
  // Manejo de nombres de cliente (asumiendo que viene de la tabla clients)
  const nombreCompleto = (usuario.nombre || 'Cliente Desconocido').split(' ');
  const nombre1 = nombreCompleto[0] || '';
  const apellido1 = nombreCompleto.length > 1 ? nombreCompleto[1] : '';

  return {
    id: apiTicket.id.toString(),
    ticketId: `TKT-${apiTicket.id}`,
    userId: apiTicket.client_id?.toString() || '0', // Usamos client_id
    userInfo: {
      nombre1: nombre1,
      apellido1: apellido1,
      cedula: usuario.cedula || 'N/A',
      telefono: usuario.celular || 'N/A',
      email: 'N/A', // Cliente a veces no tiene email obligatorio
      direccion: usuario.direccion || 'N/A',
    },
    deviceInfo: {
      tipoDispositivo: apiTicket.tipo_dispositivo,
      marca: apiTicket.marca,
      modelo: apiTicket.modelo,
      numeroSerie: apiTicket.numero_serie,
    },
    problema: apiTicket.descripcion_problema,
    fechaSolicitud: apiTicket.created_at,
    estado: apiTicket.estado_usuario,
    prioridad: apiTicket.prioridad,
    tecnicoAsignado: tecnico.name || 'Sin asignar',
    recepcionista: recepcionista.name || 'Sistema',
    // Mapeo de campos de cierre
    observaciones_tecnico: apiTicket.observaciones_tecnico,
    costo_total: apiTicket.costo_total ? parseFloat(apiTicket.costo_total) : 0,
    abono: apiTicket.abono ? parseFloat(apiTicket.abono) : 0,
  };
};

export default function TicketStatus() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  useFocusEffect(
    useCallback(() => {
      fetchTickets();
    }, [])
  );

  const fetchTickets = async () => {
    try {
      setLoading(true);
      // Usamos '/tickets' para traer TODOS (gracias a la lógica de tu Controller)
      const data = await apiFetch('/tickets'); 
      const mappedTickets: Ticket[] = data.map(mapApiToTicket);
      setTickets(mappedTickets);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudieron cargar los tickets');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const onRefresh = () => {
      setRefreshing(true);
      fetchTickets();
  };

  // --- Helpers de UI ---
  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case 'pendiente': return '#ef4444';
      case 'en_revision': return '#f59e0b';
      case 'reparado': return '#10b981';
      case 'cerrado': return '#475569'; // Gris oscuro para cerrado
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  // --- Render Items ---
  const TicketCard = ({ ticket }: { ticket: Ticket }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => setSelectedTicket(ticket)}
    >
      <View style={styles.ticketHeader}>
        <Text style={styles.ticketId}>{ticket.ticketId}</Text>
        <View style={styles.statusBadge}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(ticket.estado) }]} />
          <Text style={styles.statusText}>{ticket.estado.replace('_', ' ')}</Text>
        </View>
      </View>

      <Text style={styles.deviceText}>{ticket.deviceInfo.marca} {ticket.deviceInfo.modelo}</Text>
      <Text style={styles.userText}>Cliente: {ticket.userInfo?.nombre1} {ticket.userInfo?.apellido1}</Text>
      
      <View style={styles.cardFooter}>
        <Text style={styles.dateText}>{formatDate(ticket.fechaSolicitud)}</Text>
        <Text style={styles.assignedText}>Tec: {ticket.tecnicoAsignado}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estado de Tickets</Text>
      
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
              <Text style={styles.emptyText}>No hay tickets registrados.</Text>
            </View>
          }
           refreshControl={
             <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      {/* --- MODAL DE DETALLE (Solo Lectura) --- */}
      {selectedTicket && (
        <Modal transparent animationType="slide" visible={!!selectedTicket} onRequestClose={() => setSelectedTicket(null)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalHeader}>
                   <Text style={styles.modalTitle}>{selectedTicket.ticketId}</Text>
                   <View style={[styles.statusTag, { backgroundColor: getStatusColor(selectedTicket.estado) + '20' }]}>
                      <Text style={[styles.statusTagText, { color: getStatusColor(selectedTicket.estado) }]}>
                        {selectedTicket.estado.toUpperCase().replace('_', ' ')}
                      </Text>
                   </View>
                </View>

                {/* Info Cliente */}
                <Text style={styles.sectionTitle}>Cliente</Text>
                <View style={styles.infoBox}>
                   <Text style={styles.infoText}><Text style={styles.bold}>Nombre:</Text> {selectedTicket.userInfo.nombre1} {selectedTicket.userInfo.apellido1}</Text>
                   <Text style={styles.infoText}><Text style={styles.bold}>Cédula:</Text> {selectedTicket.userInfo.cedula}</Text>
                   <Text style={styles.infoText}><Text style={styles.bold}>Teléfono:</Text> {selectedTicket.userInfo.telefono}</Text>
                </View>

                {/* Info Dispositivo */}
                <Text style={styles.sectionTitle}>Dispositivo</Text>
                <View style={styles.infoBox}>
                   <Text style={styles.infoText}><Text style={styles.bold}>Equipo:</Text> {selectedTicket.deviceInfo.tipoDispositivo}</Text>
                   <Text style={styles.infoText}><Text style={styles.bold}>Modelo:</Text> {selectedTicket.deviceInfo.marca} {selectedTicket.deviceInfo.modelo}</Text>
                   <Text style={styles.infoText}><Text style={styles.bold}>Serie:</Text> {selectedTicket.deviceInfo.numeroSerie || 'S/N'}</Text>
                </View>

                <Text style={styles.sectionTitle}>Problema Reportado</Text>
                <View style={styles.problemBox}>
                  <Text style={styles.problemText}>{selectedTicket.problema}</Text>
                </View>

                {/* --- SECCIÓN IMPORTANTE: DATOS DE CIERRE --- */}
                {selectedTicket.estado === 'cerrado' && (
                  <View style={styles.closureContainer}>
                    <Text style={styles.closureTitle}>✅ Información de Cierre</Text>
                    
                    <Text style={styles.labelClosure}>Observaciones del Técnico:</Text>
                    <View style={styles.obsBox}>
                       <Text style={styles.obsText}>{selectedTicket.observaciones_tecnico || 'Sin observaciones.'}</Text>
                    </View>

                    <View style={styles.financialRow}>
                        <View style={styles.financialItem}>
                           <Text style={styles.financialLabel}>Costo Total</Text>
                           <Text style={styles.financialValue}>${selectedTicket.costo_total?.toFixed(2)}</Text>
                        </View>
                        <View style={styles.financialItem}>
                           <Text style={styles.financialLabel}>Abono</Text>
                           <Text style={styles.financialValue}>${selectedTicket.abono?.toFixed(2)}</Text>
                        </View>
                        <View style={styles.financialItem}>
                           <Text style={styles.financialLabel}>Saldo (Pagar)</Text>
                           <Text style={[
                             styles.financialValue, 
                             (selectedTicket.costo_total! - selectedTicket.abono!) > 0 ? { color: '#ef4444' } : { color: '#10b981' }
                           ]}>
                             ${(selectedTicket.costo_total! - selectedTicket.abono!).toFixed(2)}
                           </Text>
                        </View>
                    </View>
                  </View>
                )}

                <View style={styles.footerInfo}>
                   <Text style={styles.footerText}>Técnico: {selectedTicket.tecnicoAsignado}</Text>
                   <Text style={styles.footerText}>Recibido por: {selectedTicket.recepcionista}</Text>
                </View>

              </ScrollView>

              <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedTicket(null)}>
                <Text style={styles.closeButtonText}>Cerrar Detalle</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8fafc' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12, color: '#0f172a' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 16, color: '#94a3b8' },

  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  ticketId: { fontWeight: '700', fontSize: 16, color: '#0f172a' },
  statusBadge: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusText: { fontSize: 12, color: '#64748b', textTransform: 'capitalize' },
  deviceText: { fontWeight: '600', color: '#334155', marginBottom: 4 },
  userText: { color: '#64748b', fontSize: 13, marginBottom: 8 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 8 },
  dateText: { fontSize: 11, color: '#94a3b8' },
  assignedText: { fontSize: 11, color: '#0b3d91', fontWeight: '600' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 24, fontWeight: '800', color: '#0f172a' },
  statusTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusTagText: { fontSize: 12, fontWeight: '700' },
  
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#334155', marginTop: 15, marginBottom: 8 },
  infoBox: { backgroundColor: '#f8fafc', padding: 12, borderRadius: 8 },
  infoText: { fontSize: 14, color: '#475569', marginBottom: 4 },
  bold: { fontWeight: '600', color: '#1e293b' },
  problemBox: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', padding: 12, borderRadius: 8 },
  problemText: { fontSize: 14, color: '#475569', fontStyle: 'italic' },

  // Estilos de Cierre
  closureContainer: { marginTop: 20, backgroundColor: '#f0fdf4', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#bbf7d0' },
  closureTitle: { fontSize: 16, fontWeight: '700', color: '#166534', marginBottom: 10 },
  labelClosure: { fontSize: 13, fontWeight: '600', color: '#15803d', marginBottom: 4 },
  obsBox: { backgroundColor: '#fff', padding: 10, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#dcfce7' },
  obsText: { color: '#334155', fontSize: 14 },
  
  financialRow: { flexDirection: 'row', justifyContent: 'space-between' },
  financialItem: { alignItems: 'center', flex: 1 },
  financialLabel: { fontSize: 12, color: '#15803d', marginBottom: 2 },
  financialValue: { fontSize: 16, fontWeight: '700', color: '#14532d' },

  footerInfo: { marginTop: 25, borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingTop: 15 },
  footerText: { fontSize: 12, color: '#94a3b8', textAlign: 'center', marginBottom: 2 },
  
  closeButton: { marginTop: 20, backgroundColor: '#0f172a', padding: 15, borderRadius: 12, alignItems: 'center' },
  closeButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
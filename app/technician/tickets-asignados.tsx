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
  TextInput,
} from 'react-native';
import { useAuth } from '../context/_AuthContext';
import { apiFetch } from '../services/api'; 
import { useFocusEffect, router } from 'expo-router';

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
}

// --- CORRECCIÓN CLAVE AQUÍ ---
const mapApiToTicket = (apiTicket: any): Ticket => {
  // 1. Usamos 'cliente' porque así viene del backend (Ticket::with('cliente'))
  const cliente = apiTicket.cliente || {}; 
  const tecnico = apiTicket.tecnico || {};
  
  // 2. El campo en la BD es 'nombre' (nombre completo), así que lo separamos
  const nombreCompleto = (cliente.nombre || 'Cliente Desconocido').split(' ');
  const nombre1 = nombreCompleto[0] || '';
  const apellido1 = nombreCompleto.slice(1).join(' '); 

  return {
    id: apiTicket.id.toString(),
    ticketId: `TKT-${apiTicket.id}`,
    userId: apiTicket.client_id ? apiTicket.client_id.toString() : '0',
    userInfo: {
      nombre1: nombre1,
      apellido1: apellido1,
      cedula: cliente.cedula || 'N/A',      // Campo correcto: cedula
      telefono: cliente.celular || 'N/A',   // Campo correcto: celular
      direccion: cliente.direccion || 'N/A',// Campo correcto: direccion
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
  };
};

export default function TicketsAsignados() {
  const { user } = useAuth();
  const [myTickets, setMyTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newStatus, setNewStatus] = useState<TicketStatus | null>(null);
  const [newPriority, setNewPriority] = useState<Priority | null>(null);

  // Estados para el Cierre
  const [observaciones, setObservaciones] = useState('');
  const [costoTotal, setCostoTotal] = useState('');
  const [abono, setAbono] = useState('');

  useFocusEffect(
    useCallback(() => {
      fetchMyTickets();
    }, [])
  );

  const fetchMyTickets = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/my-tickets');
      const mappedTickets: Ticket[] = data.map(mapApiToTicket);
      setMyTickets(mappedTickets);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudieron cargar tus tickets asignados');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const onRefresh = () => {
      setRefreshing(true);
      fetchMyTickets();
  };

  const handleCloseModal = () => {
    setSelectedTicket(null);
    setNewStatus(null);
    setNewPriority(null);
    setObservaciones('');
    setCostoTotal('');
    setAbono('');
  };

  const handleSaveChanges = async () => {
    if (!selectedTicket) return;

    const statusToSend = newStatus || selectedTicket.estado;
    const priorityToSend = newPriority || selectedTicket.prioridad;

    let payload: any = {
      estado_usuario: statusToSend,
      prioridad: priorityToSend,
    };

    if (statusToSend === 'cerrado') {
      if (!observaciones.trim()) {
        Alert.alert('Faltan datos', 'Debes ingresar las observaciones técnicas.');
        return;
      }
      if (!costoTotal || !abono) {
        Alert.alert('Faltan datos', 'Debes ingresar el costo total y el abono.');
        return;
      }

      const costoNum = parseFloat(costoTotal);
      const abonoNum = parseFloat(abono);

      if (abonoNum > costoNum) {
        Alert.alert('Error', 'El abono no puede ser mayor al costo total.');
        return;
      }

      payload = {
        ...payload,
        estado_interno: 'completado',
        observaciones_tecnico: observaciones,
        costo_total: costoNum,
        abono: abonoNum,
      };
    }

    try {
      await apiFetch(`/tickets/${selectedTicket.id}`, 'PATCH', payload);
      Alert.alert('Éxito', `Ticket ${selectedTicket.ticketId} actualizado`);
      handleCloseModal();
      fetchMyTickets(); 
    } catch (error: any) {
      const msg = error.response?.data?.message || 'No se pudo actualizar el ticket';
      const errors = error.response?.data?.errors;
      
      if (errors) {
        const firstErrorKey = Object.keys(errors)[0];
        Alert.alert('Error de Validación', errors[firstErrorKey][0]);
      } else {
        Alert.alert('Error', msg);
      }
    }
  };

  // Helpers de UI
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

  const TicketCard = ({ ticket }: { ticket: Ticket }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => {
        setSelectedTicket(ticket);
        setNewStatus(ticket.estado);
        setNewPriority(ticket.prioridad || null); 
        setObservaciones('');
        setCostoTotal('');
        setAbono('');
      }}
    >
      <View style={styles.ticketHeader}>
        <Text style={styles.ticketId}>{ticket.ticketId}</Text>
        <View style={styles.statusBadge}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(ticket.estado) }]} />
          <Text style={styles.statusText}>{ticket.estado.replace('_', ' ')}</Text>
        </View>
      </View>

      <Text style={styles.deviceText}>{ticket.deviceInfo.marca} {ticket.deviceInfo.modelo} • {ticket.deviceInfo.tipoDispositivo}</Text>
      <Text style={styles.userText}>{ticket.userInfo?.nombre1} {ticket.userInfo?.apellido1} • {ticket.userInfo?.telefono}</Text>
      <Text style={styles.problemText} numberOfLines={2}>{ticket.problema}</Text>

      <View style={styles.cardFooter}>
        <Text style={styles.dateText}>{formatDate(ticket.fechaSolicitud)}</Text>
        {ticket.prioridad ? (
          <Text style={[styles.priorityText, { color: getPriorityColor(ticket.prioridad) }]}>
            {ticket.prioridad.toUpperCase()}
          </Text>
        ) : null}
      </View>

      <View style={styles.assignedBadge}>
        <Text style={styles.assignedText}>👨‍🔧 Asignado a: {ticket.tecnicoAsignado}</Text>
      </View>
    </TouchableOpacity>
  );

  const isClosing = newStatus === 'cerrado';
  const saldoPendiente = (parseFloat(costoTotal || '0') - parseFloat(abono || '0')).toFixed(2);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Tickets Asignados</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0b3d91" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={myTickets}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <TicketCard ticket={item} />}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No tienes tickets asignados aún.</Text>
              <TouchableOpacity onPress={() => router.push('/technician/tickets-disponibles' as any)}>
                 <Text style={styles.linkText}>Ver tickets disponibles</Text>
              </TouchableOpacity>
            </View>
          }
           refreshControl={
             <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      {selectedTicket && (
        <Modal transparent animationType="fade" visible={!!selectedTicket} onRequestClose={handleCloseModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.modalTitle}>{selectedTicket.ticketId}</Text>

                <Text style={styles.sectionTitle}>Información del Usuario</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Nombre:</Text>
                  <Text style={styles.detailValue}>{selectedTicket.userInfo?.nombre1} {selectedTicket.userInfo?.apellido1}</Text>
                </View>
                <View style={styles.detailRow}>
                   <Text style={styles.detailLabel}>Cédula:</Text>
                   <Text style={styles.detailValue}>{selectedTicket.userInfo?.cedula}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Teléfono:</Text>
                  <Text style={styles.detailValue}>{selectedTicket.userInfo?.telefono}</Text>
                </View>
                <View style={styles.detailRow}>
                   <Text style={styles.detailLabel}>Dirección:</Text>
                   <Text style={styles.detailValue}>{selectedTicket.userInfo?.direccion}</Text>
                </View>

                <Text style={styles.sectionTitle}>Información del Dispositivo</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Marca:</Text>
                  <Text style={styles.detailValue}>{selectedTicket.deviceInfo.marca}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Modelo:</Text>
                  <Text style={styles.detailValue}>{selectedTicket.deviceInfo.modelo}</Text>
                </View>

                <Text style={styles.sectionTitle}>Descripción del Problema</Text>
                <View style={styles.problemBox}>
                  <Text style={styles.problemDetailText}>{selectedTicket.problema}</Text>
                </View>

                <Text style={styles.sectionTitle}>Cambiar Estado</Text>
                <View style={styles.buttonGrid}>
                  {(['pendiente', 'en_revision', 'reparado', 'cerrado'] as TicketStatus[]).map(status => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.stateButton,
                        (newStatus || selectedTicket.estado) === status && styles.stateButtonActive
                      ]}
                      onPress={() => setNewStatus(status)}
                    >
                      <Text style={[styles.stateButtonText, (newStatus || selectedTicket.estado) === status && styles.stateButtonTextActive]}>
                        {status.replace('_', ' ')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {isClosing && (
                  <View style={styles.closingFieldsContainer}>
                    <Text style={styles.helperText}>Complete los datos para cerrar el ticket:</Text>
                    
                    <Text style={styles.inputLabel}>Observaciones del Técnico *</Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder="Detalles de la reparación realizada..."
                      multiline
                      numberOfLines={3}
                      value={observaciones}
                      onChangeText={setObservaciones}
                    />

                    <View style={styles.rowInputs}>
                      <View style={{ flex: 1, marginRight: 8 }}>
                        <Text style={styles.inputLabel}>Costo Total ($) *</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="0.00"
                          keyboardType="numeric"
                          value={costoTotal}
                          onChangeText={setCostoTotal}
                        />
                      </View>
                      <View style={{ flex: 1, marginLeft: 8 }}>
                        <Text style={styles.inputLabel}>Abono ($) *</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="0.00"
                          keyboardType="numeric"
                          value={abono}
                          onChangeText={setAbono}
                        />
                      </View>
                    </View>

                    <View style={styles.saldoContainer}>
                      <Text style={styles.saldoLabel}>Saldo Pendiente:</Text>
                      <Text style={[
                        styles.saldoValue, 
                        parseFloat(saldoPendiente) > 0 ? { color: '#ef4444' } : { color: '#10b981' }
                      ]}>
                        ${saldoPendiente}
                      </Text>
                    </View>
                  </View>
                )}

                <Text style={styles.sectionTitle}>Cambiar Prioridad</Text>
                <View style={styles.buttonGrid}>
                  {(['baja', 'media', 'alta'] as Priority[]).map(priority => (
                    <TouchableOpacity
                      key={priority}
                      style={[
                        styles.priorityButton,
                        (newPriority || selectedTicket.prioridad) === priority && styles.priorityButtonActive
                      ]}
                      onPress={() => setNewPriority(priority)}
                    >
                      <Text style={[styles.priorityButtonText, (newPriority || selectedTicket.prioridad) === priority && styles.priorityButtonTextActive]}>
                        {priority}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.technicianLabel}>Técnico Asignado: {selectedTicket.tecnicoAsignado}</Text>
              </ScrollView>

              <View style={styles.modalActions}>
                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={handleCloseModal}>
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleSaveChanges}>
                  <Text style={styles.saveButtonText}>Guardar Cambios</Text>
                </TouchableOpacity>
              </View>
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
  linkText: { fontSize: 16, color: '#0b3d91', fontWeight: '600', marginTop: 10 },
  
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
  assignedBadge: { alignSelf: 'flex-start', backgroundColor: '#e6f0ff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, marginTop: 12 },
  assignedText: { color: '#0b3d91', fontWeight: '600', fontSize: 12 },

  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, maxHeight: '90%' },
  modalTitle: { fontSize: 24, fontWeight: '800', color: '#0f172a', marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginTop: 16, marginBottom: 10 },
  detailRow: { flexDirection: 'row', marginBottom: 10 },
  detailLabel: { fontSize: 14, fontWeight: '600', color: '#374151', width: 90 },
  detailValue: { fontSize: 14, color: '#64748b', flex: 1 },
  problemBox: { backgroundColor: '#f8fafc', padding: 12, borderRadius: 8, marginBottom: 12 },
  problemDetailText: { fontSize: 14, color: '#64748b' },
  
  buttonGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  stateButton: { flexGrow: 1, minWidth: '45%', paddingVertical: 12, paddingHorizontal: 12, backgroundColor: '#f1f5f9', borderRadius: 8, borderWidth: 2, borderColor: '#f1f5f9', alignItems: 'center' },
  stateButtonActive: { backgroundColor: '#e6f0ff', borderColor: '#0b3d91' },
  stateButtonText: { color: '#374151', fontWeight: '600', textTransform: 'capitalize' },
  stateButtonTextActive: { color: '#0b3d91', fontWeight: '700' },
  
  priorityButton: { flexGrow: 1, minWidth: '30%', paddingVertical: 12, backgroundColor: '#f1f5f9', borderRadius: 8, borderWidth: 2, borderColor: '#f1f5f9', alignItems: 'center' },
  priorityButtonActive: { backgroundColor: '#e6f0ff', borderColor: '#0b3d91' },
  priorityButtonText: { color: '#374151', fontWeight: '600', textTransform: 'capitalize' },
  priorityButtonTextActive: { color: '#0b3d91', fontWeight: '700' },
  
  technicianLabel: { fontSize: 14, color: '#374151', fontWeight: '600', marginTop: 20, marginBottom: 20 },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 16 },
  modalButton: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  cancelButton: { backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#cbd5e1' },
  cancelButtonText: { color: '#64748b', fontWeight: '700', fontSize: 16 },
  saveButton: { backgroundColor: '#10b981' },
  saveButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  // Estilos Campos Cierre
  closingFieldsContainer: { marginTop: 15, marginBottom: 5, borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingTop: 15 },
  helperText: { fontSize: 13, color: '#64748b', marginBottom: 10, fontStyle: 'italic' },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 6 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#334155', marginBottom: 12 },
  textArea: { height: 80, textAlignVertical: 'top' },
  rowInputs: { flexDirection: 'row', justifyContent: 'space-between' },
  saldoContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f8fafc', padding: 10, borderRadius: 8, marginTop: 4 },
  saldoLabel: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
  saldoValue: { fontSize: 18, fontWeight: '800' },
});
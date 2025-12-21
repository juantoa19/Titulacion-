import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from 'react-native';
import { StyleSheet } from 'react-native';
import { useAuth } from '../context/_AuthContext';
import { apiFetch } from '../services/api'; 
import { useFocusEffect, router } from 'expo-router';
import ticketsAsignadosStyles from './styles/tickets-asignados.styles';

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

const mapApiToTicket = (apiTicket: any): Ticket => {
  const cliente = apiTicket.cliente || {}; 
  const tecnico = apiTicket.tecnico || {};
  
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
      cedula: cliente.cedula || 'N/A',
      telefono: cliente.celular || 'N/A',
      direccion: cliente.direccion || 'N/A',
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
      style={ticketsAsignadosStyles.card} 
      onPress={() => {
        setSelectedTicket(ticket);
        setNewStatus(ticket.estado);
        setNewPriority(ticket.prioridad || null); 
        setObservaciones('');
        setCostoTotal('');
        setAbono('');
      }}
    >
      <View style={ticketsAsignadosStyles.ticketHeader}>
        <Text style={ticketsAsignadosStyles.ticketId}>{ticket.ticketId}</Text>
        <View style={ticketsAsignadosStyles.statusBadge}>
          <View style={[ticketsAsignadosStyles.statusDot, { backgroundColor: getStatusColor(ticket.estado) }]} />
          <Text style={ticketsAsignadosStyles.statusText}>{ticket.estado.replace('_', ' ')}</Text>
        </View>
      </View>

      <Text style={ticketsAsignadosStyles.deviceText}>{ticket.deviceInfo.marca} {ticket.deviceInfo.modelo} • {ticket.deviceInfo.tipoDispositivo}</Text>
      <Text style={ticketsAsignadosStyles.userText}>{ticket.userInfo?.nombre1} {ticket.userInfo?.apellido1} • {ticket.userInfo?.telefono}</Text>
      <Text style={ticketsAsignadosStyles.problemText} numberOfLines={2}>{ticket.problema}</Text>

      <View style={ticketsAsignadosStyles.cardFooter}>
        <Text style={ticketsAsignadosStyles.dateText}>{formatDate(ticket.fechaSolicitud)}</Text>
        {ticket.prioridad ? (
          <Text style={[ticketsAsignadosStyles.priorityText, { color: getPriorityColor(ticket.prioridad) }]}>
            {ticket.prioridad.toUpperCase()}
          </Text>
        ) : null}
      </View>

      <View style={ticketsAsignadosStyles.assignedBadge}>
        <Text style={ticketsAsignadosStyles.assignedText}>👨‍🔧 Asignado a: {ticket.tecnicoAsignado}</Text>
      </View>
    </TouchableOpacity>
  );

  const isClosing = newStatus === 'cerrado';
  const saldoPendiente = (parseFloat(costoTotal || '0') - parseFloat(abono || '0')).toFixed(2);

  return (
    <View style={ticketsAsignadosStyles.container}>
      {/* Header mejorado */}
      <View style={ticketsAsignadosStyles.header}>
        <Text style={ticketsAsignadosStyles.title}>Mis Tickets Asignados</Text>
        <Text style={ticketsAsignadosStyles.subtitle}>Tickets en los que estás trabajando</Text>
        
        {/* Estadísticas rápidas */}
        <View style={ticketsAsignadosStyles.statsContainer}>
          <View style={ticketsAsignadosStyles.statItem}>
            <Text style={ticketsAsignadosStyles.statNumber}>{myTickets.length}</Text>
            <Text style={ticketsAsignadosStyles.statLabel}>Total</Text>
          </View>
          <View style={ticketsAsignadosStyles.statItem}>
            <Text style={ticketsAsignadosStyles.statNumber}>
              {myTickets.filter(t => t.estado === 'pendiente').length}
            </Text>
            <Text style={ticketsAsignadosStyles.statLabel}>Pendientes</Text>
          </View>
          <View style={ticketsAsignadosStyles.statItem}>
            <Text style={ticketsAsignadosStyles.statNumber}>
              {myTickets.filter(t => t.estado === 'en_revision').length}
            </Text>
            <Text style={ticketsAsignadosStyles.statLabel}>En revisión</Text>
          </View>
        </View>
      </View>

      {loading ? (
        <View style={ticketsAsignadosStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#10518b" />
        </View>
      ) : (
        <FlatList
          data={myTickets}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <TicketCard ticket={item} />}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={
            <View style={ticketsAsignadosStyles.emptyContainer}>
              <Text style={ticketsAsignadosStyles.emptyText}>No tienes tickets asignados aún.</Text>
              <TouchableOpacity onPress={() => router.push('/technician/tickets-disponibles' as any)}>
                <Text style={ticketsAsignadosStyles.linkText}>Ver tickets disponibles</Text>
              </TouchableOpacity>
            </View>
          }
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              tintColor="#5faee3"
              colors={['#5faee3', '#10518b']}
            />
          }
        />
      )}

      {selectedTicket && (
        <Modal transparent animationType="fade" visible={!!selectedTicket} onRequestClose={handleCloseModal}>
          <View style={ticketsAsignadosStyles.modalOverlay}>
            <View style={ticketsAsignadosStyles.modalContent}>
              <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={ticketsAsignadosStyles.scrollContent}
              >
                <Text style={ticketsAsignadosStyles.modalTitle}>{selectedTicket.ticketId}</Text>

                <Text style={ticketsAsignadosStyles.sectionTitle}>Información del Usuario</Text>
                <View style={ticketsAsignadosStyles.detailRow}>
                  <Text style={ticketsAsignadosStyles.detailLabel}>Nombre:</Text>
                  <Text style={ticketsAsignadosStyles.detailValue}>{selectedTicket.userInfo?.nombre1} {selectedTicket.userInfo?.apellido1}</Text>
                </View>
                <View style={ticketsAsignadosStyles.detailRow}>
                   <Text style={ticketsAsignadosStyles.detailLabel}>Cédula:</Text>
                   <Text style={ticketsAsignadosStyles.detailValue}>{selectedTicket.userInfo?.cedula}</Text>
                </View>
                <View style={ticketsAsignadosStyles.detailRow}>
                  <Text style={ticketsAsignadosStyles.detailLabel}>Teléfono:</Text>
                  <Text style={ticketsAsignadosStyles.detailValue}>{selectedTicket.userInfo?.telefono}</Text>
                </View>
                <View style={ticketsAsignadosStyles.detailRow}>
                   <Text style={ticketsAsignadosStyles.detailLabel}>Dirección:</Text>
                   <Text style={ticketsAsignadosStyles.detailValue}>{selectedTicket.userInfo?.direccion}</Text>
                </View>

                <Text style={ticketsAsignadosStyles.sectionTitle}>Información del Dispositivo</Text>
                <View style={ticketsAsignadosStyles.detailRow}>
                  <Text style={ticketsAsignadosStyles.detailLabel}>Marca:</Text>
                  <Text style={ticketsAsignadosStyles.detailValue}>{selectedTicket.deviceInfo.marca}</Text>
                </View>
                <View style={ticketsAsignadosStyles.detailRow}>
                  <Text style={ticketsAsignadosStyles.detailLabel}>Modelo:</Text>
                  <Text style={ticketsAsignadosStyles.detailValue}>{selectedTicket.deviceInfo.modelo}</Text>
                </View>
                <View style={ticketsAsignadosStyles.detailRow}>
                  <Text style={ticketsAsignadosStyles.detailLabel}>Tipo:</Text>
                  <Text style={ticketsAsignadosStyles.detailValue}>{selectedTicket.deviceInfo.tipoDispositivo}</Text>
                </View>
                <View style={ticketsAsignadosStyles.detailRow}>
                  <Text style={ticketsAsignadosStyles.detailLabel}>N° Serie:</Text>
                  <Text style={ticketsAsignadosStyles.detailValue}>{selectedTicket.deviceInfo.numeroSerie || 'N/A'}</Text>
                </View>

                <Text style={ticketsAsignadosStyles.sectionTitle}>Descripción del Problema</Text>
                <View style={ticketsAsignadosStyles.problemBox}>
                  <Text style={ticketsAsignadosStyles.problemDetailText}>{selectedTicket.problema}</Text>
                </View>

                <Text style={ticketsAsignadosStyles.sectionTitle}>Cambiar Estado</Text>
                <View style={ticketsAsignadosStyles.buttonGrid}>
                  {(['pendiente', 'en_revision', 'reparado', 'cerrado'] as TicketStatus[]).map(status => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        ticketsAsignadosStyles.stateButton,
                        (newStatus || selectedTicket.estado) === status && ticketsAsignadosStyles.stateButtonActive
                      ]}
                      onPress={() => setNewStatus(status)}
                    >
                      <Text style={[
                        ticketsAsignadosStyles.stateButtonText, 
                        (newStatus || selectedTicket.estado) === status && ticketsAsignadosStyles.stateButtonTextActive
                      ]}>
                        {status.replace('_', ' ')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {isClosing && (
                  <View style={ticketsAsignadosStyles.closingFieldsContainer}>
                    <Text style={ticketsAsignadosStyles.helperText}>Complete los datos para cerrar el ticket:</Text>
                    
                    <Text style={ticketsAsignadosStyles.inputLabel}>Observaciones del Técnico *</Text>
                    <TextInput
                      style={[ticketsAsignadosStyles.input, ticketsAsignadosStyles.textArea]}
                      placeholder="Detalles de la reparación realizada..."
                      multiline
                      numberOfLines={3}
                      value={observaciones}
                      onChangeText={setObservaciones}
                      placeholderTextColor="#94a3b8"
                    />

                    <View style={ticketsAsignadosStyles.rowInputs}>
                      <View style={{ flex: 1, marginRight: 8 }}>
                        <Text style={ticketsAsignadosStyles.inputLabel}>Costo Total ($) *</Text>
                        <TextInput
                          style={ticketsAsignadosStyles.input}
                          placeholder="0.00"
                          keyboardType="numeric"
                          value={costoTotal}
                          onChangeText={setCostoTotal}
                          placeholderTextColor="#94a3b8"
                        />
                      </View>
                      <View style={{ flex: 1, marginLeft: 8 }}>
                        <Text style={ticketsAsignadosStyles.inputLabel}>Abono ($) *</Text>
                        <TextInput
                          style={ticketsAsignadosStyles.input}
                          placeholder="0.00"
                          keyboardType="numeric"
                          value={abono}
                          onChangeText={setAbono}
                          placeholderTextColor="#94a3b8"
                        />
                      </View>
                    </View>

                    <View style={ticketsAsignadosStyles.saldoContainer}>
                      <Text style={ticketsAsignadosStyles.saldoLabel}>Saldo Pendiente:</Text>
                      <Text style={[
                        ticketsAsignadosStyles.saldoValue, 
                        parseFloat(saldoPendiente) > 0 ? { color: '#ef4444' } : { color: '#10b981' }
                      ]}>
                        ${saldoPendiente}
                      </Text>
                    </View>
                  </View>
                )}

                <Text style={ticketsAsignadosStyles.sectionTitle}>Cambiar Prioridad</Text>
                <View style={ticketsAsignadosStyles.buttonGrid}>
                  {(['baja', 'media', 'alta'] as Priority[]).map(priority => (
                    <TouchableOpacity
                      key={priority}
                      style={[
                        ticketsAsignadosStyles.priorityButton,
                        (newPriority || selectedTicket.prioridad) === priority && ticketsAsignadosStyles.priorityButtonActive
                      ]}
                      onPress={() => setNewPriority(priority)}
                    >
                      <Text style={[
                        ticketsAsignadosStyles.priorityButtonText, 
                        (newPriority || selectedTicket.prioridad) === priority && ticketsAsignadosStyles.priorityButtonTextActive
                      ]}>
                        {priority}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={ticketsAsignadosStyles.technicianLabel}>Técnico Asignado: {selectedTicket.tecnicoAsignado}</Text>
              </ScrollView>

              <View style={ticketsAsignadosStyles.modalActions}>
                <TouchableOpacity 
                  style={[ticketsAsignadosStyles.modalButton, ticketsAsignadosStyles.cancelButton]} 
                  onPress={handleCloseModal}
                >
                  <Text style={ticketsAsignadosStyles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[ticketsAsignadosStyles.modalButton, ticketsAsignadosStyles.saveButton]} 
                  onPress={handleSaveChanges}
                >
                  <Text style={ticketsAsignadosStyles.saveButtonText}>Guardar Cambios</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
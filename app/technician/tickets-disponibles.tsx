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
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useAuth } from '../context/_AuthContext';
import { apiFetch } from '../services/api';
import ticketsDisponiblesStyles from './styles/tickets-disponibles.styles';
import BackButton from '../../components/BackButton';

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

const mapApiToTicket = (apiTicket: any): Ticket => {
  const cliente = apiTicket.cliente || {};
  
  const nombreCompleto = (cliente.nombre || 'Usuario Desconocido').split(' ');
  const nombre1 = nombreCompleto[0] || '';
  const apellido1 = nombreCompleto.length > 1 ? nombreCompleto[1] : '';

  return {
    id: apiTicket.id.toString(),
    ticketId: `TKT-${apiTicket.id}`,
    userInfo: {
      nombre1: nombre1,
      apellido1: apellido1,
      cedula: cliente.cedula || 'N/A',
      telefono: cliente.celular || 'N/A',
      direccion: cliente.direccion || 'N/A'
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
    tecnicoAsignado: apiTicket.tecnico ? apiTicket.tecnico.name : undefined,
  };
};

export default function TicketsDisponibles() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchTickets();
    }, [])
  );

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/tickets');
      
      const mappedTickets: Ticket[] = data
        .filter((t: any) => t.tecnico_id === null)
        .map(mapApiToTicket);

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
        await apiFetch(`/tickets/${selectedTicket.id}/assign`, 'POST');
        
        Alert.alert('Éxito', `Ticket ${selectedTicket.ticketId} asignado a ${user.name}`);
        setSelectedTicket(null);
        router.push('/technician/tickets-asignados' as any);

      } catch (error: any) {
         Alert.alert('Error', error.response?.data?.message || 'No se pudo asignar el ticket');
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
      style={ticketsDisponiblesStyles.card} 
      onPress={() => setSelectedTicket(ticket)}
      activeOpacity={0.8}
    >
      <View style={ticketsDisponiblesStyles.ticketHeader}>
        <View>
          <Text style={ticketsDisponiblesStyles.ticketId}>{ticket.ticketId}</Text>
          <Text style={ticketsDisponiblesStyles.dateText}>
            {formatDate(ticket.fechaSolicitud)}
          </Text>
        </View>
        <View style={[ticketsDisponiblesStyles.statusBadge, { backgroundColor: getStatusColor(ticket.estado) + '20' }]}>
          <View style={[ticketsDisponiblesStyles.statusDot, { backgroundColor: getStatusColor(ticket.estado) }]} />
          <Text style={[ticketsDisponiblesStyles.statusText, { color: getStatusColor(ticket.estado) }]}>
            {ticket.estado.replace('_', ' ')}
          </Text>
        </View>
      </View>

      <Text style={ticketsDisponiblesStyles.deviceText}>
        {ticket.deviceInfo.marca} {ticket.deviceInfo.modelo} • {ticket.deviceInfo.tipoDispositivo}
      </Text>
      <Text style={ticketsDisponiblesStyles.userText}>
        {ticket.userInfo.nombre1} {ticket.userInfo.apellido1} • {ticket.userInfo.telefono}
      </Text>
      <Text style={ticketsDisponiblesStyles.problemText} numberOfLines={2}>
        {ticket.problema}
      </Text>

      <View style={ticketsDisponiblesStyles.cardFooter}>
        {ticket.prioridad ? (
          <View style={[ticketsDisponiblesStyles.priorityBadge, { backgroundColor: getPriorityColor(ticket.prioridad) + '20' }]}>
            <Text style={[ticketsDisponiblesStyles.priorityText, { color: getPriorityColor(ticket.prioridad) }]}>
              {ticket.prioridad.toUpperCase()}
            </Text>
          </View>
        ) : null}
        <Text style={ticketsDisponiblesStyles.availableBadge}>📝 DISPONIBLE</Text>
      </View>
    </TouchableOpacity>
  );

  const TicketDetailModal = ({ ticket }: { ticket: Ticket }) => (
    <Modal transparent animationType="fade" visible={!!selectedTicket}>
      <View style={ticketsDisponiblesStyles.modalOverlay}>
        <View style={ticketsDisponiblesStyles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={ticketsDisponiblesStyles.scrollContent}>
            <Text style={ticketsDisponiblesStyles.modalTitle}>{ticket.ticketId}</Text>

            {/* Estado y Prioridad */}
            <View style={ticketsDisponiblesStyles.infoBadges}>
              <View style={[ticketsDisponiblesStyles.statusBadgeModal, { backgroundColor: getStatusColor(ticket.estado) + '20' }]}>
                <View style={[ticketsDisponiblesStyles.statusDot, { backgroundColor: getStatusColor(ticket.estado) }]} />
                <Text style={[ticketsDisponiblesStyles.statusText, { color: getStatusColor(ticket.estado) }]}>
                  {ticket.estado.replace('_', ' ').toUpperCase()}
                </Text>
              </View>
              {ticket.prioridad && (
                <View style={[ticketsDisponiblesStyles.priorityBadgeModal, { backgroundColor: getPriorityColor(ticket.prioridad) + '20' }]}>
                  <Text style={[ticketsDisponiblesStyles.priorityTextModal, { color: getPriorityColor(ticket.prioridad) }]}>
                    {ticket.prioridad.toUpperCase()}
                  </Text>
                </View>
              )}
            </View>

            {/* Info Usuario */}
            <Text style={ticketsDisponiblesStyles.sectionTitle}>Información del Usuario</Text>
            <View style={ticketsDisponiblesStyles.infoBox}>
              <View style={ticketsDisponiblesStyles.detailRow}>
                <Text style={ticketsDisponiblesStyles.detailLabel}>Nombre:</Text>
                <Text style={ticketsDisponiblesStyles.detailValue}>{ticket.userInfo.nombre1} {ticket.userInfo.apellido1}</Text>
              </View>
              {ticket.userInfo.cedula && ticket.userInfo.cedula !== 'N/A' && (
                <View style={ticketsDisponiblesStyles.detailRow}>
                  <Text style={ticketsDisponiblesStyles.detailLabel}>Cédula:</Text>
                  <Text style={ticketsDisponiblesStyles.detailValue}>{ticket.userInfo.cedula}</Text>
                </View>
              )}
              {ticket.userInfo.telefono && ticket.userInfo.telefono !== 'N/A' && (
                <View style={ticketsDisponiblesStyles.detailRow}>
                  <Text style={ticketsDisponiblesStyles.detailLabel}>Teléfono:</Text>
                  <Text style={ticketsDisponiblesStyles.detailValue}>{ticket.userInfo.telefono}</Text>
                </View>
              )}
              {ticket.userInfo.direccion && ticket.userInfo.direccion !== 'N/A' && (
                <View style={ticketsDisponiblesStyles.detailRow}>
                  <Text style={ticketsDisponiblesStyles.detailLabel}>Dirección:</Text>
                  <Text style={ticketsDisponiblesStyles.detailValue}>{ticket.userInfo.direccion}</Text>
                </View>
              )}
            </View>

            {/* Info Dispositivo */}
            <Text style={ticketsDisponiblesStyles.sectionTitle}>Información del Dispositivo</Text>
            <View style={ticketsDisponiblesStyles.infoBox}>
              <View style={ticketsDisponiblesStyles.detailRow}>
                <Text style={ticketsDisponiblesStyles.detailLabel}>Tipo:</Text>
                <Text style={ticketsDisponiblesStyles.detailValue}>{ticket.deviceInfo.tipoDispositivo}</Text>
              </View>
              <View style={ticketsDisponiblesStyles.detailRow}>
                <Text style={ticketsDisponiblesStyles.detailLabel}>Marca:</Text>
                <Text style={ticketsDisponiblesStyles.detailValue}>{ticket.deviceInfo.marca}</Text>
              </View>
              <View style={ticketsDisponiblesStyles.detailRow}>
                <Text style={ticketsDisponiblesStyles.detailLabel}>Modelo:</Text>
                <Text style={ticketsDisponiblesStyles.detailValue}>{ticket.deviceInfo.modelo}</Text>
              </View>
              {ticket.deviceInfo.numeroSerie && (
                <View style={ticketsDisponiblesStyles.detailRow}>
                  <Text style={ticketsDisponiblesStyles.detailLabel}>N° Serie:</Text>
                  <Text style={ticketsDisponiblesStyles.detailValue}>{ticket.deviceInfo.numeroSerie}</Text>
                </View>
              )}
            </View>

            {/* Problema */}
            <Text style={ticketsDisponiblesStyles.sectionTitle}>Descripción del Problema</Text>
            <View style={ticketsDisponiblesStyles.problemBox}>
              <Text style={ticketsDisponiblesStyles.problemDetailText}>{ticket.problema}</Text>
            </View>

            <View style={ticketsDisponiblesStyles.dateInfo}>
              <Text style={ticketsDisponiblesStyles.dateLabel}>Fecha de solicitud:</Text>
              <Text style={ticketsDisponiblesStyles.dateValue}>{formatDate(ticket.fechaSolicitud)}</Text>
            </View>

            <View style={ticketsDisponiblesStyles.userInfo}>
              <Text style={ticketsDisponiblesStyles.userNameLabel}>Técnico:</Text>
              <Text style={ticketsDisponiblesStyles.userNameValue}>{user?.name || 'Tú'}</Text>
              <Text style={ticketsDisponiblesStyles.userEmail}>{user?.email}</Text>
            </View>
          </ScrollView>

          <View style={ticketsDisponiblesStyles.modalActions}>
            <TouchableOpacity 
              style={[ticketsDisponiblesStyles.modalButton, ticketsDisponiblesStyles.cancelButton]} 
              onPress={() => setSelectedTicket(null)}
              activeOpacity={0.7}
            >
              <Text style={ticketsDisponiblesStyles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[ticketsDisponiblesStyles.modalButton, ticketsDisponiblesStyles.takeButton]} 
              onPress={handleTakeTicket}
              activeOpacity={0.7}
            >
              <Text style={ticketsDisponiblesStyles.takeButtonText}>Tomar Ticket</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={ticketsDisponiblesStyles.container}>
      {/* Header mejorado */}
       <BackButton />
      <View style={ticketsDisponiblesStyles.header}>
        <Text style={ticketsDisponiblesStyles.title}>Tickets Disponibles</Text>
        <Text style={ticketsDisponiblesStyles.subtitle}>Tickets sin técnico asignado</Text>
        
        <View style={ticketsDisponiblesStyles.statsContainer}>
          <View style={ticketsDisponiblesStyles.statItem}>
            <Text style={ticketsDisponiblesStyles.statNumber}>{tickets.length}</Text>
            <Text style={ticketsDisponiblesStyles.statLabel}>Disponibles</Text>
          </View>
          <View style={ticketsDisponiblesStyles.statDivider} />
          <View style={ticketsDisponiblesStyles.statItem}>
            <Text style={ticketsDisponiblesStyles.statNumber}>
              {tickets.filter(t => t.prioridad === 'alta').length}
            </Text>
            <Text style={ticketsDisponiblesStyles.statLabel}>Alta prioridad</Text>
          </View>
          <View style={ticketsDisponiblesStyles.statDivider} />
          <View style={ticketsDisponiblesStyles.statItem}>
            <Text style={ticketsDisponiblesStyles.statNumber}>
              {tickets.filter(t => t.estado === 'pendiente').length}
            </Text>
            <Text style={ticketsDisponiblesStyles.statLabel}>Pendientes</Text>
          </View>
        </View>
      </View>

      {loading ? (
        <View style={ticketsDisponiblesStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#10518b" />
          <Text style={ticketsDisponiblesStyles.loadingText}>Cargando tickets...</Text>
        </View>
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <TicketCard ticket={item} />}
          contentContainerStyle={ticketsDisponiblesStyles.listContent}
          ListEmptyComponent={
            <View style={ticketsDisponiblesStyles.emptyContainer}>
              <Text style={ticketsDisponiblesStyles.emptyText}>🎉 ¡Excelente!</Text>
              <Text style={ticketsDisponiblesStyles.emptySubtext}>No hay tickets disponibles por el momento.</Text>
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
          showsVerticalScrollIndicator={false}
        />
      )}
      {selectedTicket && <TicketDetailModal ticket={selectedTicket} />}
    </View>
  );
}
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
import { useAuth } from '../context/_AuthContext';
import { apiFetch } from '../services/api';
import { useFocusEffect } from 'expo-router';
import ticketStatusStyles from './styles/ticket-status.styles';
import BackButton from '../../components/BackButton';

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
  observacionRevision?: string;
  observacionesTecnico?: string;
  tecnicoAsignado?: string;
  recepcionista?: string;
  observaciones_tecnico?: string;
  costo_total?: number;
  abono?: number;
}

const mapApiToTicket = (apiTicket: any): Ticket => {
  const usuario = apiTicket.cliente || {};
  const tecnico = apiTicket.tecnico || {};
  const recepcionista = apiTicket.recepcionista || {};

  const nombreCompleto = (usuario.nombre || 'Cliente Desconocido').split(' ');
  const nombre1 = nombreCompleto[0] || '';
  const apellido1 = nombreCompleto.length > 1 ? nombreCompleto[1] : '';

  return {
    id: apiTicket.id.toString(),
    ticketId: `TKT-${apiTicket.id}`,
    userId: apiTicket.client_id?.toString() || '0',
    userInfo: {
      nombre1: nombre1,
      apellido1: apellido1,
      cedula: usuario.cedula || 'N/A',
      telefono: usuario.celular || 'N/A',
      email: 'N/A',
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
    observacionRevision: apiTicket.observacion_revision,
    observacionesTecnico: apiTicket.observaciones_tecnico,
    prioridad: apiTicket.prioridad,
    tecnicoAsignado: tecnico.name || 'Sin asignar',
    recepcionista: recepcionista.name || 'Sistema',
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

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case 'pendiente': return '#ef4444';
      case 'en_revision': return '#f59e0b';
      case 'reparado': return '#10b981';
      case 'cerrado': return '#475569';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const TicketCard = ({ ticket }: { ticket: Ticket }) => (
    <TouchableOpacity
      style={ticketStatusStyles.card}
      onPress={() => setSelectedTicket(ticket)}
      activeOpacity={0.8}
    >
      <View style={ticketStatusStyles.ticketHeader}>
        <Text style={ticketStatusStyles.ticketId}>{ticket.ticketId}</Text>
        <View style={ticketStatusStyles.statusBadge}>
          <View style={[ticketStatusStyles.statusDot, { backgroundColor: getStatusColor(ticket.estado) }]} />
          <Text style={ticketStatusStyles.statusText}>{ticket.estado.replace('_', ' ')}</Text>
        </View>
      </View>

      <Text style={ticketStatusStyles.deviceText}>{ticket.deviceInfo.marca} {ticket.deviceInfo.modelo}</Text>
      <Text style={ticketStatusStyles.userText}>Cliente: {ticket.userInfo?.nombre1} {ticket.userInfo?.apellido1}</Text>

      <View style={ticketStatusStyles.cardFooter}>
        <Text style={ticketStatusStyles.dateText}>{formatDate(ticket.fechaSolicitud)}</Text>
        <Text style={ticketStatusStyles.assignedText}>Tec: {ticket.tecnicoAsignado}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={ticketStatusStyles.container}>
      {/* Header mejorado */}
      <BackButton />
      <View style={ticketStatusStyles.header}>
        <Text style={ticketStatusStyles.title}>Estado de Tickets</Text>
        <Text style={ticketStatusStyles.subtitle}>Consulta todos los tickets del sistema</Text>

        {/* Estadísticas rápidas */}
        <View style={ticketStatusStyles.statsContainer}>
          <View style={ticketStatusStyles.statItem}>
            <Text style={ticketStatusStyles.statNumber}>{tickets.length}</Text>
            <Text style={ticketStatusStyles.statLabel}>Total</Text>
          </View>
          <View style={ticketStatusStyles.statDivider} />
          <View style={ticketStatusStyles.statItem}>
            <Text style={ticketStatusStyles.statNumber}>
              {tickets.filter(t => t.estado === 'pendiente').length}
            </Text>
            <Text style={ticketStatusStyles.statLabel}>Pendientes</Text>
          </View>
          <View style={ticketStatusStyles.statDivider} />
          <View style={ticketStatusStyles.statItem}>
            <Text style={ticketStatusStyles.statNumber}>
              {tickets.filter(t => t.estado === 'en_revision').length}
            </Text>
            <Text style={ticketStatusStyles.statLabel}>En revisión</Text>
          </View>
          <View style={ticketStatusStyles.statDivider} />
          <View style={ticketStatusStyles.statItem}>
            <Text style={ticketStatusStyles.statNumber}>
              {tickets.filter(t => t.estado === 'cerrado').length}
            </Text>
            <Text style={ticketStatusStyles.statLabel}>Cerrados</Text>
          </View>
        </View>
      </View>

      {loading ? (
        <View style={ticketStatusStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#10518b" />
          <Text style={ticketStatusStyles.loadingText}>Cargando tickets...</Text>
        </View>
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <TicketCard ticket={item} />}
          contentContainerStyle={ticketStatusStyles.listContent}
          ListEmptyComponent={
            <View style={ticketStatusStyles.emptyContainer}>
              <Text style={ticketStatusStyles.emptyText}>No hay tickets registrados.</Text>
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

      {/* MODAL DE DETALLE */}
      {selectedTicket && (
        <Modal transparent animationType="slide" visible={!!selectedTicket} onRequestClose={() => setSelectedTicket(null)}>
          <View style={ticketStatusStyles.modalOverlay}>
            <View style={ticketStatusStyles.modalContent}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={ticketStatusStyles.modalHeader}>
                  <Text style={ticketStatusStyles.modalTitle}>{selectedTicket.ticketId}</Text>
                  <View style={[ticketStatusStyles.statusTag, { backgroundColor: getStatusColor(selectedTicket.estado) + '20' }]}>
                    <Text style={[ticketStatusStyles.statusTagText, { color: getStatusColor(selectedTicket.estado) }]}>
                      {selectedTicket.estado.toUpperCase().replace('_', ' ')}
                    </Text>
                  </View>
                </View>

                {/* Información centrada */}
                <View style={ticketStatusStyles.infoContainer}>

                  {/* Info Cliente */}
                  <View style={ticketStatusStyles.infoSection}>
                    <Text style={ticketStatusStyles.sectionTitle}>👤 Cliente</Text>
                    <View style={ticketStatusStyles.infoCard}>
                      <Text style={ticketStatusStyles.infoLabel}>Nombre</Text>
                      <Text style={ticketStatusStyles.infoValue}>{selectedTicket.userInfo.nombre1} {selectedTicket.userInfo.apellido1}</Text>

                      <Text style={ticketStatusStyles.infoLabel}>Cédula</Text>
                      <Text style={ticketStatusStyles.infoValue}>{selectedTicket.userInfo.cedula}</Text>

                      <Text style={ticketStatusStyles.infoLabel}>Teléfono</Text>
                      <Text style={ticketStatusStyles.infoValue}>{selectedTicket.userInfo.telefono}</Text>

                      <Text style={ticketStatusStyles.infoLabel}>Dirección</Text>
                      <Text style={ticketStatusStyles.infoValue}>{selectedTicket.userInfo.direccion}</Text>
                    </View>
                  </View>

                  {/* Info Dispositivo */}
                  <View style={ticketStatusStyles.infoSection}>
                    <Text style={ticketStatusStyles.sectionTitle}>💻 Dispositivo</Text>
                    <View style={ticketStatusStyles.infoCard}>
                      <Text style={ticketStatusStyles.infoLabel}>Equipo</Text>
                      <Text style={ticketStatusStyles.infoValue}>{selectedTicket.deviceInfo.tipoDispositivo}</Text>

                      <Text style={ticketStatusStyles.infoLabel}>Modelo</Text>
                      <Text style={ticketStatusStyles.infoValue}>{selectedTicket.deviceInfo.marca} {selectedTicket.deviceInfo.modelo}</Text>

                      <Text style={ticketStatusStyles.infoLabel}>N° Serie</Text>
                      <Text style={ticketStatusStyles.infoValue}>{selectedTicket.deviceInfo.numeroSerie || 'S/N'}</Text>
                    </View>
                  </View>

                  {/* Problema Reportado */}
                  <View style={ticketStatusStyles.infoSection}>
                    <Text style={ticketStatusStyles.sectionTitle}>🔧 Problema Reportado</Text>
                    <View style={ticketStatusStyles.problemCard}>
                      <Text style={ticketStatusStyles.problemText}>{selectedTicket.problema}</Text>
                    </View>
                  </View>

                  {/* DATOS DE REVISIÓN */}
                  {selectedTicket.estado === 'en_revision' && selectedTicket.observacionRevision && (
                    <View style={ticketStatusStyles.revisionContainer}>
                      <Text style={ticketStatusStyles.revisionLabel}>
                        ⚠️ Diagnóstico / Revisión en curso:
                      </Text>
                      <Text style={ticketStatusStyles.revisionText}>
                        {selectedTicket.observacionRevision}
                      </Text>
                    </View>
                  )}

                  {/* DATOS DE CIERRE */}
                  {selectedTicket.estado === 'cerrado' && (
                    <View style={ticketStatusStyles.infoSection}>
                      <Text style={[ticketStatusStyles.sectionTitle, { color: '#10b981' }]}>✅ Información de Cierre</Text>
                      <View style={ticketStatusStyles.closureCard}>

                        <Text style={ticketStatusStyles.infoLabel}>Observaciones del Técnico</Text>
                        <View style={ticketStatusStyles.obsCard}>
                          <Text style={ticketStatusStyles.obsText}>{selectedTicket.observaciones_tecnico || 'Sin observaciones.'}</Text>
                        </View>

                        <View style={ticketStatusStyles.financialSection}>
                          <Text style={ticketStatusStyles.infoLabel}>Información Financiera</Text>
                          <View style={ticketStatusStyles.financialGrid}>
                            <View style={ticketStatusStyles.financialCard}>
                              <Text style={ticketStatusStyles.financialLabel}>Costo Total</Text>
                              <Text style={ticketStatusStyles.financialValue}>${selectedTicket.costo_total?.toFixed(2) || '0.00'}</Text>
                            </View>
                            <View style={ticketStatusStyles.financialCard}>
                              <Text style={ticketStatusStyles.financialLabel}>Abono</Text>
                              <Text style={ticketStatusStyles.financialValue}>${selectedTicket.abono?.toFixed(2) || '0.00'}</Text>
                            </View>
                            <View style={ticketStatusStyles.financialCard}>
                              <Text style={ticketStatusStyles.financialLabel}>Saldo Pendiente</Text>
                              <Text style={[
                                ticketStatusStyles.financialValue,
                                (selectedTicket.costo_total! - selectedTicket.abono!) > 0 ? { color: '#ef4444' } : { color: '#10b981' }
                              ]}>
                                ${((selectedTicket.costo_total! - selectedTicket.abono!) || 0).toFixed(2)}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  )}

                  {/* Información del equipo */}
                  <View style={ticketStatusStyles.infoSection}>
                    <Text style={ticketStatusStyles.sectionTitle}>👥 Equipo Asignado</Text>
                    <View style={ticketStatusStyles.teamCard}>
                      <View style={ticketStatusStyles.teamMember}>
                        <Text style={ticketStatusStyles.teamLabel}>Técnico</Text>
                        <Text style={ticketStatusStyles.teamValue}>{selectedTicket.tecnicoAsignado}</Text>
                      </View>
                      <View style={ticketStatusStyles.teamMember}>
                        <Text style={ticketStatusStyles.teamLabel}>Recepcionista</Text>
                        <Text style={ticketStatusStyles.teamValue}>{selectedTicket.recepcionista}</Text>
                      </View>
                    </View>
                  </View>

                </View>
              </ScrollView>

              <TouchableOpacity
                style={ticketStatusStyles.closeButton}
                onPress={() => setSelectedTicket(null)}
                activeOpacity={0.7}
              >
                <Text style={ticketStatusStyles.closeButtonText}>Cerrar Detalle</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
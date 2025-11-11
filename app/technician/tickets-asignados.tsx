import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, Modal, Alert } from 'react-native';
import { useAuth } from '../context/_AuthContext';

type TicketStatus = 'pendiente' | 'en_revision' | 'reparado' | 'cerrado';
type Priority = 'alta' | 'media' | 'baja';

export default function TicketsAsignados() {
  const { user, tickets, updateTicketDetails } = useAuth();
  const [selectedTicket, setSelectedTicket] = useState<(typeof tickets)[0] | null>(null);
  const [newStatus, setNewStatus] = useState<TicketStatus | null>(null);
  const [newPriority, setNewPriority] = useState<Priority | null>(null);

  // Filtrar tickets asignados al técnico actual
  const myTickets = tickets.filter(t => (t as any).tecnicoAsignado === user?.name);

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case 'pendiente': return '#ef4444';
      case 'en_revision': return '#f59e0b';
      case 'reparado': return '#10b981';
      case 'cerrado': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const handleSaveChanges = () => {
    if (selectedTicket) {
      const status = newStatus || selectedTicket.estado;
      const priority = newPriority || selectedTicket.prioridad;
      updateTicketDetails(selectedTicket.id, status, priority as Priority);
      Alert.alert('Éxito', `Ticket ${selectedTicket.ticketId} actualizado`);
      setSelectedTicket(null);
      setNewStatus(null);
      setNewPriority(null);
    }
  };

  const TicketCard = ({ ticket }: { ticket: (typeof tickets)[0] }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => {
        setSelectedTicket(ticket);
        setNewStatus(null);
        setNewPriority(null);
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
          <Text style={[styles.priorityText, { color: ticket.prioridad === 'alta' ? '#ef4444' : ticket.prioridad === 'media' ? '#f59e0b' : '#10b981' }]}>
            {ticket.prioridad.toUpperCase()}
          </Text>
        ) : null}
      </View>

      <View style={styles.assignedBadge}>
        <Text style={styles.assignedText}>👨‍🔧 {ticket.tecnicoAsignado || 'Sin asignar'}</Text>
      </View>
    </TouchableOpacity>
  );

  const EditDetailModal = ({ ticket }: { ticket: (typeof tickets)[0] }) => (
    <Modal transparent animationType="fade" visible={!!selectedTicket}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.modalTitle}>{ticket.ticketId}</Text>

            {/* Info Usuario */}
            <Text style={styles.sectionTitle}>Información del Usuario</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Nombre:</Text>
              <Text style={styles.detailValue}>{ticket.userInfo?.nombre1} {ticket.userInfo?.apellido1}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Teléfono:</Text>
              <Text style={styles.detailValue}>{ticket.userInfo?.telefono}</Text>
            </View>

            {/* Info Dispositivo */}
            <Text style={styles.sectionTitle}>Información del Dispositivo</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Marca:</Text>
              <Text style={styles.detailValue}>{ticket.deviceInfo.marca}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Modelo:</Text>
              <Text style={styles.detailValue}>{ticket.deviceInfo.modelo}</Text>
            </View>

            {/* Problema */}
            <Text style={styles.sectionTitle}>Descripción del Problema</Text>
            <View style={styles.problemBox}>
              <Text style={styles.problemText}>{ticket.problema}</Text>
            </View>

            {/* Cambiar Estado */}
            <Text style={styles.sectionTitle}>Cambiar Estado</Text>
            <View style={styles.buttonGrid}>
              {(['pendiente', 'en_revision', 'reparado', 'cerrado'] as TicketStatus[]).map(status => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.stateButton,
                    (newStatus || ticket.estado) === status && styles.stateButtonActive
                  ]}
                  onPress={() => setNewStatus(status)}
                >
                  <Text style={[(newStatus || ticket.estado) === status && styles.stateButtonTextActive]}>
                    {status.replace('_', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Cambiar Prioridad */}
            <Text style={styles.sectionTitle}>Cambiar Prioridad</Text>
            <View style={styles.buttonGrid}>
              {(['alta', 'media', 'baja'] as Priority[]).map(priority => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.priorityButton,
                    (newPriority || ticket.prioridad) === priority && styles.priorityButtonActive
                  ]}
                  onPress={() => setNewPriority(priority)}
                >
                  <Text style={[(newPriority || ticket.prioridad) === priority && styles.priorityButtonTextActive]}>
                    {priority}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

                        <Text style={styles.technicianLabel}>Técnico Asignado: {ticket.tecnicoAsignado}</Text>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setSelectedTicket(null)}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleSaveChanges}>
              <Text style={styles.saveButtonText}>Guardar Cambios</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Tickets Asignados</Text>
      {myTickets.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tienes tickets asignados aún.</Text>
        </View>
      ) : (
        <FlatList
          data={myTickets}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <TicketCard ticket={item} />}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
      {selectedTicket && <EditDetailModal ticket={selectedTicket} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8fafc' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12, color: '#0f172a' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#94a3b8' },
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
  assignedBadge: { backgroundColor: '#e6f0ff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, marginTop: 10 },
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
  buttonGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  stateButton: { flex: 1, minWidth: '45%', paddingVertical: 10, paddingHorizontal: 12, backgroundColor: '#f1f5f9', borderRadius: 8, borderWidth: 2, borderColor: 'transparent', alignItems: 'center' },
  stateButtonActive: { backgroundColor: '#0b3d91', borderColor: '#0b3d91' },
  stateButtonTextActive: { color: '#fff', fontWeight: '700' },
  priorityButton: { flex: 1, minWidth: '30%', paddingVertical: 10, backgroundColor: '#f1f5f9', borderRadius: 8, borderWidth: 2, borderColor: 'transparent', alignItems: 'center' },
  priorityButtonActive: { backgroundColor: '#0b3d91', borderColor: '#0b3d91' },
  priorityButtonTextActive: { color: '#fff', fontWeight: '700' },
  technicianLabel: { fontSize: 14, color: '#374151', fontWeight: '600', marginTop: 20, marginBottom: 20 },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 16 },
  modalButton: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  cancelButton: { backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#cbd5e1' },
  cancelButtonText: { color: '#64748b', fontWeight: '700', fontSize: 16 },
  saveButton: { backgroundColor: '#10b981' },
  saveButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});

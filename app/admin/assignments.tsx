import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { apiFetch } from '../services/api';
import assignmentsStyles from './styles/assignments.styles';
import BackButton from '../../components/BackButton';


export default function AssignmentsScreen() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const ticketsData = await apiFetch('/tickets');
      const techsData = await apiFetch('/admin/users?role=tecnico');
      setTickets(ticketsData);
      setTechnicians(techsData);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (ticketId: string) => {
    Alert.alert(
      "Confirmar Eliminación",
      "¿Estás seguro de que deseas eliminar este ticket permanentemente? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive", // En iOS esto lo pone rojo automáticamente
          onPress: async () => {
            try {
              // Llamamos al endpoint DELETE /tickets/{id} del TicketController
              await apiFetch(`/tickets/${ticketId}`, 'DELETE');

              Alert.alert("Éxito", "Ticket eliminado correctamente");

              // IMPORTANTE: Recarga la lista para que desaparezca
              // Si tu función de carga se llama diferente (ej: loadData), cambia esto:
              setTickets(tickets.filter(t => t.id !== ticketId));
            } catch (error: any) {
              const msg = error.response?.data?.message || "No se pudo eliminar";
              Alert.alert("Error", msg);
            }
          }
        }
      ]
    );
  };

  const openAssignModal = (ticket: any) => {
    setSelectedTicket(ticket);
    setModalVisible(true);
  };

  const handleAssign = async (technicianId: number) => {
    if (!selectedTicket) return;

    try {
      await apiFetch(`/tickets/${selectedTicket.id}`, 'PUT', {
        tecnico_id: technicianId,
        estado_usuario: 'en_revision',
        estado_interno: 'en_proceso',
        observacion_revision: 'Reasignación administrativa de técnico.'
      });

      Alert.alert('Éxito', 'Ticket reasignado correctamente');
      setModalVisible(false);
      fetchData();
    } catch (error) {
      Alert.alert('Error', 'No se pudo reasignar el ticket');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendiente': return '#ef4444';
      case 'en_revision': return '#f59e0b';
      case 'reparado': return '#10b981';
      case 'cerrado': return '#94a3b8';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pendiente': return 'Pendiente';
      case 'en_revision': return 'En Revisión';
      case 'reparado': return 'Reparado';
      case 'cerrado': return 'Cerrado';
      default: return status;
    }
  };

  const renderTicketItem = ({ item }: { item: any }) => (
    <View style={assignmentsStyles.card}>
      <View style={assignmentsStyles.cardHeader}>
        <View>
          <Text style={assignmentsStyles.ticketId}>TKT-{item.id}</Text>
          <Text style={assignmentsStyles.dateText}>
            {new Date(item.created_at).toLocaleDateString('es-ES')}
          </Text>
        </View>
        <View style={[assignmentsStyles.statusBadge, { backgroundColor: getStatusColor(item.estado_usuario) + '20' }]}>
          <View style={[assignmentsStyles.statusDot, { backgroundColor: getStatusColor(item.estado_usuario) }]} />
          <Text style={[assignmentsStyles.statusText, { color: getStatusColor(item.estado_usuario) }]}>
            {getStatusText(item.estado_usuario)}
          </Text>
        </View>
      </View>

      <Text style={assignmentsStyles.deviceText}>{item.tipo_dispositivo} - {item.marca} {item.modelo}</Text>
      <Text style={assignmentsStyles.clientText}>Cliente: {item.cliente?.nombre || 'N/A'}</Text>

      <View style={assignmentsStyles.assignRow}>
        <View style={assignmentsStyles.techInfo}>
          <Text style={assignmentsStyles.techLabel}>Técnico actual:</Text>
          <View style={assignmentsStyles.techBadge}>
            <Text style={assignmentsStyles.techName}>
              {item.tecnico ? item.tecnico.name : 'Sin asignar'}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={assignmentsStyles.assignButton}
        onPress={() => openAssignModal(item)}
        activeOpacity={0.7}
      >
        <Text style={assignmentsStyles.assignButtonIcon}>🔄</Text>
        <Text style={assignmentsStyles.assignButtonText}>Reasignar Técnico</Text>
      </TouchableOpacity>
      {/* Botón de Eliminar */}
      <TouchableOpacity
        style={assignmentsStyles.deleteButton}
        onPress={() => handleDelete(item.id)}
      >
        <Text style={assignmentsStyles.deleteButtonText}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={assignmentsStyles.container}>
       <BackButton />
      <View style={assignmentsStyles.header}>
        <Text style={assignmentsStyles.title}>Reasignación de Casos</Text>
        <Text style={assignmentsStyles.subtitle}>Mover tickets entre técnicos</Text>
      </View>

      {loading ? (
        <View style={assignmentsStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#10518b" />
          <Text style={assignmentsStyles.loadingText}>Cargando tickets...</Text>
        </View>
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTicketItem}
          contentContainerStyle={assignmentsStyles.listContent}
          ListEmptyComponent={
            <View style={assignmentsStyles.emptyContainer}>
              <Text style={assignmentsStyles.emptyText}>No hay tickets disponibles</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Modal para seleccionar técnico */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={assignmentsStyles.modalOverlay}>
          <View style={assignmentsStyles.modalContent}>
            <View style={assignmentsStyles.modalHeader}>
              <Text style={assignmentsStyles.modalTitle}>Seleccionar Técnico</Text>
              <Text style={assignmentsStyles.modalSubtitle}>
                Ticket TKT-{selectedTicket?.id}
              </Text>
            </View>

            <ScrollView
              style={assignmentsStyles.techList}
              showsVerticalScrollIndicator={false}
            >
              {technicians.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={assignmentsStyles.techOption}
                  onPress={() => handleAssign(item.id)}
                  activeOpacity={0.7}
                >
                  <View style={assignmentsStyles.techAvatar}>
                    <Text style={assignmentsStyles.techAvatarText}>
                      {item.name?.charAt(0).toUpperCase() || 'T'}
                    </Text>
                  </View>
                  <View style={assignmentsStyles.techInfoModal}>
                    <Text style={assignmentsStyles.techNameModal}>{item.name}</Text>
                    <Text style={assignmentsStyles.techEmailModal}>{item.email}</Text>
                  </View>
                  <Text style={assignmentsStyles.techArrow}>→</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={assignmentsStyles.cancelButton}
              onPress={() => setModalVisible(false)}
              activeOpacity={0.7}
            >
              <Text style={assignmentsStyles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
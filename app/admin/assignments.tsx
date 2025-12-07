import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Alert, ActivityIndicator } from 'react-native';
import { apiFetch } from '../services/api'; 

export default function AssignmentsScreen() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para el Modal de selección
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Traer todos los tickets (Admin ve todo)
      // Filtramos para que salgan primero los "en_revision" o "pendientes" si prefieres, 
      // pero el backend 'index' ya trae latest().
      const ticketsData = await apiFetch('/tickets');
      
      // 2. Traer solo usuarios con rol 'tecnico' usando el filtro que ya existe en AdminController
      const techsData = await apiFetch('/admin/users?role=tecnico');

      setTickets(ticketsData);
      setTechnicians(techsData);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const openAssignModal = (ticket: any) => {
    setSelectedTicket(ticket);
    setModalVisible(true);
  };

  const handleAssign = async (technicianId: number) => {
    if (!selectedTicket) return;

    try {
      // Llamada al endpoint UPDATE existente en TicketController
      await apiFetch(`/tickets/${selectedTicket.id}`, 'PUT', {
        tecnico_id: technicianId,
        // Opcional: Si reasignas, quizás quieras asegurar que el estado sea 'en_revision'
        estado_usuario: 'en_revision', 
        estado_interno: 'en_proceso'
      });

      Alert.alert('Éxito', 'Ticket reasignado correctamente');
      setModalVisible(false);
      fetchData(); // Recargar la lista
    } catch (error) {
      Alert.alert('Error', 'No se pudo reasignar el ticket');
    }
  };

  const renderTicketItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.ticketId}>#{item.id}</Text>
        <Text style={[styles.statusBadge, getStatusStyle(item.estado_usuario)]}>
          {item.estado_usuario.toUpperCase()}
        </Text>
      </View>
      
      <Text style={styles.deviceText}>{item.tipo_dispositivo} - {item.marca}</Text>
      
      <View style={styles.assignRow}>
        <Text style={styles.techLabel}>Técnico actual:</Text>
        <Text style={styles.techName}>
          {item.tecnico ? item.tecnico.name : '🔴 SIN ASIGNAR'}
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.assignButton} 
        onPress={() => openAssignModal(item)}
      >
        <Text style={styles.assignButtonText}>🔄 Reasignar Técnico</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reasignación de Casos</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTicketItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      {/* Modal para seleccionar técnico */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar Nuevo Técnico</Text>
            <Text style={styles.modalSubtitle}>
              Ticket #{selectedTicket?.id} - {selectedTicket?.tipo_dispositivo}
            </Text>

            <FlatList
              data={technicians}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.techOption} 
                  onPress={() => handleAssign(item.id)}
                >
                  <Text style={styles.techOptionText}>👤 {item.name}</Text>
                  <Text style={styles.techOptionEmail}>{item.email}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Estilos auxiliares
const getStatusStyle = (status: string) => {
    switch (status) {
        case 'pendiente': return { backgroundColor: '#FFC107', color: 'black' }; // Amarillo
        case 'en_revision': return { backgroundColor: '#2196F3', color: 'white' }; // Azul
        case 'reparado': return { backgroundColor: '#4CAF50', color: 'white' }; // Verde
        case 'cerrado': return { backgroundColor: '#9E9E9E', color: 'white' }; // Gris
        default: return {};
    }
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  
  card: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  ticketId: { fontWeight: 'bold', fontSize: 16 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 5, fontSize: 12, overflow: 'hidden' },
  deviceText: { fontSize: 16, color: '#333', marginBottom: 10 },
  
  assignRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, backgroundColor: '#f0f9ff', padding: 8, borderRadius: 5 },
  techLabel: { fontWeight: '600', marginRight: 5, color: '#555' },
  techName: { fontWeight: 'bold', color: '#007AFF' },

  assignButton: { backgroundColor: '#6200EE', padding: 10, borderRadius: 5, alignItems: 'center' },
  assignButtonText: { color: 'white', fontWeight: 'bold' },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: 'white', borderRadius: 10, padding: 20, maxHeight: '80%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 5, textAlign: 'center' },
  modalSubtitle: { fontSize: 14, color: '#666', marginBottom: 20, textAlign: 'center' },
  
  techOption: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  techOptionText: { fontSize: 16, fontWeight: '500' },
  techOptionEmail: { fontSize: 12, color: '#888' },

  cancelButton: { marginTop: 20, padding: 10, alignItems: 'center' },
  cancelButtonText: { color: 'red', fontWeight: 'bold' },
});
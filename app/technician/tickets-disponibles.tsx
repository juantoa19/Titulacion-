import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';

type TicketStatus = 'pendiente' | 'en_revision' | 'reparado' | 'cerrado';

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
  prioridad?: 'alta' | 'media' | 'baja';
  tecnicoAsignado?: string;
}

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
    prioridad: 'alta',
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
    prioridad: 'media',
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
      modelo: 'Galaxy S21',
      numeroSerie: 'SN555666777'
    },
    problema: 'La pantalla tiene líneas de colores y no responde al tacto',
    fechaSolicitud: '2024-01-13T09:15:00Z',
    estado: 'reparado',
    prioridad: 'alta',
  }
];

export default function TicketsDisponibles() {
  // usar los mock tickets para reproducir exactamente lo que había antes
  const available = mockTickets.filter(t => !t.tecnicoAsignado);

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
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const TicketCard = ({ ticket }: { ticket: Ticket }) => (
    <TouchableOpacity style={styles.card} onPress={() => router.push('/technician/tickets-asignados' as any)}>
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
        {ticket.prioridad ? <Text style={[styles.priorityText, { color: ticket.prioridad === 'alta' ? '#ef4444' : ticket.prioridad === 'media' ? '#f59e0b' : '#10b981' }]}>{ticket.prioridad.toUpperCase()}</Text> : null}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tickets Disponibles</Text>
      <FlatList
        data={available}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <TicketCard ticket={item} />}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8fafc' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12, color: '#0f172a' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: 'rgba(15,23,42,0.06)', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 3 },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  ticketId: { fontWeight: '700', color: '#0f172a' },
  statusBadge: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  statusText: { fontSize: 12, color: '#64748b', textTransform: 'capitalize' },
  deviceText: { color: '#374151', fontWeight: '600', marginBottom: 6 },
  userText: { color: '#64748b', marginBottom: 6 },
  problemText: { color: '#94a3b8' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, alignItems: 'center' },
  dateText: { color: '#94a3b8', fontSize: 12 },
  priorityText: { fontWeight: '700' },
  empty: { color: '#64748b' },
});

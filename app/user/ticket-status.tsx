import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useAuth } from '../context/_AuthContext';

export default function TicketStatus() {
  const { user, tickets } = useAuth();

  const myTickets = tickets.filter(t => t.userId === (user?.id || ''));

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completado':
      case 'resuelto':
        return '#10b981';
      case 'en progreso':
      case 'en proceso':
        return '#f59e0b';
      case 'pendiente':
        return '#6b7280';
      case 'cancelado':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Tickets</Text>
      {myTickets.length === 0 ? (
        <Text style={styles.empty}>No tienes tickets aún.</Text>
      ) : (
        <FlatList
          data={myTickets}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.ticketId}>#{item.ticketId}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.estado) }]}>
                  <Text style={styles.statusText}>{item.estado}</Text>
                </View>
              </View>
              <Text style={styles.info}>{item.deviceInfo.tipoDispositivo} - {item.deviceInfo.marca} {item.deviceInfo.modelo}</Text>
              <Text style={styles.date}>{new Date(item.fechaSolicitud).toLocaleString()}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#f8fafc' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: '800', 
    marginBottom: 20, 
    color: '#1e293b',
    textAlign: 'center'
  },
  empty: { 
    color: '#64748b', 
    marginTop: 12, 
    textAlign: 'center',
    fontSize: 16
  },
  card: { 
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 12, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6'
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  ticketId: { 
    fontWeight: '700', 
    color: '#0f172a',
    fontSize: 16
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600'
  },
  info: { 
    color: '#334155', 
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '500'
  },
  date: { 
    color: '#64748b', 
    fontSize: 12 
  }
});
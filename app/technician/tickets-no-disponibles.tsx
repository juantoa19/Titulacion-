import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../context/_AuthContext';
import { router } from 'expo-router';

export default function TicketsNoDisponibles() {
  const { tickets } = useAuth();

  // Tickets que ya tienen técnico asignado (no disponibles)
  const notAvailable = tickets.filter(t => !!(t as any).tecnicoAsignado);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tickets No Disponibles</Text>
      {notAvailable.length === 0 ? (
        <Text style={styles.empty}>No hay tickets no disponibles.</Text>
      ) : (
        <FlatList
          data={notAvailable}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => router.push(`/technician/tickets-asignados` as any)}>
              <Text style={styles.ticketId}>{item.ticketId}</Text>
              <Text style={styles.device}>{item.deviceInfo?.marca} {item.deviceInfo?.modelo}</Text>
              <Text style={styles.assigned}>Asignado a: {(item as any).tecnicoAsignado || '—'}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8fafc' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12, color: '#0f172a' },
  empty: { color: '#64748b' },
  card: { backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(0,0,0,0.04)' },
  ticketId: { fontWeight: '700', color: '#0f172a' },
  device: { color: '#334155', marginTop: 6 },
  assigned: { color: '#64748b', marginTop: 6, fontStyle: 'italic' },
});

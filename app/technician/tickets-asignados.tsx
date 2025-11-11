import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../context/_AuthContext';

export default function TicketsAsignados() {
  const { tickets, user } = useAuth();

  // Tickets asignados a este técnico (por nombre)
  const mine = tickets.filter(t => (t as any).tecnicoAsignado === user?.name);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Tickets Asignados</Text>
      {mine.length === 0 ? (
        <Text style={styles.empty}>No tienes tickets asignados.</Text>
      ) : (
        <FlatList
          data={mine}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.ticketId}>{item.ticketId}</Text>
              <Text style={styles.device}>{item.deviceInfo?.marca} {item.deviceInfo?.modelo}</Text>
              <Text style={styles.problem} numberOfLines={2}>{item.problema}</Text>
            </View>
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
  problem: { color: '#64748b', marginTop: 6 },
});

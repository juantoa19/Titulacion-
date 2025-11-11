import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../context/_AuthContext';
import { router } from 'expo-router';

const NotificationsScreen: React.FC = () => {
  const { user, notifications, markNotificationRead, markAllNotificationsRead } = useAuth();

  const myNotifications = notifications.filter(n => n.userId === (user?.id || ''));

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Notificaciones</Text>
        <TouchableOpacity onPress={() => markAllNotificationsRead(user?.id)} style={styles.markAll}>
          <Text style={styles.markAllText}>Marcar todas</Text>
        </TouchableOpacity>
      </View>

      {myNotifications.length === 0 ? (
        <Text style={styles.empty}>No hay notificaciones.</Text>
      ) : (
        <FlatList
          data={myNotifications}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.item, item.read ? styles.read : styles.unread]}
              onPress={() => {
                markNotificationRead(item.id);
                // opcional: navegar al ticket
                if (item.ticketId) router.push(`/user/ticket-status` as any);
              }}
            >
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemMsg}>{item.message}</Text>
              <Text style={styles.itemDate}>{new Date(item.date).toLocaleString()}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8fafc' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '700', color: '#0f172a' },
  markAll: { padding: 8 },
  markAllText: { color: '#0b3d91', fontWeight: '700' },
  empty: { color: '#64748b', marginTop: 18 },
  item: { backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 10 },
  unread: { borderLeftWidth: 4, borderLeftColor: '#0b3d91' },
  read: { opacity: 0.7 },
  itemTitle: { fontWeight: '700', color: '#0f172a' },
  itemMsg: { color: '#334155', marginTop: 6 },
  itemDate: { color: '#94a3b8', marginTop: 8, fontSize: 12 },
});

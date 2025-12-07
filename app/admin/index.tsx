// app/admin/index.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/_AuthContext';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panel de Administrador</Text>
      <Text style={styles.subtitle}>Hola, {user?.name || 'Admin'}</Text>

      <View style={styles.menuContainer}>
        {/* Botón Gestión de Usuarios */}
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => router.push('/admin/users' as any)}
        >
          <Text style={styles.cardTitle}>👥 Gestionar Usuarios</Text>
          <Text style={styles.cardDesc}>Asignar roles de técnico</Text>
        </TouchableOpacity>

        {/* Botón Reportes */}
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => router.push('/admin/reports' as any)}
        >
          <Text style={styles.cardTitle}>📊 Reportes y PDF</Text>
          <Text style={styles.cardDesc}>Estadísticas y descargas</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 30 },
  menuContainer: { gap: 15 },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    elevation: 2, // Sombra en Android
    shadowColor: '#000', // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#007AFF', marginBottom: 5 },
  cardDesc: { color: '#666' },
  logoutButton: { marginTop: 40, alignSelf: 'center', padding: 10 },
  logoutText: { color: 'red', fontSize: 16, fontWeight: '600' },
});
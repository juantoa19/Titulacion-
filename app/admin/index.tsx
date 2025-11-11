import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useAuth } from '../context/_AuthContext';

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panel de Administración</Text>
      <Text>Bienvenido: {user?.name}</Text>
      <Text>Email: {user?.email}</Text>
      <Text>Rol: {user?.role}</Text>
      
      <Button title="Cerrar Sesión" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
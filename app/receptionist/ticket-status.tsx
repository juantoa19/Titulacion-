import React, { useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { useAuth, Ticket } from '../context/_AuthContext'; // 1. Importar el tipo Ticket
import { useFocusEffect } from 'expo-router';

export default function TicketStatus() {
  // 2. Obtener el estado real del contexto
  const { tickets, isLoading, fetchUserTickets } = useAuth();
  const [refreshing, setRefreshing] = React.useState(false);

  // 3. Usar useFocusEffect para cargar datos cuando la pantalla se enfoca
  useFocusEffect(
    useCallback(() => {
      // No necesitamos 'isLoading' aquí, fetchUserTickets maneja su propio estado
      // si quisiéramos mostrar un spinner en la pantalla completa.
      // Pero para la lista, 'tickets' es suficiente.
      
      // Ya que isLoading es para la app, usamos un 'refresh' local
      onRefresh(); 
    }, [])
  );

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchUserTickets();
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchUserTickets]);


  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'reparado':
        return '#10b981';
      case 'en_revision': // API usa 'en_revision'
        return '#f59e0b';
      case 'pendiente':
        return '#6b7280';
      case 'cerrado':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  // 4. Componente para un solo ticket
  const renderTicketItem = ({ item }: { item: Ticket }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        {/* Usamos el ID real del ticket */}
        <Text style={styles.ticketId}>Ticket #{item.id}</Text>
        <View style={[
          styles.statusBadge, 
          { backgroundColor: getStatusColor(item.estado_usuario) } // Usar estado_usuario
        ]}>
          {/* Formatear el texto (reemplazar guión bajo) */}
          <Text style={styles.statusText}>
            {item.estado_usuario.replace('_', ' ')}
          </Text>
        </View>
      </View>
      {/* Usar los campos correctos de la API */}
      <Text style={styles.info}>
        {item.tipo_dispositivo} - {item.marca} {item.modelo}
      </Text>
      <Text style={styles.date}>
        Solicitado: {new Date(item.created_at).toLocaleString('es-ES')}
      </Text>
    </View>
  );

  // 5. Mostrar indicador de carga si isLoading es true
  if (isLoading && tickets.length === 0) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.empty}>Cargando tus tickets...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Tickets</Text>
      {tickets.length === 0 ? (
        <Text style={styles.empty}>No has generado ningún ticket aún.</Text>
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={item => item.id.toString()} // key debe ser string
          renderItem={renderTicketItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingHorizontal: 10, // Más padding
    paddingVertical: 5,  // Más padding
    borderRadius: 12, // Más redondeado
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize', // Poner en mayúscula la primera
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
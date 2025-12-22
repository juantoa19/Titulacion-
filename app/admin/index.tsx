import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/_AuthContext';
import { apiFetch } from '../services/api';
import adminStyles from './styles/admin.styles';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Estados para las estadísticas
  const [stats, setStats] = useState({
    totalTickets: 0,
    activeTechnicians: 0,
    urgentTickets: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchAdminStats();
    }, [])
  );

  const fetchAdminStats = async () => {
    try {
      // Inicializamos contadores en 0
      let total = 0;
      let urgentes = 0;
      let tecnicos = 0;

      // 1. Cargar Tickets (Si falla, solo los tickets mostrarán 0)
      try {
        const ticketsData = await apiFetch('/tickets');
        if (Array.isArray(ticketsData)) {
          total = ticketsData.length;
          urgentes = ticketsData.filter((t: any) => t.prioridad === 'alta').length;
        }
      } catch (ticketError) {
        console.error('Error al cargar tickets en admin:', ticketError);
      }

      // 2. Cargar Usuarios (Probable causa del error original)
      try {
        const usersData = await apiFetch('/admin/users');
        if (Array.isArray(usersData)) {
          tecnicos = usersData.filter((u: any) => 
            u.roles && u.roles.some((r: any) => r.name === 'tecnico')
          ).length;
        }
      } catch (userError) {
        console.warn('Error al cargar usuarios. Verifica que la ruta GET /admin/users exista en tu backend Laravel.');
        // No lanzamos error para permitir que se muestren los datos de los tickets
      }

      // Actualizamos el estado con lo que hayamos logrado obtener
      setStats({
        totalTickets: total,
        activeTechnicians: tecnicos,
        urgentTickets: urgentes
      });

    } catch (error) {
      console.error('Error general en estadísticas:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAdminStats();
  };

  return (
    <ScrollView 
      style={adminStyles.container}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          tintColor="#10518b"
        />
      }
    >
      {/* Header con gradiente */}
      <View style={adminStyles.header}>
        <View style={adminStyles.headerBackground} />
        <View style={adminStyles.headerContent}>
          <View style={adminStyles.welcomeContainer}>
            <View style={adminStyles.userAvatar}>
              <Text style={adminStyles.userAvatarText}>
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </Text>
            </View>
            <Text style={adminStyles.title}>Panel de Administrador</Text>
            <Text style={adminStyles.subtitle}>Hola, {user?.name || 'Admin'} 👋</Text>
            <View style={adminStyles.adminBadge}>
              <Text style={adminStyles.adminBadgeText}>Administrador</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={adminStyles.menuContainer}>
        {/* 1. Gestión de Usuarios */}
        <TouchableOpacity 
          style={[adminStyles.card, adminStyles.cardUsers]} 
          onPress={() => router.push('/admin/users' as any)}
          activeOpacity={0.8}
        >
          <View style={adminStyles.cardIconContainer}>
            <Text style={adminStyles.cardIcon}>👥</Text>
          </View>
          <View style={adminStyles.cardContent}>
            <Text style={adminStyles.cardTitle}>Gestión de Usuarios</Text>
            <Text style={adminStyles.cardDesc}>Crear cuentas y asignar roles</Text>
          </View>
          <Text style={adminStyles.cardArrow}>→</Text>
        </TouchableOpacity>

        {/* 2. Reasignación de Tickets */}
        <TouchableOpacity 
          style={[adminStyles.card, adminStyles.cardAssignments]} 
          onPress={() => router.push('/admin/assignments' as any)}
          activeOpacity={0.8}
        >
          <View style={adminStyles.cardIconContainer}>
            <Text style={adminStyles.cardIcon}>🔄</Text>
          </View>
          <View style={adminStyles.cardContent}>
            <Text style={adminStyles.cardTitle}>Reasignar Tickets</Text>
            <Text style={adminStyles.cardDesc}>Mover casos entre técnicos</Text>
          </View>
          <Text style={adminStyles.cardArrow}>→</Text>
        </TouchableOpacity>

        {/* 3. Reportes */}
        <TouchableOpacity 
          style={[adminStyles.card, adminStyles.cardReports]} 
          onPress={() => router.push('/admin/reports' as any)}
          activeOpacity={0.8}
        >
          <View style={adminStyles.cardIconContainer}>
            <Text style={adminStyles.cardIcon}>📊</Text>
          </View>
          <View style={adminStyles.cardContent}>
            <Text style={adminStyles.cardTitle}>Reportes y PDF</Text>
            <Text style={adminStyles.cardDesc}>Estadísticas y descargas</Text>
          </View>
          <Text style={adminStyles.cardArrow}>→</Text>
        </TouchableOpacity>

        {/* 4. Estadísticas Rápidas (DATOS REALES) */}
        <View style={adminStyles.statsContainer}>
          <View style={adminStyles.statItem}>
            <Text style={adminStyles.statNumber}>
              {loading ? '-' : stats.totalTickets}
            </Text>
            <Text style={adminStyles.statLabel}>Tickets totales</Text>
          </View>
          <View style={adminStyles.statDivider} />
          <View style={adminStyles.statItem}>
            <Text style={adminStyles.statNumber}>
              {loading ? '-' : stats.activeTechnicians}
            </Text>
            <Text style={adminStyles.statLabel}>Técnicos</Text>
          </View>
          <View style={adminStyles.statDivider} />
          <View style={adminStyles.statItem}>
            <Text style={[adminStyles.statNumber, { color: stats.urgentTickets > 0 ? '#ef4444' : '#10518b' }]}>
              {loading ? '-' : stats.urgentTickets}
            </Text>
            <Text style={adminStyles.statLabel}>Urgentes</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity 
        style={adminStyles.logoutButton} 
        onPress={logout}
        activeOpacity={0.7}
      >
        <Text style={adminStyles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
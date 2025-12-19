// app/admin/index.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/_AuthContext';
import adminStyles from './styles/admin.styles';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <ScrollView style={adminStyles.container}>
      {/* Header con gradiente */}
      <View style={adminStyles.header}>
        <Text style={adminStyles.title}>Panel de Administrador</Text>
        <Text style={adminStyles.subtitle}>Hola, {user?.name || 'Admin'} 👋</Text>
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

        {/* 4. Estadísticas Rápidas (Nueva funcionalidad visual) */}
        <View style={adminStyles.statsContainer}>
          <View style={adminStyles.statItem}>
            <Text style={adminStyles.statNumber}>42</Text>
            <Text style={adminStyles.statLabel}>Tickets activos</Text>
          </View>
          <View style={adminStyles.statDivider} />
          <View style={adminStyles.statItem}>
            <Text style={adminStyles.statNumber}>18</Text>
            <Text style={adminStyles.statLabel}>Técnicos</Text>
          </View>
          <View style={adminStyles.statDivider} />
          <View style={adminStyles.statItem}>
            <Text style={adminStyles.statNumber}>7</Text>
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
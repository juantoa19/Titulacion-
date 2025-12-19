import React from 'react';
// 1. Importar ScrollView
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'; 
import { useAuth } from '../context/_AuthContext';
import { router } from 'expo-router';
// 2. Importar Ionicons
import { Ionicons } from '@expo/vector-icons'; 

export default function UserDashboard() {
  // 3. Obtener la función 'logout' del contexto
  const { user, logout } = useAuth();

  // 4. Usar ScrollView para que el botón de logout no se corte en pantallas pequeñas
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        {/* Elementos decorativos de fondo */}
        <View style={styles.decorativeCircle1}></View>
        <View style={styles.decorativeCircle2}></View>
        <View style={styles.decorativeCircle3}></View>
        
        
        <View style={styles.avatarContainer}>
          <View style={styles.avatarBackground}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>
        
        <Text style={styles.welcomeTitle}>¡Bienvenido de vuelta!</Text>
        <Text style={styles.welcomeName}>{user?.name}</Text>
        {user?.email ? <Text style={styles.welcomeEmail}>{user.email}</Text> : null}
        
        <View style={styles.roleBadge}>
          {/* Asegurarse de que el rol se muestre correctamente */}
          <Text style={styles.welcomeRole}>{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Usuario'}</Text>
        </View>

        {/* Elemento decorativo inferior */}
        <View style={styles.headerDecoration}></View>
      </View>

      <View style={styles.buttonsRow}>
        <TouchableOpacity 
          style={[styles.card, styles.cardCreate]} 
          onPress={() => router.push('/receptionist/create-ticket' as any)}
        >
          <View style={styles.cardBackground}></View>
          <View style={styles.cardContent}>
            <View style={[styles.cardIcon, styles.iconCreate]}>
              <Text style={styles.iconText}>+</Text>
            </View>
            <Text style={styles.cardTitle}>Crear Ticket</Text>
            <Text style={styles.cardSubtitle}>Reporta un nuevo problema</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.card, styles.cardStatus]} 
          onPress={() => router.push('/receptionist/ticket-status' as any)}
        >
          <View style={styles.cardBackground}></View>
          <View style={styles.cardContent}>
            <View style={[styles.cardIcon, styles.iconStatus]}>
              <Text style={styles.iconText}>📊</Text>
            </View>
            <Text style={styles.cardTitle}>Estado de los Tickets</Text>
            <Text style={styles.cardSubtitle}>Ver el estado de los tickets</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* 5. NUEVO BOTÓN DE LOGOUT */}
      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={logout} // Llama a la función logout del context
      >
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // 7. Estilo de container actualizado
  container: { 
    flex: 1, 
    backgroundColor: '#f8fafc', 
  },
  // 6. Nuevo estilo para el contenido del ScrollView
  scrollContent: {
    padding: 20,
    flexGrow: 1, // Asegura que el contenido se expanda
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 30,
    borderRadius: 28,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 15,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    overflow: 'hidden',
    position: 'relative',
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    top: -40,
    left: -40,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    top: 20,
    right: -20,
  },
  decorativeCircle3: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    bottom: -20,
    left: '30%',
  },
  headerDecoration: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #10b981)',
  },
  notifButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  notifIcon: { 
    fontSize: 22,
    color: '#64748b'
  },
  badge: {
    position: 'absolute',
    right: -2,
    top: -2,
    backgroundColor: '#ef4444',
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeText: { 
    color: '#fff', 
    fontSize: 10, 
    fontWeight: '800' 
  },
  avatarContainer: {
    marginBottom: 20,
    marginTop: 10,
  },
  avatarBackground: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#ffffff',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  welcomeTitle: { 
    color: '#64748b', 
    fontSize: 16, 
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.8,
  },
  welcomeName: { 
    color: '#1e293b', 
    fontSize: 28, 
    fontWeight: '800', 
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  welcomeEmail: {
    color: '#64748b',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  roleBadge: {
    backgroundColor: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  welcomeRole: { 
    color: '#ffffff', 
    fontSize: 14, 
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  buttonsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    gap: 18,
  },
  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    minHeight: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    overflow: 'hidden',
    position: 'relative',
  },
  cardCreate: {
    borderTopWidth: 4,
    borderTopColor: '#3b82f6',
  },
  cardStatus: {
    borderTopWidth: 4,
    borderTopColor: '#8b5cf6',
  },
  cardBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#f8fafc',
  },
  cardContent: {
    padding: 24,
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
  },
  cardIcon: {
    width: 70,
    height: 70,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  iconCreate: {
    backgroundColor: '#ffffffff'
  },
  iconStatus: {
    backgroundColor: '#ffffffff',
  },
  iconText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  cardTitle: { 
    fontSize: 18, 
    fontWeight: '800', 
    color: '#1e293b', 
    marginBottom: 8,
    textAlign: 'center',
  },
  cardSubtitle: { 
    fontSize: 14, 
    color: '#64748b', 
    textAlign: 'center',
    lineHeight: 20,
  },
  // 6. NUEVOS ESTILOS PARA EL BOTÓN DE LOGOUT
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444', // Un color rojo para "salir"
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginTop: 'auto', // Esto empuja el botón al final
    marginBottom: 20,
    gap: 10,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  }
});
import React, { useEffect, useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  TextInput,
  RefreshControl 
} from 'react-native';
import { StyleSheet } from 'react-native';
import { apiFetch } from '../services/api';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import usersStyles from './styles/users.styles';
import BackButton from '../../components/BackButton';


interface Role {
  name: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  roles: Role[];
}

type FilterRole = 'all' | 'admin' | 'tecnico' | 'recepcionista';

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Estados para filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<FilterRole>('tecnico');

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/admin/users');
      setUsers(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadUsers();
  };

  // --- Lógica de Filtrado (Memorizada para rendimiento) ---
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // 1. Filtro de Texto (Nombre o Email)
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        user.name.toLowerCase().includes(query) || 
        user.email.toLowerCase().includes(query);

      // 2. Filtro de Rol
      if (selectedRole === 'all') return matchesSearch;
      
      const hasRole = user.roles.some(r => r.name === selectedRole);
      
      // Caso especial: Si filtramos por 'usuario', queremos los que NO son admin ni tecnico
      // O si tu sistema asigna explícitamente el rol 'usuario', usa la línea de arriba.
      // Asumiremos que tienen el rol explícito basado en tu seeder.
      return matchesSearch && hasRole;
    });
  }, [users, searchQuery, selectedRole]);

  // Cambiar Rol
  const changeRole = async (userId: number, roleName: string, actionDescription: string) => {
    Alert.alert(
      'Cambiar Rol',
      `¿Estás seguro de que deseas ${actionDescription}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              // Llamada a la API que ya tienes configurada
              await apiFetch(`/admin/users/${userId}/role`, 'PUT', { role: roleName });
              Alert.alert('Éxito', 'Rol actualizado correctamente');
              loadUsers(); 
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Error al actualizar rol');
            }
          },
        },
      ]
    );
  };

  const deleteUser = async (userId: number) => {
    Alert.alert(
      'Eliminar Usuario',
      '¿Estás seguro de que deseas eliminar este usuario permanentemente? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiFetch(`/admin/users/${userId}`, 'DELETE');
              Alert.alert('Eliminado', 'El usuario ha sido eliminado.');
              loadUsers(); // Recargar lista
            } catch (error: any) {
              Alert.alert('Error', error.message || 'No se pudo eliminar');
            }
          },
        },
      ]
    );
  };

  // Renderizado de cada tarjeta
  const renderItem = ({ item }: { item: User }) => {
    const isTech = item.roles.some(r => r.name === 'tecnico');
    const isAdmin = item.roles.some(r => r.name === 'admin');
    
    // Configuración visual según rol
    let roleColor = '#64748b'; // Usuario (Gris)
    let roleIcon = 'account';
    
    if (isAdmin) {
      roleColor = '#eab308'; // Admin (Dorado)
      roleIcon = 'shield-crown';
    } else if (isTech) {
      roleColor = '#3b82f6'; // Técnico (Azul)
      roleIcon = 'wrench';
    }

    return (
      <View style={[usersStyles.card, { borderLeftColor: roleColor, borderLeftWidth: 4 }]}>
        <View style={usersStyles.cardContent}>
          <View style={usersStyles.userInfo}>
            <View style={usersStyles.headerRow}>
              <Text style={usersStyles.userName}>{item.name}</Text>
              {isAdmin && <MaterialCommunityIcons name="crown" size={16} color="#eab308" />}
            </View>
            <Text style={usersStyles.userEmail}>{item.email}</Text>
            
            <View style={[usersStyles.roleBadge, { backgroundColor: roleColor + '20' }]}>
              <MaterialCommunityIcons name={roleIcon as any} size={12} color={roleColor} />
              <Text style={[usersStyles.roleText, { color: roleColor }]}>
                {item.roles.map(r => r.name).join(', ') || 'recepcionista'}
              </Text>
            </View>
          </View>

          {/* --- BOTONES DE ACCIÓN --- */}
          <View style={{ flexDirection: 'row', gap: 8 }}>
            
            {/* 1. Botón para ADMINISTRADORES: Bajar a Técnico */}
            {isAdmin && (
               <TouchableOpacity 
                 style={[usersStyles.actionButton, { backgroundColor: '#10518b' }]}
                 onPress={() => changeRole(item.id, 'tecnico', 'degradar a TÉCNICO')}
               >
                 <MaterialCommunityIcons name="arrow-down-bold" size={20} color="white" />
               </TouchableOpacity>
            )}

            {/* 2. Botón para NO ADMINS: Subir a Admin */}
            {!isAdmin && (
              <TouchableOpacity 
                style={[usersStyles.actionButton, { backgroundColor: '#ffdf2b' }]}
                onPress={() => changeRole(item.id, 'admin', 'ascender a ADMINISTRADOR')}
              >
                <MaterialCommunityIcons name="crown" size={20} color="white" />
              </TouchableOpacity>
            )}

            {/* 3. Botón TÉCNICO/USUARIO (Switch) */}
            {!isAdmin && (
              <TouchableOpacity 
                style={[usersStyles.actionButton, isTech ? usersStyles.btnRevoke : usersStyles.btnPromote]}
                onPress={() => {
                   // Si es técnico -> baja a recepcionista. Si es recepcionista -> sube a técnico.
                   const newRole = isTech ? 'recepcionista' : 'tecnico';
                   const text = isTech ? 'quitar rol de técnico' : 'hacer TÉCNICO';
                   changeRole(item.id, newRole, text);
                }}
              >
                <MaterialCommunityIcons 
                  name={isTech ? "account" : "wrench"} 
                  size={20} 
                  color="white" 
                />
              </TouchableOpacity>
            )}

            {/* 4. BOTÓN ELIMINAR (NUEVO) - Rojo siempre */}
            <TouchableOpacity 
              style={[usersStyles.actionButton, { backgroundColor: '#ef4444' }]}
              onPress={() => deleteUser(item.id)}
            >
              <MaterialCommunityIcons name="trash-can" size={20} color="white" />
            </TouchableOpacity>

          </View>
        </View>
      </View>
    );
  };

  const FilterChip = ({ role, label }: { role: FilterRole, label: string }) => (
    <TouchableOpacity 
      style={[
        usersStyles.chip, 
        selectedRole === role && usersStyles.chipActive
      ]}
      onPress={() => setSelectedRole(role)}
    >
      <Text style={[
        usersStyles.chipText, 
        selectedRole === role && usersStyles.chipTextActive
      ]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={usersStyles.container}>
       <BackButton />
      {/* --- Header con Buscador y Filtros --- */}
      <View style={usersStyles.headerContainer}>
         <View style={usersStyles.headerBackground} />
    <View style={usersStyles.headerContent}>
      <Text style={usersStyles.screenTitle}>Gestión de Usuarios</Text>
      <Text style={usersStyles.screenSubtitle}>Administra los usuarios del sistema</Text>
      <View style={usersStyles.adminBadge}>
        <Text style={usersStyles.adminBadgeText}>Panel de Administrador</Text>
      </View>
    </View>
        
        {/* Buscador */}
        <View style={usersStyles.searchBar}>
          <Ionicons name="search" size={20} color="#94a3b8" />
          <TextInput 
            style={usersStyles.searchInput}
            placeholder="Buscar por nombre o correo..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filtros de Rol */}
        <View style={usersStyles.filtersRow}>
          <FilterChip role="tecnico" label="Técnicos" />
          <FilterChip role="recepcionista" label="Recepcionistas" />
          <FilterChip role="admin" label="Admins" />
          <FilterChip role="all" label="Todos" />
        </View>
      </View>

      {/* --- Lista de Usuarios --- */}
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={usersStyles.emptyState}>
              <MaterialCommunityIcons name="account-search" size={48} color="#cbd5e1" />
              <Text style={usersStyles.emptyText}>No se encontraron usuarios</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

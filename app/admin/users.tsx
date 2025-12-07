import React, { useEffect, useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  TextInput,
  RefreshControl 
} from 'react-native';
import { apiFetch } from '../services/api';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface Role {
  name: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  roles: Role[];
}

type FilterRole = 'all' | 'admin' | 'tecnico' | 'usuario';

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
  const makeTechnician = async (userId: number, currentRole: string) => {
    const newRole = currentRole === 'tecnico' ? 'usuario' : 'tecnico';
    const actionText = newRole === 'tecnico' ? 'hacer TÉCNICO' : 'quitar rol técnico';

    Alert.alert(
      'Cambiar Rol',
      `¿Seguro que deseas ${actionText} a este usuario?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              // Nota: Usamos PATCH o PUT según tu backend
              await apiFetch(`/admin/users/${userId}/role`, 'PUT', { role: newRole });
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

  // Renderizado de cada tarjeta
  const renderItem = ({ item }: { item: User }) => {
    const isTech = item.roles.some(r => r.name === 'tecnico');
    const isAdmin = item.roles.some(r => r.name === 'admin');
    
    // Color de borde/icono según rol
    const roleColor = isAdmin ? '#f5dd05ff' : isTech ? '#3b82f6' : '#64748b';
    const roleIcon = isAdmin ? 'shield-account' : isTech ? 'wrench' : 'account';

    return (
      <View style={[styles.card, { borderLeftColor: roleColor, borderLeftWidth: 4 }]}>
        <View style={styles.cardContent}>
          <View style={styles.userInfo}>
            <View style={styles.headerRow}>
              <Text style={styles.userName}>{item.name}</Text>
              {isAdmin && <MaterialCommunityIcons name="crown" size={16} color="#fbbf24" />}
            </View>
            <Text style={styles.userEmail}>{item.email}</Text>
            
            <View style={[styles.roleBadge, { backgroundColor: roleColor + '20' }]}>
              <MaterialCommunityIcons name={roleIcon} size={12} color={roleColor} />
              <Text style={[styles.roleText, { color: roleColor }]}>
                {item.roles.map(r => r.name).join(', ') || 'usuario'}
              </Text>
            </View>
          </View>

          {!isAdmin && (
            <TouchableOpacity 
              style={[styles.actionButton, isTech ? styles.btnRevoke : styles.btnPromote]}
              onPress={() => makeTechnician(item.id, isTech ? 'tecnico' : 'usuario')}
            >
              <MaterialCommunityIcons 
                name={isTech ? "account-arrow-left" : "account-wrench"} 
                size={20} 
                color="white" 
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const FilterChip = ({ role, label }: { role: FilterRole, label: string }) => (
    <TouchableOpacity 
      style={[
        styles.chip, 
        selectedRole === role && styles.chipActive
      ]}
      onPress={() => setSelectedRole(role)}
    >
      <Text style={[
        styles.chipText, 
        selectedRole === role && styles.chipTextActive
      ]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* --- Header con Buscador y Filtros --- */}
      <View style={styles.headerContainer}>
        <Text style={styles.screenTitle}>Gestión de Usuarios</Text>
        
        {/* Buscador */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#94a3b8" />
          <TextInput 
            style={styles.searchInput}
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
        <View style={styles.filtersRow}>
          <FilterChip role="tecnico" label="Técnicos" />
          <FilterChip role="usuario" label="Usuarios" />
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
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="account-search" size={48} color="#cbd5e1" />
              <Text style={styles.emptyText}>No se encontraron usuarios</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  
  headerContainer: {
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 45,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#334155',
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  chipActive: {
    backgroundColor: '#1e293b',
    borderColor: '#1e293b',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  chipTextActive: {
    color: '#ffffff',
  },

  // Estilos de Tarjeta
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  userEmail: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  
  // Botones de acción
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  btnPromote: {
    backgroundColor: '#3b82f6', // Azul para promover
  },
  btnRevoke: {
    backgroundColor: '#ef4444', // Rojo para quitar
  },
  btnText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
    gap: 10,
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 16,
  }
});
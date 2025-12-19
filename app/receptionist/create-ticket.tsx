import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth, TicketFormData } from '../context/_AuthContext';
import { searchClientByCedula } from '../services/api'; // Importamos la nueva función
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function CreateTicketReceptionist() {
  const { createTicket } = useAuth();
  
  // --- Estados del Cliente ---
  const [cedula, setCedula] = useState('');
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [celular, setCelular] = useState('');
  
  // Estado para controlar si bloqueamos el nombre (si el cliente ya existe)
  const [isNameLocked, setIsNameLocked] = useState(false);
  const [searchingClient, setSearchingClient] = useState(false);

  // --- Estados del Dispositivo ---
  const [tipo, setTipo] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [numeroSerie, setNumeroSerie] = useState('');
  const [descripcion, setDescripcion] = useState('');
  
  const [loading, setLoading] = useState(false);

  // --- LÓGICA DE BÚSQUEDA DE CLIENTE ---
  const handleSearchClient = async () => {
    if (cedula.length < 10) {
      Alert.alert('Aviso', 'Ingresa una cédula válida para buscar.');
      return;
    }
    setSearchingClient(true);
    try {
      const cliente = await searchClientByCedula(cedula);
      
      // ¡ÉXITO! Cliente encontrado
      setNombre(cliente.nombre);
      setDireccion(cliente.direccion || ''); // Si viene null, ponemos string vacío
      setCelular(cliente.celular || '');
      
      // Bloqueamos el nombre para que no lo editen por error
      setIsNameLocked(true);
      
      // Opcional: Feedback visual
      // Alert.alert('Cliente Encontrado', `Datos cargados de ${cliente.nombre}`);

    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        // 404: Cliente no existe
        Alert.alert('Nuevo Cliente', 'La cédula no está registrada. Por favor ingresa los datos.');
        setNombre('');
        setDireccion('');
        setCelular('');
        setIsNameLocked(false); // Desbloqueamos para escribir
      } else {
        Alert.alert('Error', 'Hubo un problema al buscar el cliente.');
      }
    } finally {
      setSearchingClient(false);
    }
  };

  const onSubmit = async () => {
    // Validamos campos obligatorios (Cliente + Dispositivo)
    if (!cedula || !nombre || !tipo || !marca || !modelo || !descripcion) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios (*).');
      return;
    }
    setLoading(true);
    
    // Construimos el objeto con la estructura NUEVA
    const formData: TicketFormData = {
      // Cliente
      cliente_cedula: cedula,
      cliente_nombre: nombre,
      cliente_direccion: direccion,
      cliente_celular: celular,
      
      // Dispositivo
      tipo_dispositivo: tipo,
      marca: marca,
      modelo: modelo,
      numero_serie: numeroSerie || null,
      descripcion_problema: descripcion
    };

    try {
      await createTicket(formData);
      Alert.alert('Éxito', 'Ticket creado correctamente.');
      router.replace('/receptionist/ticket-status'); // Redirigir a la lista de tickets

    } catch (error: any) {
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstErrorMessage = Object.values(errors)[0] as string[];
        Alert.alert('Error de Validación', firstErrorMessage[0]);
      } else {
        Alert.alert('Error', 'No se pudo crear el ticket. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recepción de Equipo</Text>
        <Text style={styles.subtitle}>Datos del Cliente y Dispositivo</Text>
      </View>

      <View style={styles.form}>
        
        {/* --- SECCIÓN 1: DATOS DEL CLIENTE --- */}
        <Text style={styles.sectionTitle}>1. Datos del Cliente</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cédula / DNI <Text style={styles.required}>*</Text></Text>
          <View style={styles.searchRow}>
            <TextInput 
              style={[styles.input, styles.searchInput]} 
              value={cedula} 
              onChangeText={(text) => {
                setCedula(text);
                // Si cambia la cédula, reseteamos el bloqueo por seguridad
                if(isNameLocked) setIsNameLocked(false); 
              }} 
              placeholder="1720..." 
              keyboardType="numeric"
              placeholderTextColor="#94a3b8"
            />
            <TouchableOpacity 
              style={styles.searchButton} 
              onPress={handleSearchClient}
              disabled={searchingClient}
            >
              {searchingClient ? (
                 <ActivityIndicator color="#fff" size="small" />
              ) : (
                 <Ionicons name="search" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre Completo <Text style={styles.required}>*</Text></Text>
          <TextInput 
            style={[styles.input, isNameLocked && styles.inputLocked]} 
            value={nombre} 
            onChangeText={setNombre} 
            placeholder="Nombre del cliente" 
            placeholderTextColor="#94a3b8"
            editable={!isNameLocked} // Aquí ocurre la magia del bloqueo
          />
          {isNameLocked && <Text style={styles.helperText}>🔒 Nombre cargado del sistema</Text>}
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfInput]}>
            <Text style={styles.label}>Celular</Text>
            <TextInput 
              style={styles.input} 
              value={celular} 
              onChangeText={setCelular} 
              placeholder="099..." 
              keyboardType="phone-pad"
              placeholderTextColor="#94a3b8"
            />
          </View>
          <View style={[styles.inputGroup, styles.halfInput]}>
            <Text style={styles.label}>Dirección</Text>
            <TextInput 
              style={styles.input} 
              value={direccion} 
              onChangeText={setDireccion} 
              placeholder="Av..." 
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View style={styles.divider} />

        {/* --- SECCIÓN 2: DATOS DEL DISPOSITIVO --- */}
        <Text style={styles.sectionTitle}>2. Datos del Equipo</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tipo de dispositivo <Text style={styles.required}>*</Text></Text>
          <TextInput 
            style={styles.input} 
            value={tipo} 
            onChangeText={setTipo} 
            placeholder="Ej. Celular, Laptop" 
            placeholderTextColor="#94a3b8"
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfInput]}>
            <Text style={styles.label}>Marca <Text style={styles.required}>*</Text></Text>
            <TextInput 
              style={styles.input} 
              value={marca} 
              onChangeText={setMarca} 
              placeholder="Ej. Samsung" 
              placeholderTextColor="#94a3b8"
            />
          </View>
          <View style={[styles.inputGroup, styles.halfInput]}>
            <Text style={styles.label}>Modelo <Text style={styles.required}>*</Text></Text>
            <TextInput 
              style={styles.input} 
              value={modelo} 
              onChangeText={setModelo} 
              placeholder="Ej. S21" 
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Número de serie</Text>
          <TextInput 
            style={styles.input} 
            value={numeroSerie} 
            onChangeText={setNumeroSerie} 
            placeholder="SN..." 
            placeholderTextColor="#94a3b8"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Problema reportado <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={descripcion}
            onChangeText={setDescripcion}
            placeholder="Describe el fallo..."
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.button, styles.cancel]} 
            onPress={() => router.back()}
            disabled={loading}
          >
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button, 
                styles.primary,
                (loading || !cedula || !nombre || !descripcion) && styles.disabledButton
              ]}
              onPress={onSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Text style={styles.primaryText}>Crear Ticket</Text>
                  <Ionicons name="save-outline" size={18} color="#fff" />
                </>
              )}
            </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    backgroundColor: '#f1f5f9', 
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 10,
    alignItems: 'center'
  },
  title: { fontSize: 22, fontWeight: '800', color: '#1e293b' },
  subtitle: { fontSize: 14, color: '#64748b' },
  
  form: { padding: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3b82f6',
    marginBottom: 15,
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 20,
  },
  
  inputGroup: { marginBottom: 15 },
  row: { flexDirection: 'row', gap: 10 },
  halfInput: { flex: 1 },
  label: { fontSize: 14, color: '#475569', marginBottom: 6, fontWeight: '600' },
  required: { color: '#ef4444' },
  
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    color: '#0f172a',
  },
  // Estilo para cuando el input está bloqueado
  inputLocked: {
    backgroundColor: '#e2e8f0', // Grisáceo
    color: '#64748b',
  },
  helperText: {
    fontSize: 12,
    color: '#059669', // Verde
    marginTop: 4,
    fontStyle: 'italic',
  },
  
  // Estilos de la barra de búsqueda
  searchRow: { flexDirection: 'row', gap: 10 },
  searchInput: { flex: 1 },
  searchButton: {
    backgroundColor: '#3b82f6',
    width: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  textarea: { minHeight: 100 },
  
  actions: { flexDirection: 'row', gap: 15, marginTop: 20 },
  button: { 
    flex: 1, padding: 16, borderRadius: 10, 
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 
  },
  cancel: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#cbd5e1' },
  primary: { backgroundColor: '#0f172a' },
  disabledButton: { opacity: 0.6 },
  
  cancelText: { fontWeight: '600', color: '#64748b' },
  primaryText: { fontWeight: '600', color: '#fff' },
});
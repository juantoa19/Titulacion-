import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth, TicketFormData } from '../context/_AuthContext';
import { searchClientByCedula } from '../services/api'; // Importamos la nueva función
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import createTicketStyles from './styles/create-ticket.styles';

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
  const [prioridad, setPrioridad] = useState<'baja' | 'media' | 'alta'>('baja');
  
  const [loading, setLoading] = useState(false);

  // Errores de validación (solo datos del cliente)
  const [cedulaError, setCedulaError] = useState<string | null>(null);
  const [nombreError, setNombreError] = useState<string | null>(null);

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

  // Valida únicamente los campos del cliente
  const validateClient = () => {
    let ok = true;
    setCedulaError(null);
    setNombreError(null);

    // Cédula: obligatoria y numérica (mín. 10 dígitos)
    if (!cedula || cedula.trim().length === 0) {
      setCedulaError('La cédula es obligatoria');
      ok = false;
    } else if (!/^\d+$/.test(cedula) || cedula.trim().length < 10) {
      setCedulaError('Ingresa una cédula válida (mín. 10 dígitos)');
      ok = false;
    }

    // Nombre: obligatorio
    if (!nombre || nombre.trim().length === 0) {
      setNombreError('El nombre es obligatorio');
      ok = false;
    }

    return ok;
  };

  const onSubmit = async () => {
    // Validamos SOLO los campos del cliente
    if (!validateClient()) {
      Alert.alert('Error', 'Por favor corrige los errores en los datos del cliente.');
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

      // Dispositivo (opcionales)
      tipo_dispositivo: tipo,
      marca: marca,
      modelo: modelo,
      numero_serie: numeroSerie || null,
      descripcion_problema: descripcion,
      prioridad: prioridad
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
    <ScrollView contentContainerStyle={createTicketStyles.container}>
      <View style={createTicketStyles.header}>
        <Text style={createTicketStyles.title}>Recepción de Equipo</Text>
        <Text style={createTicketStyles.subtitle}>Datos del Cliente y Dispositivo</Text>
      </View>

      <View style={createTicketStyles.form}>
        
        {/* --- SECCIÓN 1: DATOS DEL CLIENTE --- */}
        <Text style={createTicketStyles.sectionTitle}>1. Datos del Cliente</Text>
        
        <View style={createTicketStyles.inputGroup}>
          <Text style={createTicketStyles.label}>Cédula / DNI <Text style={createTicketStyles.required}>*</Text></Text>
          <View style={createTicketStyles.searchRow}>
            <TextInput 
              style={[createTicketStyles.input, createTicketStyles.searchInput, cedulaError && createTicketStyles.inputErrorBorder]} 
              value={cedula} 
              onChangeText={(text) => {
                setCedula(text);
                // Si cambia la cédula, reseteamos el bloqueo por seguridad
                if(isNameLocked) setIsNameLocked(false); 
                if (cedulaError) setCedulaError(null);
              }} 
              placeholder="1720..." 
              keyboardType="numeric"
              placeholderTextColor="#94a3b8"
            />
            {cedulaError ? <Text style={createTicketStyles.errorText}>{cedulaError}</Text> : null}
            <TouchableOpacity 
              style={createTicketStyles.searchButton} 
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

        <View style={createTicketStyles.inputGroup}>
          <Text style={createTicketStyles.label}>Nombre Completo <Text style={createTicketStyles.required}>*</Text></Text>
          <TextInput 
            style={[createTicketStyles.input, isNameLocked && createTicketStyles.inputLocked, nombreError && createTicketStyles.inputErrorBorder]} 
            value={nombre} 
            onChangeText={(text) => { setNombre(text); if (nombreError) setNombreError(null); }} 
            placeholder="Nombre del cliente" 
            placeholderTextColor="#94a3b8"
            editable={!isNameLocked} // Aquí ocurre la magia del bloqueo
          />
          {isNameLocked && <Text style={createTicketStyles.helperText}>🔒 Nombre cargado del sistema</Text>}
          {nombreError ? <Text style={createTicketStyles.errorText}>{nombreError}</Text> : null}
        </View>

        <View style={createTicketStyles.row}>
          <View style={[createTicketStyles.inputGroup, createTicketStyles.halfInput]}>
            <Text style={createTicketStyles.label}>Celular</Text>
            <TextInput 
              style={createTicketStyles.input} 
              value={celular} 
              onChangeText={setCelular} 
              placeholder="099..." 
              keyboardType="phone-pad"
              placeholderTextColor="#94a3b8"
            />
          </View>
          <View style={[createTicketStyles.inputGroup, createTicketStyles.halfInput]}>
            <Text style={createTicketStyles.label}>Dirección</Text>
            <TextInput 
              style={createTicketStyles.input} 
              value={direccion} 
              onChangeText={setDireccion} 
              placeholder="Av..." 
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View style={createTicketStyles.divider} />

        {/* --- SECCIÓN 2: DATOS DEL DISPOSITIVO --- */}
        <Text style={createTicketStyles.sectionTitle}>2. Datos del Equipo</Text>

        <View style={createTicketStyles.inputGroup}>
          <Text style={createTicketStyles.label}>Tipo de dispositivo <Text style={createTicketStyles.required}>*</Text></Text>
          <TextInput 
            style={createTicketStyles.input} 
            value={tipo} 
            onChangeText={setTipo} 
            placeholder="Ej. Celular, Laptop" 
            placeholderTextColor="#94a3b8"
          />
        </View>

        <View style={createTicketStyles.row}>
          <View style={[createTicketStyles.inputGroup, createTicketStyles.halfInput]}>
            <Text style={createTicketStyles.label}>Marca <Text style={createTicketStyles.required}>*</Text></Text>
            <TextInput 
              style={createTicketStyles.input} 
              value={marca} 
              onChangeText={setMarca} 
              placeholder="Ej. Samsung" 
              placeholderTextColor="#94a3b8"
            />
          </View>
          <View style={[createTicketStyles.inputGroup, createTicketStyles.halfInput]}>
            <Text style={createTicketStyles.label}>Modelo <Text style={createTicketStyles.required}>*</Text></Text>
            <TextInput 
              style={createTicketStyles.input} 
              value={modelo} 
              onChangeText={setModelo} 
              placeholder="Ej. S21" 
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View style={createTicketStyles.inputGroup}>
          <Text style={createTicketStyles.label}>Número de serie</Text>
          <TextInput 
            style={createTicketStyles.input} 
            value={numeroSerie} 
            onChangeText={setNumeroSerie} 
            placeholder="SN..." 
            placeholderTextColor="#94a3b8"
          />
        </View>

        <View style={createTicketStyles.inputGroup}>
          <Text style={createTicketStyles.label}>Problema reportado <Text style={createTicketStyles.required}>*</Text></Text>
          <TextInput
            style={[createTicketStyles.input, createTicketStyles.textarea]}
            value={descripcion}
            onChangeText={setDescripcion}
            placeholder="Describe el fallo..."
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={createTicketStyles.inputGroup}>
          <Text style={createTicketStyles.priorityLabel}>Prioridad de la reparación</Text>
          <View style={createTicketStyles.priorityContainer}>
            {(['baja', 'media', 'alta'] as const).map((p) => (
              <TouchableOpacity
                key={p}
                style={[
                  createTicketStyles.priorityButton,
                  prioridad === p && createTicketStyles.priorityButtonActive
                ]}
                onPress={() => setPrioridad(p)}
                activeOpacity={0.7}
              >
                <Text style={[
                  createTicketStyles.priorityText,
                  prioridad === p && createTicketStyles.priorityTextActive
                ]}>
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={createTicketStyles.actions}>
          <TouchableOpacity 
            style={[createTicketStyles.button, createTicketStyles.cancel]} 
            onPress={() => router.back()}
            disabled={loading}
          >
            <Text style={createTicketStyles.cancelText}>Cancelar</Text>
          </TouchableOpacity>

            <TouchableOpacity
              style={[
                createTicketStyles.button, 
                createTicketStyles.primary,
                (loading || !cedula || !nombre) && createTicketStyles.disabledButton
              ]}
              onPress={onSubmit}
              disabled={loading || !cedula || !nombre}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Text style={createTicketStyles.primaryText}>Crear Ticket</Text>
                  <Ionicons name="save-outline" size={18} color="#fff" />
                </>
              )}
            </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

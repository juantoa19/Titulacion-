import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth, TicketFormData } from '../context/_AuthContext'; // 1. Importar el tipo
import { router } from 'expo-router';

export default function CreateTicket() {
  const { createTicket } = useAuth(); // 2. Obtener la función real
  const [tipo, setTipo] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [numeroSerie, setNumeroSerie] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!tipo || !marca || !modelo || !descripcion) { // 3. Descripción es obligatoria
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios.');
      return;
    }
    setLoading(true);
    
    // 4. Construir el objeto EXACTO que la API espera
    const formData: TicketFormData = {
      tipo_dispositivo: tipo,
      marca: marca,
      modelo: modelo,
      numero_serie: numeroSerie || null,
      descripcion_problema: descripcion
    };

    try {
      // 5. Llamar a la función del contexto
      await createTicket(formData);
      
      Alert.alert('Éxito', 'Tu ticket ha sido creado.');
      // Al crear, navegar a la lista de estado
      router.replace('/user/ticket-status'); // Usar replace para no poder volver

    } catch (error: any) {
      // 6. Manejar errores de validación del backend
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors;
        // Tomar el primer error y mostrarlo
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
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>📝</Text>
        </View>
        <Text style={styles.title}>Crear Nuevo Ticket</Text>
        <Text style={styles.subtitle}>Completa la información del dispositivo</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Tipo de dispositivo <Text style={styles.required}>*</Text>
          </Text>
          <TextInput 
            style={styles.input} 
            value={tipo} 
            onChangeText={setTipo} 
            placeholder="Ej. Celular, Laptop, Impresora" 
            placeholderTextColor="#94a3b8"
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfInput]}>
            <Text style={styles.label}>
              Marca <Text style={styles.required}>*</Text>
            </Text>
            <TextInput 
              style={styles.input} 
              value={marca} 
              onChangeText={setMarca} 
              placeholder="Ej. Samsung, HP, Dell" 
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={[styles.inputGroup, styles.halfInput]}>
            <Text style={styles.label}>
              Modelo <Text style={styles.required}>*</Text>
            </Text>
            <TextInput 
              style={styles.input} 
              value={modelo} 
              onChangeText={setModelo} 
              placeholder="Ej. Galaxy S21, Pavilion" 
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Número de serie (Opcional)</Text>
          <TextInput 
            style={styles.input} 
            value={numeroSerie} 
            onChangeText={setNumeroSerie} 
            placeholder="Ej: SN123456789" 
            placeholderTextColor="#94a3b8"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Descripción del problema <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={descripcion}
            onChangeText={setDescripcion}
            placeholder="Describe detalladamente el problema..."
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{descripcion.length}/500</Text>
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
                styles.noShadow, 
                loading && styles.disabled,
                (!tipo || !marca || !modelo || !descripcion) && styles.disabled // 7. Deshabilitar si falta algo
              ]}
              onPress={onSubmit}
              disabled={loading || !tipo || !marca || !modelo || !descripcion}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Text style={styles.primaryText}>Crear Ticket</Text>
                  <Text style={styles.buttonIcon}>🚀</Text>
                </>
              )}
            </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            <Text style={styles.required}>*</Text> Campos obligatorios
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

// ... (tus estilos de 'create-ticket' permanecen idénticos)
const styles = StyleSheet.create({
  container: { 
    backgroundColor: '#f8fafc', 
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Simulación de gradiente
    padding: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 10,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  icon: {
    fontSize: 28,
  },
  title: { 
    fontSize: 26, 
    fontWeight: '800', 
    color: '#000000ff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: { 
    fontSize: 16, 
    color: 'rgba(0, 0, 0, 0.9)',
    textAlign: 'center',
  },
  form: {
    padding: 25,
  },
  inputGroup: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  halfInput: {
    flex: 1,
  },
  label: { 
    fontSize: 15, 
    color: '#334155', 
    marginBottom: 8,
    fontWeight: '600',
  },
  required: {
    color: '#ef4444',
  },
  input: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    fontSize: 16,
    color: '#0f172a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  textarea: { 
    minHeight: 120,
    paddingTop: 16,
  },
  charCount: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'right',
    marginTop: 6,
  },
  actions: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 30,
    gap: 15,
  },
  button: { 
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cancel: { 
    backgroundColor: '#fff', 
    borderWidth: 1.5, 
    borderColor: '#cbd5e1',
  },
  primary: { 
    backgroundColor: '#1e293b',
  },
  noShadow: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  disabled: {
    opacity: 0.6,
  },
  cancelText: { 
    color: '#64748b', 
    fontWeight: '700',
    fontSize: 16,
  },
  primaryText: { 
    color: '#ffffffff', 
    fontWeight: '700',
    fontSize: 16,
  },
  buttonIcon: {
    fontSize: 16,
  },
  footer: {
    marginTop: 25,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
  },
});
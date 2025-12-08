import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { apiFetch, API_URL, TOKEN_KEY } from '../services/api'; 
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ReportsScreen() {
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-12-31');
  
  // Nuevo estado para el filtro
  const [selectedStatus, setSelectedStatus] = useState(''); // '' = Todos

  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Lista de estados disponibles
  const statuses = [
    { label: 'Todos', value: '' },
    { label: 'Pendiente', value: 'pendiente' },
    { label: 'En Revisión', value: 'en_revision' },
    { label: 'Reparado', value: 'reparado' },
    { label: 'Cerrado', value: 'cerrado' },
  ];

  // Obtener Estadísticas (JSON)
  const getStats = async () => {
    setLoading(true);
    try {
      // Agregamos el status a la URL
      const url = `/admin/reports/stats?start_date=${startDate}&end_date=${endDate}&status=${selectedStatus}`;
      const data = await apiFetch(url);
      setStats(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron obtener las estadísticas');
    } finally {
      setLoading(false);
    }
  };

  // Descargar PDF
  const downloadPdf = async () => {
    setDownloading(true);
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      
      // Agregamos el estado al nombre del archivo para diferenciarlo
      const statusSuffix = selectedStatus ? `_${selectedStatus}` : '';
      const fileName = `Reporte_${startDate}_${endDate}${statusSuffix}.pdf`;
      const fileUri = FileSystem.documentDirectory + fileName;
      
      // Agregamos el status a la URL del PDF
      const url = `${API_URL}/api/admin/reports/pdf?start_date=${startDate}&end_date=${endDate}&status=${selectedStatus}`;

      console.log("Descargando:", url);

      const result = await FileSystem.downloadAsync(
        url,
        fileUri,
        {
          headers: {
            Authorization: `Bearer ${token}`, 
            Accept: 'application/pdf',        
          },
        }
      );

      if (result.status === 200) {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(result.uri, {
            mimeType: 'application/pdf',
            dialogTitle: 'Descargar Reporte'
          });
        } else {
          Alert.alert('PDF Descargado', `Guardado en: ${result.uri}`);
        }
      } else {
        throw new Error(`Estado ${result.status}`);
      }

    } catch (error: any) {
      console.error("Error descarga:", error);
      Alert.alert('Error', 'Falló la descarga del PDF.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Reportes de Tickets</Text>

      {/* Filtros */}
      <View style={styles.filterBox}>
        <Text style={styles.label}>Fecha Inicio (YYYY-MM-DD):</Text>
        <TextInput 
          style={styles.input} 
          value={startDate} 
          onChangeText={setStartDate} 
          placeholder="2024-01-01" 
          keyboardType="numeric"
        />
        
        <Text style={styles.label}>Fecha Fin (YYYY-MM-DD):</Text>
        <TextInput 
          style={styles.input} 
          value={endDate} 
          onChangeText={setEndDate} 
          placeholder="2024-12-31" 
          keyboardType="numeric"
        />

        <Text style={styles.label}>Filtrar por Estado:</Text>
        <View style={styles.chipsContainer}>
          {statuses.map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[
                styles.chip,
                selectedStatus === item.value && styles.chipSelected
              ]}
              onPress={() => setSelectedStatus(item.value)}
            >
              <Text style={[
                styles.chipText,
                selectedStatus === item.value && styles.chipTextSelected
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <Button title="Consultar Estadísticas" onPress={getStats} />
      </View>

      {/* Resultados */}
      {loading && <ActivityIndicator style={{ marginTop: 20 }} />}
      
      {stats && (
        <View style={styles.statsContainer}>
          <Text style={styles.statTitle}>Resumen ({selectedStatus || 'Todos'}):</Text>
          <View style={styles.statRow}><Text>Total (Filtrado):</Text><Text style={styles.statValue}>{stats.total}</Text></View>
          {/* Solo mostramos el desglose si NO hay filtro o si coincide con el filtro para no confundir con ceros */}
          {(!selectedStatus || selectedStatus === 'pendiente') && <View style={styles.statRow}><Text>Pendientes:</Text><Text style={styles.statValue}>{stats.pendientes}</Text></View>}
          {(!selectedStatus || selectedStatus === 'en_revision') && <View style={styles.statRow}><Text>En Revisión:</Text><Text style={styles.statValue}>{stats.en_revision}</Text></View>}
          {(!selectedStatus || selectedStatus === 'reparado') && <View style={styles.statRow}><Text>Reparados:</Text><Text style={styles.statValue}>{stats.reparados}</Text></View>}
          {(!selectedStatus || selectedStatus === 'cerrado') && <View style={styles.statRow}><Text>Cerrados:</Text><Text style={styles.statValue}>{stats.cerrados}</Text></View>}
        </View>
      )}

      {/* Botón Descarga */}
      <View style={styles.downloadSection}>
        <TouchableOpacity 
          style={[styles.pdfButton, downloading && styles.pdfButtonDisabled]} 
          onPress={downloadPdf}
          disabled={downloading}
        >
          {downloading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.pdfButtonText}>
               📥 Descargar Reporte PDF {selectedStatus ? `(${selectedStatus})` : ''}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flexGrow: 1, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  filterBox: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 10, marginBottom: 20 },
  label: { marginBottom: 5, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 8, marginBottom: 15, backgroundColor: 'white' },
  
  // Estilos para los Chips de Estado
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15, gap: 8 },
  chip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, backgroundColor: '#e0e0e0', marginBottom: 5, marginRight: 5 },
  chipSelected: { backgroundColor: '#2196F3' },
  chipText: { color: '#333', fontSize: 12 },
  chipTextSelected: { color: 'white', fontWeight: 'bold' },

  statsContainer: { marginBottom: 30 },
  statTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  statValue: { fontWeight: 'bold' },
  downloadSection: { alignItems: 'center' },
  pdfButton: { backgroundColor: '#D32F2F', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 8, width: '100%', alignItems: 'center' },
  pdfButtonDisabled: { backgroundColor: '#E57373' },
  pdfButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});
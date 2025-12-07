import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
// Asegúrate de que la ruta sea correcta según donde moviste api.ts
import { apiFetch, API_URL, TOKEN_KEY } from '../services/api'; 
// CORRECCIÓN: Cambiamos la importación a 'legacy' para evitar el error en Expo SDK 54+
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ReportsScreen() {
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-12-31');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Obtener Estadísticas (JSON)
  const getStats = async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/admin/reports/stats?start_date=${startDate}&end_date=${endDate}`);
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
      
      // Nombre del archivo en el sistema de archivos del celular
      const fileName = `Reporte_${startDate}_${endDate}.pdf`;
      // Nota: documentDirectory también viene de la importación 'legacy'
      const fileUri = FileSystem.documentDirectory + fileName;
      
      // Endpoint completo
      const url = `${API_URL}/api/admin/reports/pdf?start_date=${startDate}&end_date=${endDate}`;

      console.log("Intentando descargar desde:", url);

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

      console.log("Descarga finalizada:", result);

      if (result.status === 200) {
        // Verificar si se puede compartir
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(result.uri, {
            mimeType: 'application/pdf',
            dialogTitle: 'Descargar Reporte de Tickets'
          });
        } else {
          Alert.alert('PDF Descargado', `Guardado en: ${result.uri}`);
        }
      } else {
        throw new Error(`El servidor respondió con estado ${result.status}`);
      }

    } catch (error: any) {
      console.error("Error en descarga:", error);
      Alert.alert('Error', 'Falló la descarga del PDF. Revisa la consola para más detalles.');
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
          keyboardType="numeric" // Ayuda a escribir fechas
        />
        
        <Text style={styles.label}>Fecha Fin (YYYY-MM-DD):</Text>
        <TextInput 
          style={styles.input} 
          value={endDate} 
          onChangeText={setEndDate} 
          placeholder="2024-12-31" 
          keyboardType="numeric"
        />
        
        <Button title="Consultar Estadísticas" onPress={getStats} />
      </View>

      {/* Resultados */}
      {loading && <ActivityIndicator style={{ marginTop: 20 }} />}
      
      {stats && (
        <View style={styles.statsContainer}>
          <Text style={styles.statTitle}>Resumen:</Text>
          <View style={styles.statRow}><Text>Total Tickets:</Text><Text style={styles.statValue}>{stats.total}</Text></View>
          <View style={styles.statRow}><Text>Pendientes:</Text><Text style={styles.statValue}>{stats.pendientes}</Text></View>
          <View style={styles.statRow}><Text>En Revisión:</Text><Text style={styles.statValue}>{stats.en_revision}</Text></View>
          <View style={styles.statRow}><Text>Cerrados:</Text><Text style={styles.statValue}>{stats.cerrados}</Text></View>
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
            <Text style={styles.pdfButtonText}>📥 Descargar Reporte PDF</Text>
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
  statsContainer: { marginBottom: 30 },
  statTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  statValue: { fontWeight: 'bold' },
  downloadSection: { alignItems: 'center' },
  pdfButton: { backgroundColor: '#D32F2F', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 8, width: '100%', alignItems: 'center' },
  pdfButtonDisabled: { backgroundColor: '#E57373' },
  pdfButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});
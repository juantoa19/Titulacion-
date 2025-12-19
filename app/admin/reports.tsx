import React, { useState } from 'react';
import { View, Text, TextInput, Alert, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native';
import { apiFetch, API_URL, TOKEN_KEY } from '../services/api'; 
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import reportsStyles from './styles/reports.styles';

export default function ReportsScreen() {
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-12-31');
  const [selectedStatus, setSelectedStatus] = useState(''); // '' = Todos
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const statuses = [
    { label: 'Todos', value: '', color: '#10518b' },
    { label: 'Pendiente', value: 'pendiente', color: '#f59e0b' },
    { label: 'En Revisión', value: 'en_revision', color: '#5faee3' },
    { label: 'Reparado', value: 'reparado', color: '#10b981' },
    { label: 'Cerrado', value: 'cerrado', color: '#94a3b8' },
  ];

  const getStats = async () => {
    setLoading(true);
    try {
      const url = `/admin/reports/stats?start_date=${startDate}&end_date=${endDate}&status=${selectedStatus}`;
      const data = await apiFetch(url);
      setStats(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron obtener las estadísticas');
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = async () => {
    setDownloading(true);
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      const statusSuffix = selectedStatus ? `_${selectedStatus}` : '';
      const fileName = `Reporte_${startDate}_${endDate}${statusSuffix}.pdf`;
      const fileUri = FileSystem.documentDirectory + fileName;
      
      const url = `${API_URL}/api/admin/reports/pdf?start_date=${startDate}&end_date=${endDate}&status=${selectedStatus}`;

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
          Alert.alert('Éxito', 'PDF descargado correctamente');
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

  const getStatusLabel = (value: string) => {
    const status = statuses.find(s => s.value === value);
    return status ? status.label : 'Todos';
  };

  return (
    <ScrollView contentContainerStyle={reportsStyles.container}>
      {/* Header */}
      <View style={reportsStyles.header}>
        <Text style={reportsStyles.title}>Reportes de Tickets</Text>
        <Text style={reportsStyles.subtitle}>Genera reportes y estadísticas detalladas</Text>
      </View>

      {/* Filtros */}
      <View style={reportsStyles.filterBox}>
        <Text style={reportsStyles.sectionTitle}>Filtros de Búsqueda</Text>
        
        <View style={reportsStyles.dateContainer}>
          <View style={reportsStyles.dateInputContainer}>
            <Text style={reportsStyles.label}>Fecha Inicio</Text>
            <View style={reportsStyles.inputWrapper}>
              <Text style={reportsStyles.inputIcon}>📅</Text>
              <TextInput 
                style={reportsStyles.input} 
                value={startDate} 
                onChangeText={setStartDate} 
                placeholder="2025-01-01" 
                keyboardType="numeric"
              />
            </View>
          </View>
          
          <View style={reportsStyles.dateSeparator}>
            <Text style={reportsStyles.dateSeparatorText}>a</Text>
          </View>
          
          <View style={reportsStyles.dateInputContainer}>
            <Text style={reportsStyles.label}>Fecha Fin</Text>
            <View style={reportsStyles.inputWrapper}>
              <Text style={reportsStyles.inputIcon}>📅</Text>
              <TextInput 
                style={reportsStyles.input} 
                value={endDate} 
                onChangeText={setEndDate} 
                placeholder="2025-12-31" 
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        <Text style={[reportsStyles.label, { marginTop: 20 }]}>Filtrar por Estado</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={reportsStyles.chipsScroll}
          contentContainerStyle={reportsStyles.chipsContainer}
        >
          {statuses.map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[
                reportsStyles.chip,
                selectedStatus === item.value && reportsStyles.chipSelected,
                { borderColor: item.color }
              ]}
              onPress={() => setSelectedStatus(item.value)}
            >
              <View style={[
                reportsStyles.chipDot,
                { backgroundColor: item.color }
              ]} />
              <Text style={[
                reportsStyles.chipText,
                selectedStatus === item.value && reportsStyles.chipTextSelected
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <TouchableOpacity 
          style={reportsStyles.statsButton}
          onPress={getStats}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <>
              <Text style={reportsStyles.statsButtonIcon}>📊</Text>
              <Text style={reportsStyles.statsButtonText}>Consultar Estadísticas</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Resultados */}
      {stats && (
        <View style={reportsStyles.statsContainer}>
          <View style={reportsStyles.statsHeader}>
            <Text style={reportsStyles.statTitle}>
              Resumen {selectedStatus && `- ${getStatusLabel(selectedStatus)}`}
            </Text>
            <View style={reportsStyles.dateBadge}>
              <Text style={reportsStyles.dateBadgeText}>
                {startDate} - {endDate}
              </Text>
            </View>
          </View>
          
          <View style={reportsStyles.statsGrid}>
            <View style={reportsStyles.statCard}>
              <Text style={reportsStyles.statCardLabel}>Total Tickets</Text>
              <Text style={reportsStyles.statCardValue}>{stats.total}</Text>
              <Text style={reportsStyles.statCardSubtext}>Filtrados</Text>
            </View>
            
            {(!selectedStatus || selectedStatus === 'pendiente') && (
              <View style={[reportsStyles.statCard, { borderLeftColor: '#f59e0b' }]}>
                <Text style={reportsStyles.statCardLabel}>Pendientes</Text>
                <Text style={reportsStyles.statCardValue}>{stats.pendientes}</Text>
                <Text style={reportsStyles.statCardSubtext}>Por atender</Text>
              </View>
            )}
            
            {(!selectedStatus || selectedStatus === 'en_revision') && (
              <View style={[reportsStyles.statCard, { borderLeftColor: '#5faee3' }]}>
                <Text style={reportsStyles.statCardLabel}>En Revisión</Text>
                <Text style={reportsStyles.statCardValue}>{stats.en_revision}</Text>
                <Text style={reportsStyles.statCardSubtext}>En proceso</Text>
              </View>
            )}
            
            {(!selectedStatus || selectedStatus === 'reparado') && (
              <View style={[reportsStyles.statCard, { borderLeftColor: '#10b981' }]}>
                <Text style={reportsStyles.statCardLabel}>Reparados</Text>
                <Text style={reportsStyles.statCardValue}>{stats.reparados}</Text>
                <Text style={reportsStyles.statCardSubtext}>Completados</Text>
              </View>
            )}
            
            {(!selectedStatus || selectedStatus === 'cerrado') && (
              <View style={[reportsStyles.statCard, { borderLeftColor: '#94a3b8' }]}>
                <Text style={reportsStyles.statCardLabel}>Cerrados</Text>
                <Text style={reportsStyles.statCardValue}>{stats.cerrados}</Text>
                <Text style={reportsStyles.statCardSubtext}>Finalizados</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Botón Descarga */}
      <View style={reportsStyles.downloadSection}>
        <Text style={reportsStyles.sectionTitle}>Exportar Reporte</Text>
        <Text style={reportsStyles.downloadDescription}>
          Genera un reporte detallado en formato PDF con todos los datos filtrados
        </Text>
        
        <TouchableOpacity 
          style={[reportsStyles.pdfButton, downloading && reportsStyles.pdfButtonDisabled]} 
          onPress={downloadPdf}
          disabled={downloading}
        >
          {downloading ? (
            <View style={reportsStyles.pdfButtonLoading}>
              <ActivityIndicator color="#ffffff" />
              <Text style={reportsStyles.pdfButtonText}>Generando PDF...</Text>
            </View>
          ) : (
            <>
              <Text style={reportsStyles.pdfButtonIcon}>📥</Text>
              <View style={reportsStyles.pdfButtonTextContainer}>
                <Text style={reportsStyles.pdfButtonText}>Descargar Reporte PDF</Text>
                {selectedStatus && (
                  <Text style={reportsStyles.pdfButtonSubtext}>
                    Filtrado por: {getStatusLabel(selectedStatus)}
                  </Text>
                )}
              </View>
              <Text style={reportsStyles.pdfButtonArrow}>→</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
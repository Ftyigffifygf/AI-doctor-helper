import { Text, View, ScrollView, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import Button from '../components/Button';
import Icon from '../components/Icon';
import { commonStyles, colors } from '../styles/commonStyles';
import { StyleSheet } from 'react-native';

interface VitalReading {
  id: string;
  type: 'heart_rate' | 'blood_pressure' | 'spo2' | 'temperature' | 'respiratory_rate';
  value: string;
  unit: string;
  timestamp: Date;
  status: 'normal' | 'warning' | 'critical';
  source: string;
}

export default function VitalsScreen() {
  const [isConnected, setIsConnected] = useState(false);
  const [vitals, setVitals] = useState<VitalReading[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    // Simulate initial vital readings
    const initialVitals: VitalReading[] = [
      {
        id: '1',
        type: 'heart_rate',
        value: '72',
        unit: 'bpm',
        timestamp: new Date(Date.now() - 5 * 60000),
        status: 'normal',
        source: 'Apple Watch'
      },
      {
        id: '2',
        type: 'blood_pressure',
        value: '120/80',
        unit: 'mmHg',
        timestamp: new Date(Date.now() - 10 * 60000),
        status: 'normal',
        source: 'Manual Entry'
      },
      {
        id: '3',
        type: 'spo2',
        value: '98',
        unit: '%',
        timestamp: new Date(Date.now() - 15 * 60000),
        status: 'normal',
        source: 'Pulse Oximeter'
      },
      {
        id: '4',
        type: 'temperature',
        value: '98.6',
        unit: '°F',
        timestamp: new Date(Date.now() - 20 * 60000),
        status: 'normal',
        source: 'Smart Thermometer'
      }
    ];
    setVitals(initialVitals);
  }, []);

  const handleConnectDevice = () => {
    Alert.alert(
      'Connect Wearable Device',
      'In a production app, this would connect to Apple Health, Google Fit, Fitbit, or other wearable devices via their APIs.',
      [
        { text: 'Cancel' },
        { 
          text: 'Simulate Connection', 
          onPress: () => {
            setIsConnected(true);
            console.log('Simulating device connection');
          }
        }
      ]
    );
  };

  const handleStartMonitoring = () => {
    setIsMonitoring(true);
    console.log('Starting continuous monitoring');
    
    // Simulate real-time vital updates
    const interval = setInterval(() => {
      const newReading: VitalReading = {
        id: Date.now().toString(),
        type: 'heart_rate',
        value: (65 + Math.floor(Math.random() * 20)).toString(),
        unit: 'bpm',
        timestamp: new Date(),
        status: Math.random() > 0.9 ? 'warning' : 'normal',
        source: 'Apple Watch'
      };
      
      setVitals(prev => [newReading, ...prev.slice(0, 19)]); // Keep last 20 readings
    }, 10000); // Update every 10 seconds

    // Stop after 2 minutes for demo
    setTimeout(() => {
      clearInterval(interval);
      setIsMonitoring(false);
    }, 120000);
  };

  const getVitalIcon = (type: string) => {
    switch (type) {
      case 'heart_rate': return 'heart-outline';
      case 'blood_pressure': return 'pulse-outline';
      case 'spo2': return 'water-outline';
      case 'temperature': return 'thermometer-outline';
      case 'respiratory_rate': return 'leaf-outline';
      default: return 'fitness-outline';
    }
  };

  const getVitalName = (type: string) => {
    switch (type) {
      case 'heart_rate': return 'Heart Rate';
      case 'blood_pressure': return 'Blood Pressure';
      case 'spo2': return 'SpO2';
      case 'temperature': return 'Temperature';
      case 'respiratory_rate': return 'Respiratory Rate';
      default: return 'Vital Sign';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return '#4CAF50';
      case 'warning': return '#FF9800';
      case 'critical': return '#F44336';
      default: return colors.grey;
    }
  };

  const getCurrentVitals = () => {
    const latest = vitals.reduce((acc, vital) => {
      if (!acc[vital.type] || vital.timestamp > acc[vital.type].timestamp) {
        acc[vital.type] = vital;
      }
      return acc;
    }, {} as Record<string, VitalReading>);
    
    return Object.values(latest);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SafeAreaView style={commonStyles.wrapper}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Button
            text="← Back"
            onPress={() => router.back()}
            style={styles.backButton}
            textStyle={styles.backButtonText}
          />
          <View style={styles.titleContainer}>
            <Icon name="heart-outline" size={30} style={styles.headerIcon} />
            <Text style={styles.title}>Vital Signs Monitor</Text>
          </View>
          <Text style={styles.subtitle}>Real-time health monitoring</Text>
        </View>

        {/* Connection Status */}
        <View style={styles.statusContainer}>
          <View style={styles.statusRow}>
            <Icon 
              name={isConnected ? "checkmark-circle" : "close-circle"} 
              size={24} 
              style={[styles.statusIcon, { color: isConnected ? '#4CAF50' : '#FF6B6B' }]} 
            />
            <Text style={styles.statusText}>
              {isConnected ? 'Devices Connected' : 'No Devices Connected'}
            </Text>
            {!isConnected && (
              <Button
                text="Connect"
                onPress={handleConnectDevice}
                style={styles.connectButton}
                textStyle={styles.connectButtonText}
              />
            )}
          </View>
          
          {isConnected && (
            <View style={styles.monitoringControls}>
              <Button
                text={isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
                onPress={isMonitoring ? () => setIsMonitoring(false) : handleStartMonitoring}
                style={[styles.monitorButton, isMonitoring && styles.stopButton]}
                textStyle={styles.monitorButtonText}
              />
            </View>
          )}
        </View>

        {/* Current Vitals Dashboard */}
        <View style={styles.dashboardContainer}>
          <Text style={styles.sectionTitle}>Current Vitals</Text>
          <View style={styles.vitalsGrid}>
            {getCurrentVitals().map((vital) => (
              <View key={vital.type} style={styles.vitalCard}>
                <View style={styles.vitalHeader}>
                  <Icon 
                    name={getVitalIcon(vital.type) as any} 
                    size={24} 
                    style={[styles.vitalIcon, { color: getStatusColor(vital.status) }]} 
                  />
                  <View style={[styles.statusDot, { backgroundColor: getStatusColor(vital.status) }]} />
                </View>
                <Text style={styles.vitalValue}>{vital.value}</Text>
                <Text style={styles.vitalUnit}>{vital.unit}</Text>
                <Text style={styles.vitalName}>{getVitalName(vital.type)}</Text>
                <Text style={styles.vitalTime}>{formatTime(vital.timestamp)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Alerts */}
        {vitals.some(v => v.status !== 'normal') && (
          <View style={styles.alertsContainer}>
            <Text style={styles.sectionTitle}>Health Alerts</Text>
            {vitals
              .filter(v => v.status !== 'normal')
              .slice(0, 3)
              .map((vital) => (
                <View key={vital.id} style={styles.alertCard}>
                  <Icon 
                    name="warning-outline" 
                    size={20} 
                    style={[styles.alertIcon, { color: getStatusColor(vital.status) }]} 
                  />
                  <View style={styles.alertContent}>
                    <Text style={styles.alertTitle}>
                      {vital.status === 'warning' ? 'Warning' : 'Critical'}: {getVitalName(vital.type)}
                    </Text>
                    <Text style={styles.alertText}>
                      {vital.value} {vital.unit} - {formatTime(vital.timestamp)}
                    </Text>
                  </View>
                </View>
              ))}
          </View>
        )}

        {/* Recent Readings */}
        <View style={styles.historyContainer}>
          <Text style={styles.sectionTitle}>Recent Readings</Text>
          {vitals.slice(0, 10).map((vital) => (
            <View key={vital.id} style={styles.historyItem}>
              <View style={styles.historyLeft}>
                <Icon 
                  name={getVitalIcon(vital.type) as any} 
                  size={20} 
                  style={styles.historyIcon} 
                />
                <View>
                  <Text style={styles.historyName}>{getVitalName(vital.type)}</Text>
                  <Text style={styles.historySource}>{vital.source}</Text>
                </View>
              </View>
              <View style={styles.historyRight}>
                <Text style={styles.historyValue}>{vital.value} {vital.unit}</Text>
                <Text style={styles.historyTime}>{formatTime(vital.timestamp)}</Text>
              </View>
              <View style={[styles.historyStatus, { backgroundColor: getStatusColor(vital.status) }]} />
            </View>
          ))}
        </View>

        {/* Health Insights */}
        <View style={styles.insightsContainer}>
          <Text style={styles.sectionTitle}>AI Health Insights</Text>
          <View style={styles.insightCard}>
            <Icon name="analytics-outline" size={24} style={styles.insightIcon} />
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Heart Rate Variability</Text>
              <Text style={styles.insightText}>
                Your heart rate has been consistently within normal range. 
                Average resting HR: 68 bpm. Consider maintaining current activity level.
              </Text>
            </View>
          </View>
          
          <View style={styles.insightCard}>
            <Icon name="trending-up-outline" size={24} style={styles.insightIcon} />
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Trend Analysis</Text>
              <Text style={styles.insightText}>
                Blood pressure readings show stable pattern over the past week. 
                Continue monitoring and maintain healthy lifestyle habits.
              </Text>
            </View>
          </View>
        </View>

        {/* Export Options */}
        <View style={styles.exportContainer}>
          <Button
            text="Export Health Report"
            onPress={() => Alert.alert('Export', 'Health report would be generated as PDF')}
            style={styles.exportButton}
            textStyle={styles.exportButtonText}
          />
          <Button
            text="Share with Doctor"
            onPress={() => Alert.alert('Share', 'Data would be shared with healthcare provider')}
            style={styles.shareButton}
            textStyle={styles.shareButtonText}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  backButton: {
    backgroundColor: colors.backgroundAlt,
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginBottom: 15,
  },
  backButtonText: {
    fontSize: 14,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerIcon: {
    marginRight: 10,
    color: '#FFB6C1',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.grey,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
  statusContainer: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.grey + '30',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusIcon: {
    marginRight: 10,
  },
  statusText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  connectButton: {
    backgroundColor: '#FFB6C1',
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  connectButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  monitoringControls: {
    alignItems: 'center',
  },
  monitorButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
  },
  stopButton: {
    backgroundColor: '#FF6B6B',
  },
  monitorButtonText: {
    fontWeight: 'bold',
  },
  dashboardContainer: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.grey + '30',
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  vitalCard: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 15,
    width: '48%',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.grey + '30',
    alignItems: 'center',
  },
  vitalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
    justifyContent: 'space-between',
  },
  vitalIcon: {
    color: colors.accent,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  vitalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  vitalUnit: {
    fontSize: 12,
    color: colors.grey,
    marginBottom: 5,
  },
  vitalName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 3,
  },
  vitalTime: {
    fontSize: 10,
    color: colors.grey,
  },
  alertsContainer: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FF9800',
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.grey + '30',
  },
  alertIcon: {
    marginRight: 15,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 3,
  },
  alertText: {
    fontSize: 12,
    color: colors.grey,
  },
  historyContainer: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.grey + '30',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey + '20',
    position: 'relative',
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  historyIcon: {
    color: colors.accent,
    marginRight: 12,
  },
  historyName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  historySource: {
    fontSize: 12,
    color: colors.grey,
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  historyTime: {
    fontSize: 12,
    color: colors.grey,
  },
  historyStatus: {
    position: 'absolute',
    right: 0,
    top: '50%',
    width: 4,
    height: '60%',
    borderRadius: 2,
  },
  insightsContainer: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.grey + '30',
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.grey + '30',
  },
  insightIcon: {
    color: colors.accent,
    marginRight: 15,
    marginTop: 2,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  insightText: {
    fontSize: 12,
    color: colors.grey,
    lineHeight: 16,
  },
  exportContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exportButton: {
    backgroundColor: '#FFB6C1',
    flex: 1,
    marginRight: 10,
  },
  exportButtonText: {
    fontWeight: 'bold',
  },
  shareButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: '#FFB6C1',
    flex: 1,
    marginLeft: 10,
  },
  shareButtonText: {
    color: '#FFB6C1',
  },
});
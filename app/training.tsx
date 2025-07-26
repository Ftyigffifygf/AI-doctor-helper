import { Text, View, ScrollView, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import Icon from '../components/Icon';
import { commonStyles, colors } from '../styles/commonStyles';
import Button from '../components/Button';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { medicalTrainingService, MedicalDataset, TrainingSession } from '../services/medicalTrainingService';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.white,
    textAlign: 'center',
    marginTop: 5,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
    marginTop: 20,
  },
  datasetCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  datasetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  datasetName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  datasetType: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  datasetTypeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  datasetDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 10,
    lineHeight: 20,
  },
  datasetStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  trainingCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  trainingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  trainingModule: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  trainingStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trainingStatusText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.lightGray,
    borderRadius: 4,
    marginVertical: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonSecondary: {
    backgroundColor: colors.secondary,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  enhancementCard: {
    backgroundColor: colors.success,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  enhancementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 5,
  },
  enhancementText: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 15,
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statCardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  statCardLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

interface TrainingScreenState {
  datasets: MedicalDataset[];
  trainingSessions: TrainingSession[];
  isLoading: boolean;
  trainingStats: any;
}

export default function TrainingScreen() {
  const [state, setState] = useState<TrainingScreenState>({
    datasets: [],
    trainingSessions: [],
    isLoading: true,
    trainingStats: null,
  });

  useEffect(() => {
    initializeTrainingData();
  }, []);

  const initializeTrainingData = async () => {
    try {
      console.log('Initializing medical training data...');
      
      // Initialize medical datasets
      await medicalTrainingService.initializeMedicalDatasets();
      
      // Get available datasets
      const datasets = await medicalTrainingService.getAvailableDatasets();
      
      // Generate training stats
      const trainingStats = {
        totalDatasets: datasets.length,
        totalRecords: datasets.reduce((sum, d) => sum + d.record_count, 0),
        totalSizeMB: datasets.reduce((sum, d) => sum + d.size_mb, 0),
        activeModules: 8,
      };

      setState(prev => ({
        ...prev,
        datasets,
        trainingStats,
        isLoading: false,
      }));

      console.log('Training data initialized successfully');
    } catch (error) {
      console.error('Error initializing training data:', error);
      Alert.alert('Error', 'Failed to initialize training data');
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleStartTraining = async (moduleName: string) => {
    try {
      console.log(`Starting training for module: ${moduleName}`);
      
      // Determine dataset type based on module
      const datasetTypeMap: { [key: string]: string } = {
        'Diagnostic Assistant': 'clinical_notes',
        'Medical Scribe': 'clinical_notes',
        'Scan Analyzer': 'imaging',
        'Genomic Predictor': 'genomic',
        'Lab Parser': 'lab_results',
        'Motion Analysis': 'motion_analysis',
        'Vital Monitor': 'vital_signs',
        'Doctor Agent': 'clinical_notes',
      };

      const datasetType = datasetTypeMap[moduleName] || 'clinical_notes';
      
      const session = await medicalTrainingService.startTraining(moduleName, datasetType);
      
      setState(prev => ({
        ...prev,
        trainingSessions: [...prev.trainingSessions, session],
      }));

      Alert.alert(
        'Training Started',
        `Training session initiated for ${moduleName} using ${datasetType} datasets.`
      );
    } catch (error) {
      console.error('Error starting training:', error);
      Alert.alert('Error', 'Failed to start training session');
    }
  };

  const handleViewReport = async (moduleName: string) => {
    try {
      const report = await medicalTrainingService.generateTrainingReport(moduleName);
      
      Alert.alert(
        `${moduleName} Training Report`,
        `Performance: ${report.performance_metrics?.accuracy ? (report.performance_metrics.accuracy * 100).toFixed(1) + '%' : 'N/A'}\n` +
        `Datasets: ${report.training_summary.total_datasets}\n` +
        `Records: ${report.training_summary.total_records.toLocaleString()}\n` +
        `Size: ${(report.training_summary.total_size_mb / 1000).toFixed(1)}GB`
      );
    } catch (error) {
      console.error('Error generating report:', error);
      Alert.alert('Error', 'Failed to generate training report');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return colors.success;
      case 'running': return colors.warning;
      case 'failed': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  if (state.isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Medical AI Training</Text>
          <Text style={styles.headerSubtitle}>Initializing datasets...</Text>
        </View>
        <View style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Icon name="refresh" size={48} style={{ color: colors.primary }} />
          <Text style={{ marginTop: 20, color: colors.textSecondary }}>Loading medical training data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🧠 Medical AI Training</Text>
        <Text style={styles.headerSubtitle}>Enhanced with Open Medical Networks</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Enhancement Status */}
        <View style={styles.enhancementCard}>
          <Text style={styles.enhancementTitle}>🎯 AI Enhancement Active</Text>
          <Text style={styles.enhancementText}>
            All AIME modules are now enhanced with comprehensive medical training data from leading open networks including MIMIC-III, NIH, PhysioNet, TCGA, and ISIC datasets.
          </Text>
        </View>

        {/* Training Statistics */}
        <Text style={styles.sectionTitle}>📊 Training Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statCardValue}>{state.trainingStats?.totalDatasets || 0}</Text>
            <Text style={styles.statCardLabel}>Medical Datasets</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statCardValue}>{formatNumber(state.trainingStats?.totalRecords || 0)}</Text>
            <Text style={styles.statCardLabel}>Training Records</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statCardValue}>{(state.trainingStats?.totalSizeMB / 1000).toFixed(1)}GB</Text>
            <Text style={styles.statCardLabel}>Dataset Size</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statCardValue}>{state.trainingStats?.activeModules || 0}</Text>
            <Text style={styles.statCardLabel}>AI Modules</Text>
          </View>
        </View>

        {/* Available Datasets */}
        <Text style={styles.sectionTitle}>🗄️ Medical Datasets</Text>
        {state.datasets.map((dataset, index) => (
          <View key={index} style={styles.datasetCard}>
            <View style={styles.datasetHeader}>
              <Text style={styles.datasetName}>{dataset.name}</Text>
              <View style={styles.datasetType}>
                <Text style={styles.datasetTypeText}>{dataset.dataset_type.replace('_', ' ').toUpperCase()}</Text>
              </View>
            </View>
            <Text style={styles.datasetDescription}>{dataset.description}</Text>
            <View style={styles.datasetStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{formatNumber(dataset.record_count)}</Text>
                <Text style={styles.statLabel}>Records</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{(dataset.size_mb / 1000).toFixed(1)}GB</Text>
                <Text style={styles.statLabel}>Size</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{dataset.version}</Text>
                <Text style={styles.statLabel}>Version</Text>
              </View>
            </View>
          </View>
        ))}

        {/* Module Training */}
        <Text style={styles.sectionTitle}>🚀 Module Training</Text>
        {[
          'Diagnostic Assistant',
          'Medical Scribe',
          'Scan Analyzer',
          'Genomic Predictor',
          'Lab Parser',
          'Motion Analysis',
          'Vital Monitor',
          'Doctor Agent'
        ].map((module, index) => (
          <View key={index} style={styles.trainingCard}>
            <View style={styles.trainingHeader}>
              <Text style={styles.trainingModule}>{module}</Text>
              <View style={[styles.trainingStatus, { backgroundColor: colors.success }]}>
                <Text style={styles.trainingStatusText}>ENHANCED</Text>
              </View>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '100%' }]} />
            </View>
            <Text style={styles.progressText}>Training completed with medical datasets</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleStartTraining(module)}
              >
                <Text style={styles.actionButtonText}>Retrain</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.actionButtonSecondary]}
                onPress={() => handleViewReport(module)}
              >
                <Text style={styles.actionButtonText}>View Report</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            text="🔄 Refresh Training Data"
            onPress={initializeTrainingData}
            style={{ flex: 1 }}
          />
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
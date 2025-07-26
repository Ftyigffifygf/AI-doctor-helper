import { Text, View, ScrollView, SafeAreaView, Alert, Image } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import Icon from '../components/Icon';
import { commonStyles, colors } from '../styles/commonStyles';
import Button from '../components/Button';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { openaiService } from '../services/openaiService';

interface LabResult {
  test: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'high' | 'low' | 'critical';
  category: string;
}

export default function LabScreen() {
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  const handleDocumentPicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'text/csv', 'text/plain'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedFile(result.assets[0]);
        setLabResults([]);
        setAnalysisResults(null);
        console.log('Document selected:', result.assets[0].name);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to select document');
    }
  };

  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedFile({ uri: result.assets[0].uri, name: 'lab_report_image.jpg', type: 'image' });
        setLabResults([]);
        setAnalysisResults(null);
        console.log('Image selected:', result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const handleProcessReport = async () => {
    if (!selectedFile) {
      Alert.alert('Error', 'Please select a file first');
      return;
    }

    setIsProcessing(true);
    console.log('Processing lab report with OpenAI');

    try {
      // Simulate lab data extraction - in real implementation, you'd use OCR + OpenAI
      const mockLabData = `Complete Blood Count (CBC):
      White Blood Cell Count: 8.5 x10³/μL (Normal: 4.0-11.0)
      Red Blood Cell Count: 4.2 x10⁶/μL (Normal: 4.2-5.4)
      Hemoglobin: 13.8 g/dL (Normal: 12.0-15.5)
      Hematocrit: 41.2% (Normal: 36.0-46.0)
      Platelet Count: 285 x10³/μL (Normal: 150-450)
      
      Basic Metabolic Panel:
      Glucose: 95 mg/dL (Normal: 70-100)
      Sodium: 140 mEq/L (Normal: 136-145)
      Potassium: 4.1 mEq/L (Normal: 3.5-5.1)
      Chloride: 102 mEq/L (Normal: 98-107)
      BUN: 18 mg/dL (Normal: 7-20)
      Creatinine: 1.0 mg/dL (Normal: 0.6-1.2)`;

      const results = await openaiService.analyzeLabResults(mockLabData);
      
      if (results.results && results.results.length > 0) {
        setLabResults(results.results);
      }
      setAnalysisResults(results);
      console.log('Lab analysis completed successfully');
    } catch (error) {
      console.error('Processing error:', error);
      Alert.alert(
        'Processing Error',
        error instanceof Error ? error.message : 'Failed to process lab report. Please try again.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'critical': return '#F44336';
      case 'high': return '#FF9800';
      case 'low': return '#2196F3';
      case 'normal': return '#4CAF50';
      default: return colors.grey;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'critical': return 'warning';
      case 'high': return 'arrow-up-circle';
      case 'low': return 'arrow-down-circle';
      case 'normal': return 'checkmark-circle';
      default: return 'help-circle';
    }
  };

  const groupResultsByCategory = () => {
    const grouped: { [key: string]: LabResult[] } = {};
    labResults.forEach(result => {
      if (!grouped[result.category]) {
        grouped[result.category] = [];
      }
      grouped[result.category].push(result);
    });
    return grouped;
  };

  const handleClear = () => {
    setSelectedFile(null);
    setLabResults([]);
    setAnalysisResults(null);
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
            <Icon name="document-text-outline" size={30} style={styles.headerIcon} />
            <Text style={styles.title}>AI Lab Parser</Text>
          </View>
          <Text style={styles.subtitle}>Powered by OpenAI GPT-4</Text>
        </View>

        {/* File Upload */}
        <View style={styles.uploadContainer}>
          <Text style={styles.sectionTitle}>Upload Lab Report</Text>
          
          {selectedFile ? (
            <View style={styles.filePreview}>
              <Icon name="document" size={40} style={styles.fileIcon} />
              <Text style={styles.fileName}>{selectedFile.name}</Text>
              <View style={styles.fileActions}>
                <Button
                  text="Change File"
                  onPress={handleDocumentPicker}
                  style={styles.changeButton}
                  textStyle={styles.changeButtonText}
                />
                <Button
                  text={isProcessing ? 'Processing...' : 'Process Report'}
                  onPress={handleProcessReport}
                  style={[styles.processButton, isProcessing && styles.disabledButton]}
                  textStyle={styles.processButtonText}
                />
              </View>
            </View>
          ) : (
            <View style={styles.uploadArea}>
              <Icon name="cloud-upload-outline" size={50} style={styles.uploadIcon} />
              <Text style={styles.uploadText}>Select a lab report to analyze</Text>
              <Text style={styles.uploadSubtext}>Supports PDF, CSV, images, and text files</Text>
              <View style={styles.uploadButtons}>
                <Button
                  text="Choose Document"
                  onPress={handleDocumentPicker}
                  style={styles.uploadButton}
                  textStyle={styles.uploadButtonText}
                />
                <Button
                  text="Take Photo"
                  onPress={handleImagePicker}
                  style={styles.uploadButton}
                  textStyle={styles.uploadButtonText}
                />
              </View>
            </View>
          )}
        </View>

        {/* Analysis Summary */}
        {analysisResults && (
          <View style={styles.summaryContainer}>
            <Text style={styles.sectionTitle}>AI Analysis Summary</Text>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryText}>{analysisResults.summary}</Text>
              
              {analysisResults.abnormalFindings && analysisResults.abnormalFindings.length > 0 && (
                <View style={styles.abnormalContainer}>
                  <Text style={styles.abnormalTitle}>Abnormal Findings:</Text>
                  {analysisResults.abnormalFindings.map((finding: string, index: number) => (
                    <Text key={index} style={styles.abnormalText}>• {finding}</Text>
                  ))}
                </View>
              )}

              {analysisResults.recommendations && analysisResults.recommendations.length > 0 && (
                <View style={styles.recommendationsContainer}>
                  <Text style={styles.recommendationsTitle}>Recommendations:</Text>
                  {analysisResults.recommendations.map((rec: string, index: number) => (
                    <Text key={index} style={styles.recommendationText}>• {rec}</Text>
                  ))}
                </View>
              )}

              <View style={styles.urgencyContainer}>
                <Text style={styles.urgencyLabel}>Urgency Level:</Text>
                <Text style={[
                  styles.urgencyValue,
                  { color: analysisResults.urgency === 'High' ? '#F44336' : 
                           analysisResults.urgency === 'Medium' ? '#FF9800' : '#4CAF50' }
                ]}>
                  {analysisResults.urgency}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Lab Results */}
        {labResults.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.sectionTitle}>Extracted Lab Results</Text>
            
            {Object.entries(groupResultsByCategory()).map(([category, results]) => (
              <View key={category} style={styles.categoryContainer}>
                <Text style={styles.categoryTitle}>{category}</Text>
                {results.map((result, index) => (
                  <View key={index} style={styles.resultCard}>
                    <View style={styles.resultHeader}>
                      <Text style={styles.testName}>{result.test}</Text>
                      <View style={styles.statusContainer}>
                        <Icon 
                          name={getStatusIcon(result.status) as any} 
                          size={16} 
                          style={[styles.statusIcon, { color: getStatusColor(result.status) }]} 
                        />
                        <Text style={[styles.statusText, { color: getStatusColor(result.status) }]}>
                          {result.status.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.resultDetails}>
                      <Text style={styles.resultValue}>
                        {result.value} {result.unit}
                      </Text>
                      <Text style={styles.referenceRange}>
                        Reference: {result.referenceRange}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ))}

            <Button
              text="Clear Results"
              onPress={handleClear}
              style={styles.clearButton}
              textStyle={styles.clearButtonText}
            />
          </View>
        )}
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
    color: '#FFEAA7',
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
  uploadContainer: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.grey + '30',
  },
  uploadArea: {
    alignItems: 'center',
    paddingVertical: 40,
    borderWidth: 2,
    borderColor: colors.grey + '30',
    borderStyle: 'dashed',
    borderRadius: 10,
  },
  uploadIcon: {
    color: colors.grey,
    marginBottom: 15,
  },
  uploadText: {
    fontSize: 16,
    color: colors.grey,
    marginBottom: 5,
    textAlign: 'center',
  },
  uploadSubtext: {
    fontSize: 12,
    color: colors.grey,
    marginBottom: 20,
    textAlign: 'center',
  },
  uploadButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  uploadButton: {
    backgroundColor: '#FFEAA7',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  filePreview: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  fileIcon: {
    color: '#FFEAA7',
    marginBottom: 10,
  },
  fileName: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  fileActions: {
    flexDirection: 'row',
    gap: 10,
  },
  changeButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: '#FFEAA7',
    paddingHorizontal: 20,
  },
  changeButtonText: {
    color: '#FFEAA7',
  },
  processButton: {
    backgroundColor: '#FFEAA7',
    paddingHorizontal: 20,
  },
  processButtonText: {
    fontWeight: 'bold',
    color: '#333',
  },
  disabledButton: {
    opacity: 0.6,
  },
  summaryContainer: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.grey + '30',
  },
  summaryCard: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.grey + '30',
  },
  summaryText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 18,
    marginBottom: 15,
  },
  abnormalContainer: {
    marginBottom: 15,
  },
  abnormalTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F44336',
    marginBottom: 5,
  },
  abnormalText: {
    fontSize: 13,
    color: colors.grey,
    marginLeft: 10,
  },
  recommendationsContainer: {
    marginBottom: 15,
  },
  recommendationsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  recommendationText: {
    fontSize: 13,
    color: colors.grey,
    marginLeft: 10,
  },
  urgencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  urgencyLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginRight: 10,
  },
  urgencyValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  resultsContainer: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.grey + '30',
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  resultCard: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.grey + '30',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  testName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    marginRight: 5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  resultDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  referenceRange: {
    fontSize: 12,
    color: colors.grey,
  },
  clearButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.grey + '50',
    marginTop: 10,
  },
  clearButtonText: {
    color: colors.grey,
  },
});
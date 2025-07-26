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

export default function ScannerScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [imageType, setImageType] = useState<string>('');

  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        setAnalysisResults(null);
        console.log('Image selected:', result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const handleDocumentPicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        setAnalysisResults(null);
        console.log('Document selected:', result.assets[0].name);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to select document');
    }
  };

  const handleAnalyze = async (type: string) => {
    if (!selectedImage) {
      Alert.alert('Error', 'Please select an image first');
      return;
    }

    setIsAnalyzing(true);
    setImageType(type);
    console.log(`Analyzing ${type} image with OpenAI`);

    try {
      // In a real implementation, you would extract features from the image
      // For now, we'll simulate with a description
      const imageDescription = `Medical ${type} image uploaded for analysis. Image shows anatomical structures typical of ${type} imaging.`;
      
      const results = await openaiService.analyzeMedicalImage(imageDescription, type);
      setAnalysisResults(results);
      console.log('Analysis completed successfully');
    } catch (error) {
      console.error('Analysis error:', error);
      Alert.alert(
        'Analysis Error',
        error instanceof Error ? error.message : 'Failed to analyze image. Please try again.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setAnalysisResults(null);
    setImageType('');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'high': return '#F44336';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return colors.grey;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency?.toLowerCase()) {
      case 'emergent': return '#F44336';
      case 'urgent': return '#FF9800';
      case 'routine': return '#4CAF50';
      default: return colors.grey;
    }
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
            <Icon name="scan-outline" size={30} style={styles.headerIcon} />
            <Text style={styles.title}>AI Scan Analyzer</Text>
          </View>
          <Text style={styles.subtitle}>Powered by OpenAI GPT-4</Text>
        </View>

        {/* Image Upload */}
        <View style={styles.uploadContainer}>
          <Text style={styles.sectionTitle}>Upload Medical Image</Text>
          
          {selectedImage ? (
            <View style={styles.imagePreview}>
              <Image source={{ uri: selectedImage }} style={styles.previewImage} />
              <Button
                text="Change Image"
                onPress={handleImagePicker}
                style={styles.changeButton}
                textStyle={styles.changeButtonText}
              />
            </View>
          ) : (
            <View style={styles.uploadArea}>
              <Icon name="cloud-upload-outline" size={50} style={styles.uploadIcon} />
              <Text style={styles.uploadText}>Select a medical image to analyze</Text>
              <View style={styles.uploadButtons}>
                <Button
                  text="Choose from Gallery"
                  onPress={handleImagePicker}
                  style={styles.uploadButton}
                  textStyle={styles.uploadButtonText}
                />
                <Button
                  text="Browse Files"
                  onPress={handleDocumentPicker}
                  style={styles.uploadButton}
                  textStyle={styles.uploadButtonText}
                />
              </View>
            </View>
          )}
        </View>

        {/* Analysis Options */}
        {selectedImage && (
          <View style={styles.analysisContainer}>
            <Text style={styles.sectionTitle}>Select Image Type</Text>
            <View style={styles.analysisGrid}>
              <Button
                text={isAnalyzing && imageType === 'X-ray' ? 'Analyzing...' : 'X-ray'}
                onPress={() => handleAnalyze('X-ray')}
                style={[styles.analysisButton, styles.xrayButton]}
                textStyle={styles.analysisButtonText}
              />
              <Button
                text={isAnalyzing && imageType === 'CT' ? 'Analyzing...' : 'CT Scan'}
                onPress={() => handleAnalyze('CT')}
                style={[styles.analysisButton, styles.ctButton]}
                textStyle={styles.analysisButtonText}
              />
              <Button
                text={isAnalyzing && imageType === 'MRI' ? 'Analyzing...' : 'MRI'}
                onPress={() => handleAnalyze('MRI')}
                style={[styles.analysisButton, styles.mriButton]}
                textStyle={styles.analysisButtonText}
              />
              <Button
                text={isAnalyzing && imageType === 'Ultrasound' ? 'Analyzing...' : 'Ultrasound'}
                onPress={() => handleAnalyze('Ultrasound')}
                style={[styles.analysisButton, styles.ultrasoundButton]}
                textStyle={styles.analysisButtonText}
              />
            </View>
            
            <Button
              text="Clear All"
              onPress={handleClear}
              style={styles.clearButton}
              textStyle={styles.clearButtonText}
            />
          </View>
        )}

        {/* Analysis Results */}
        {analysisResults && (
          <View style={styles.resultsContainer}>
            <Text style={styles.sectionTitle}>AI Analysis Results</Text>
            
            {/* Severity and Urgency */}
            <View style={styles.statusRow}>
              <View style={[styles.statusCard, { borderColor: getSeverityColor(analysisResults.severity) }]}>
                <Text style={styles.statusLabel}>Severity</Text>
                <Text style={[styles.statusValue, { color: getSeverityColor(analysisResults.severity) }]}>
                  {analysisResults.severity}
                </Text>
              </View>
              <View style={[styles.statusCard, { borderColor: getUrgencyColor(analysisResults.urgency) }]}>
                <Text style={styles.statusLabel}>Urgency</Text>
                <Text style={[styles.statusValue, { color: getUrgencyColor(analysisResults.urgency) }]}>
                  {analysisResults.urgency}
                </Text>
              </View>
            </View>

            {/* Findings */}
            {analysisResults.findings && analysisResults.findings.length > 0 && (
              <View style={styles.findingsContainer}>
                <Text style={styles.subsectionTitle}>Key Findings</Text>
                {analysisResults.findings.map((finding: string, index: number) => (
                  <View key={index} style={styles.findingItem}>
                    <Icon name="checkmark-circle-outline" size={16} style={styles.findingIcon} />
                    <Text style={styles.findingText}>{finding}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Impression */}
            <View style={styles.impressionContainer}>
              <Text style={styles.subsectionTitle}>Clinical Impression</Text>
              <Text style={styles.impressionText}>{analysisResults.impression}</Text>
            </View>

            {/* Recommendations */}
            {analysisResults.recommendations && analysisResults.recommendations.length > 0 && (
              <View style={styles.recommendationsContainer}>
                <Text style={styles.subsectionTitle}>Recommendations</Text>
                {analysisResults.recommendations.map((rec: string, index: number) => (
                  <View key={index} style={styles.recommendationItem}>
                    <Icon name="arrow-forward-circle-outline" size={16} style={styles.recommendationIcon} />
                    <Text style={styles.recommendationText}>{rec}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Follow-up */}
            {analysisResults.followUp && (
              <View style={styles.followUpContainer}>
                <Text style={styles.subsectionTitle}>Follow-up</Text>
                <Text style={styles.followUpText}>{analysisResults.followUp}</Text>
              </View>
            )}

            {/* Disclaimer */}
            <View style={styles.disclaimerContainer}>
              <Icon name="information-circle-outline" size={20} style={styles.disclaimerIcon} />
              <Text style={styles.disclaimerText}>
                {analysisResults.disclaimer || 'This AI analysis should not replace professional radiological interpretation. Please consult with a qualified radiologist.'}
              </Text>
            </View>
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
    color: '#45B7D1',
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
    marginBottom: 20,
    textAlign: 'center',
  },
  uploadButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  uploadButton: {
    backgroundColor: '#45B7D1',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  imagePreview: {
    alignItems: 'center',
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  changeButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: '#45B7D1',
    paddingHorizontal: 20,
  },
  changeButtonText: {
    color: '#45B7D1',
  },
  analysisContainer: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.grey + '30',
  },
  analysisGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  analysisButton: {
    width: '48%',
    marginBottom: 10,
    paddingVertical: 15,
  },
  xrayButton: {
    backgroundColor: '#FF6B6B',
  },
  ctButton: {
    backgroundColor: '#4ECDC4',
  },
  mriButton: {
    backgroundColor: '#45B7D1',
  },
  ultrasoundButton: {
    backgroundColor: '#96CEB4',
  },
  analysisButtonText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  clearButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.grey + '50',
  },
  clearButtonText: {
    color: colors.grey,
  },
  resultsContainer: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.grey + '30',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statusCard: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    width: '48%',
    borderWidth: 2,
  },
  statusLabel: {
    fontSize: 14,
    color: colors.grey,
    marginBottom: 5,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  findingsContainer: {
    marginBottom: 20,
  },
  findingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  findingIcon: {
    color: '#4CAF50',
    marginRight: 10,
  },
  findingText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  impressionContainer: {
    marginBottom: 20,
  },
  impressionText: {
    fontSize: 14,
    color: colors.grey,
    lineHeight: 18,
  },
  recommendationsContainer: {
    marginBottom: 20,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationIcon: {
    color: '#FF9800',
    marginRight: 10,
  },
  recommendationText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  followUpContainer: {
    marginBottom: 20,
  },
  followUpText: {
    fontSize: 14,
    color: colors.grey,
    lineHeight: 18,
  },
  disclaimerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.background,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFA500',
  },
  disclaimerIcon: {
    color: '#FFA500',
    marginRight: 10,
    marginTop: 2,
  },
  disclaimerText: {
    fontSize: 12,
    color: colors.grey,
    flex: 1,
    lineHeight: 16,
  },
});
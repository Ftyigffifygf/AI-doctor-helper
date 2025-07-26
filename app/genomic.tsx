import { Text, View, ScrollView, SafeAreaView, Alert } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import Button from '../components/Button';
import Icon from '../components/Icon';
import { commonStyles, colors } from '../styles/commonStyles';
import { StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

export default function GenomicScreen() {
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFilePicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedFile(result.assets[0]);
        console.log('Genomic file selected:', result.assets[0].name);
      }
    } catch (error) {
      console.error('Error picking file:', error);
      Alert.alert('Error', 'Failed to select file');
    }
  };

  const handleAnalyze = () => {
    if (!selectedFile) {
      Alert.alert('Error', 'Please select a genomic file first');
      return;
    }

    setIsAnalyzing(true);
    console.log('Analyzing genomic data');

    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      Alert.alert(
        'Analysis Complete',
        'Genomic analysis would be performed using specialized AI models like Enformer, DeepVariant, or DNABERT. This requires significant computational resources and specialized infrastructure.',
        [{ text: 'OK' }]
      );
    }, 3000);
  };

  return (
    <SafeAreaView style={commonStyles.wrapper}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Button
            text="← Back"
            onPress={() => router.back()}
            style={styles.backButton}
            textStyle={styles.backButtonText}
          />
          <View style={styles.titleContainer}>
            <Icon name="analytics-outline" size={30} style={styles.headerIcon} />
            <Text style={styles.title}>Genomic Risk Predictor</Text>
          </View>
          <Text style={styles.subtitle}>DNA analysis and risk assessment</Text>
        </View>

        <View style={styles.infoContainer}>
          <Icon name="information-circle-outline" size={40} style={styles.infoIcon} />
          <Text style={styles.infoTitle}>Genomic Analysis Module</Text>
          <Text style={styles.infoText}>
            This module would analyze genomic data using advanced AI models to predict disease risks, 
            pharmacogenomic responses, and hereditary conditions. It supports VCF, FASTA, and other 
            genomic file formats.
          </Text>
          
          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>Capabilities:</Text>
            <Text style={styles.featureItem}>• Variant pathogenicity assessment</Text>
            <Text style={styles.featureItem}>• Disease risk calculation</Text>
            <Text style={styles.featureItem}>• Drug metabolism predictions</Text>
            <Text style={styles.featureItem}>• Hereditary condition screening</Text>
            <Text style={styles.featureItem}>• Population genetics analysis</Text>
          </View>

          {selectedFile ? (
            <View style={styles.fileInfo}>
              <Text style={styles.fileName}>Selected: {selectedFile.name}</Text>
              <Button
                text={isAnalyzing ? "Analyzing..." : "Analyze Genomic Data"}
                onPress={handleAnalyze}
                style={[styles.analyzeButton, isAnalyzing && styles.disabledButton]}
                textStyle={styles.analyzeButtonText}
              />
            </View>
          ) : (
            <Button
              text="Select Genomic File (VCF/FASTA)"
              onPress={handleFilePicker}
              style={styles.uploadButton}
              textStyle={styles.uploadButtonText}
            />
          )}

          <View style={styles.warningContainer}>
            <Icon name="warning-outline" size={20} style={styles.warningIcon} />
            <Text style={styles.warningText}>
              Genomic analysis requires specialized computational resources and should be interpreted 
              by qualified genetic counselors or medical geneticists.
            </Text>
          </View>
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
    color: '#96CEB4',
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
  infoContainer: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.grey + '30',
  },
  infoIcon: {
    color: '#96CEB4',
    marginBottom: 15,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: colors.grey,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  featuresContainer: {
    alignSelf: 'stretch',
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  featureItem: {
    fontSize: 14,
    color: colors.grey,
    marginBottom: 5,
  },
  fileInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  fileName: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  uploadButton: {
    backgroundColor: '#96CEB4',
    marginBottom: 20,
  },
  uploadButtonText: {
    fontWeight: 'bold',
  },
  analyzeButton: {
    backgroundColor: '#96CEB4',
  },
  analyzeButtonText: {
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.background,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFA500',
  },
  warningIcon: {
    color: '#FFA500',
    marginRight: 10,
    marginTop: 2,
  },
  warningText: {
    fontSize: 12,
    color: colors.grey,
    flex: 1,
    lineHeight: 16,
  },
});
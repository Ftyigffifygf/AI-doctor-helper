import { Text, View, ScrollView, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import Button from '../components/Button';
import Icon from '../components/Icon';
import { commonStyles, colors } from '../styles/commonStyles';
import { StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { openaiService } from '../services/openaiService';

export default function ScribeScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [transcription, setTranscription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [structuredNote, setStructuredNote] = useState<any>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = () => {
    console.log('Starting voice recording');
    setIsRecording(true);
    setRecordingDuration(0);
    setTranscription('');
    setStructuredNote(null);
  };

  const handleStopRecording = async () => {
    console.log('Stopping voice recording');
    setIsRecording(false);
    setIsProcessing(true);

    try {
      // Simulate getting transcription from OpenAI Whisper
      const mockTranscription = await openaiService.transcribeAudio('mock_audio_data');
      setTranscription(mockTranscription);
      await processTranscription(mockTranscription);
    } catch (error) {
      console.error('Transcription error:', error);
      Alert.alert('Error', 'Failed to process recording. Please try again.');
      setIsProcessing(false);
    }
  };

  const processTranscription = async (text: string) => {
    try {
      console.log('Processing transcription with OpenAI');
      const structured = await openaiService.structureMedicalNote(text);
      setStructuredNote(structured);
    } catch (error) {
      console.error('Note structuring error:', error);
      Alert.alert('Error', 'Failed to structure medical note. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUploadAudio = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        console.log('Audio file selected:', result.assets[0].name);
        setIsProcessing(true);
        
        try {
          // In a real implementation, you would upload the file to OpenAI Whisper
          const mockTranscription = await openaiService.transcribeAudio('uploaded_audio_data');
          setTranscription(mockTranscription);
          await processTranscription(mockTranscription);
        } catch (error) {
          console.error('Audio processing error:', error);
          Alert.alert('Error', 'Failed to process audio file. Please try again.');
          setIsProcessing(false);
        }
      }
    } catch (error) {
      console.error('Error picking audio file:', error);
      Alert.alert('Error', 'Failed to select audio file');
    }
  };

  const handleExportNote = () => {
    Alert.alert(
      'Export Note',
      'In a production app, this would export the structured note to EMR systems or as a PDF/Word document.',
      [{ text: 'OK' }]
    );
  };

  const handleClear = () => {
    setTranscription('');
    setStructuredNote(null);
    setRecordingDuration(0);
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
            <Icon name="mic-outline" size={30} style={styles.headerIcon} />
            <Text style={styles.title}>AI Medical Scribe</Text>
          </View>
          <Text style={styles.subtitle}>Powered by OpenAI Whisper & GPT-4</Text>
        </View>

        {/* Recording Controls */}
        <View style={styles.recordingContainer}>
          <Text style={styles.sectionTitle}>Voice Recording</Text>
          
          <View style={styles.recordingControls}>
            <TouchableOpacity
              style={[styles.recordButton, isRecording && styles.recordingActive]}
              onPress={isRecording ? handleStopRecording : handleStartRecording}
              disabled={isProcessing}
            >
              <Icon 
                name={isRecording ? "stop" : "mic"} 
                size={40} 
                style={styles.recordIcon} 
              />
            </TouchableOpacity>
            
            <View style={styles.recordingInfo}>
              <Text style={styles.recordingStatus}>
                {isRecording ? 'Recording...' : isProcessing ? 'Processing with AI...' : 'Ready to Record'}
              </Text>
              {(isRecording || recordingDuration > 0) && (
                <Text style={styles.recordingDuration}>{formatTime(recordingDuration)}</Text>
              )}
            </View>
          </View>

          <View style={styles.uploadContainer}>
            <Text style={styles.orText}>OR</Text>
            <Button
              text="Upload Audio File"
              onPress={handleUploadAudio}
              style={styles.uploadButton}
              textStyle={styles.uploadButtonText}
            />
          </View>
        </View>

        {/* Transcription Results */}
        {transcription && (
          <View style={styles.transcriptionContainer}>
            <Text style={styles.sectionTitle}>AI Transcription</Text>
            <View style={styles.transcriptionBox}>
              <Text style={styles.transcriptionText}>{transcription}</Text>
            </View>
          </View>
        )}

        {/* Structured Note */}
        {structuredNote && (
          <View style={styles.structuredContainer}>
            <Text style={styles.sectionTitle}>AI-Structured Medical Note</Text>
            
            <View style={styles.noteSection}>
              <Text style={styles.noteSectionTitle}>Chief Complaint</Text>
              <Text style={styles.noteSectionContent}>{structuredNote.chiefComplaint}</Text>
            </View>

            <View style={styles.noteSection}>
              <Text style={styles.noteSectionTitle}>History of Present Illness</Text>
              <Text style={styles.noteSectionContent}>{structuredNote.historyOfPresentIllness}</Text>
            </View>

            <View style={styles.noteSection}>
              <Text style={styles.noteSectionTitle}>Past Medical History</Text>
              <Text style={styles.noteSectionContent}>{structuredNote.pastMedicalHistory}</Text>
            </View>

            <View style={styles.noteSection}>
              <Text style={styles.noteSectionTitle}>Medications</Text>
              <Text style={styles.noteSectionContent}>{structuredNote.medications}</Text>
            </View>

            <View style={styles.noteSection}>
              <Text style={styles.noteSectionTitle}>Allergies</Text>
              <Text style={styles.noteSectionContent}>{structuredNote.allergies}</Text>
            </View>

            <View style={styles.noteSection}>
              <Text style={styles.noteSectionTitle}>Physical Examination</Text>
              <Text style={styles.noteSectionContent}>{structuredNote.physicalExam}</Text>
            </View>

            <View style={styles.noteSection}>
              <Text style={styles.noteSectionTitle}>Assessment</Text>
              <Text style={styles.noteSectionContent}>{structuredNote.assessment}</Text>
            </View>

            <View style={styles.noteSection}>
              <Text style={styles.noteSectionTitle}>Plan</Text>
              <Text style={styles.noteSectionContent}>{structuredNote.plan}</Text>
            </View>

            <View style={styles.codesContainer}>
              <View style={styles.codeSection}>
                <Text style={styles.codeSectionTitle}>ICD-10 Codes</Text>
                {structuredNote.icdCodes?.map((code: string, index: number) => (
                  <Text key={index} style={styles.codeText}>{code}</Text>
                ))}
              </View>
              
              <View style={styles.codeSection}>
                <Text style={styles.codeSectionTitle}>CPT Codes</Text>
                {structuredNote.cptCodes?.map((code: string, index: number) => (
                  <Text key={index} style={styles.codeText}>{code}</Text>
                ))}
              </View>
            </View>

            <View style={styles.actionButtons}>
              <Button
                text="Export Note"
                onPress={handleExportNote}
                style={styles.exportButton}
                textStyle={styles.exportButtonText}
              />
              <Button
                text="Clear All"
                onPress={handleClear}
                style={styles.clearButton}
                textStyle={styles.clearButtonText}
              />
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
    color: '#4ECDC4',
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
  recordingContainer: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.grey + '30',
    alignItems: 'center',
  },
  recordingControls: {
    alignItems: 'center',
    marginBottom: 20,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  recordingActive: {
    backgroundColor: '#FF6B6B',
  },
  recordIcon: {
    color: 'white',
  },
  recordingInfo: {
    alignItems: 'center',
  },
  recordingStatus: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 5,
  },
  recordingDuration: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  uploadContainer: {
    alignItems: 'center',
  },
  orText: {
    fontSize: 14,
    color: colors.grey,
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: '#4ECDC4',
    paddingHorizontal: 20,
  },
  uploadButtonText: {
    color: '#4ECDC4',
  },
  transcriptionContainer: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.grey + '30',
  },
  transcriptionBox: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.grey + '30',
  },
  transcriptionText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  structuredContainer: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.grey + '30',
  },
  noteSection: {
    marginBottom: 15,
  },
  noteSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  noteSectionContent: {
    fontSize: 14,
    color: colors.grey,
    lineHeight: 18,
  },
  codesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  codeSection: {
    flex: 1,
    marginHorizontal: 5,
  },
  codeSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  codeText: {
    fontSize: 12,
    color: colors.grey,
    backgroundColor: colors.background,
    padding: 8,
    borderRadius: 5,
    marginBottom: 3,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  exportButton: {
    backgroundColor: '#4ECDC4',
    flex: 1,
    marginRight: 10,
  },
  exportButtonText: {
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.grey + '50',
    paddingHorizontal: 20,
  },
  clearButtonText: {
    color: colors.grey,
  },
});
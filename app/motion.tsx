import { Text, View, ScrollView, SafeAreaView, Alert } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import Button from '../components/Button';
import Icon from '../components/Icon';
import { commonStyles, colors } from '../styles/commonStyles';
import { StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function MotionScreen() {
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleVideoPicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedVideo(result.assets[0]);
        console.log('Video selected for motion analysis');
      }
    } catch (error) {
      console.error('Error picking video:', error);
      Alert.alert('Error', 'Failed to select video');
    }
  };

  const handleRecordVideo = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera permission is required to record video');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedVideo(result.assets[0]);
        console.log('Video recorded for motion analysis');
      }
    } catch (error) {
      console.error('Error recording video:', error);
      Alert.alert('Error', 'Failed to record video');
    }
  };

  const handleAnalyze = () => {
    if (!selectedVideo) {
      Alert.alert('Error', 'Please select or record a video first');
      return;
    }

    setIsAnalyzing(true);
    console.log('Analyzing motion patterns');

    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      Alert.alert(
        'Analysis Complete',
        'Motion analysis would be performed using MediaPipe, OpenPose, or similar computer vision models to analyze gait patterns, posture, and movement disorders.',
        [{ text: 'OK' }]
      );
    }, 4000);
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
            <Icon name="walk-outline" size={30} style={styles.headerIcon} />
            <Text style={styles.title}>Motion Analysis Tool</Text>
          </View>
          <Text style={styles.subtitle}>Gait and posture analysis</Text>
        </View>

        <View style={styles.infoContainer}>
          <Icon name="videocam-outline" size={40} style={styles.infoIcon} />
          <Text style={styles.infoTitle}>Motion Analysis Module</Text>
          <Text style={styles.infoText}>
            This module analyzes human movement patterns using computer vision and AI to assess 
            gait abnormalities, posture issues, and movement disorders for clinical evaluation.
          </Text>
          
          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>Analysis Capabilities:</Text>
            <Text style={styles.featureItem}>• Gait pattern analysis</Text>
            <Text style={styles.featureItem}>• Posture assessment</Text>
            <Text style={styles.featureItem}>• Balance evaluation</Text>
            <Text style={styles.featureItem}>• Movement disorder detection</Text>
            <Text style={styles.featureItem}>• Rehabilitation progress tracking</Text>
          </View>

          <View style={styles.videoControls}>
            <Button
              text="📹 Record Video"
              onPress={handleRecordVideo}
              style={styles.recordButton}
              textStyle={styles.recordButtonText}
            />
            <Button
              text="📁 Select Video"
              onPress={handleVideoPicker}
              style={styles.selectButton}
              textStyle={styles.selectButtonText}
            />
          </View>

          {selectedVideo && (
            <View style={styles.videoInfo}>
              <Text style={styles.videoText}>Video selected for analysis</Text>
              <Button
                text={isAnalyzing ? "Analyzing Motion..." : "Analyze Movement"}
                onPress={handleAnalyze}
                style={[styles.analyzeButton, isAnalyzing && styles.disabledButton]}
                textStyle={styles.analyzeButtonText}
              />
            </View>
          )}

          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Recording Instructions:</Text>
            <Text style={styles.instructionItem}>• Record in good lighting</Text>
            <Text style={styles.instructionItem}>• Capture full body movement</Text>
            <Text style={styles.instructionItem}>• Record for 10-30 seconds</Text>
            <Text style={styles.instructionItem}>• Keep camera steady</Text>
            <Text style={styles.instructionItem}>• Wear contrasting clothing</Text>
          </View>

          <View style={styles.warningContainer}>
            <Icon name="information-circle-outline" size={20} style={styles.warningIcon} />
            <Text style={styles.warningText}>
              Motion analysis results should be interpreted by qualified healthcare professionals 
              such as physical therapists, neurologists, or orthopedic specialists.
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
    color: '#DDA0DD',
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
    color: '#DDA0DD',
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
  videoControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  recordButton: {
    backgroundColor: '#DDA0DD',
    flex: 1,
    marginRight: 10,
  },
  recordButtonText: {
    fontWeight: 'bold',
  },
  selectButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: '#DDA0DD',
    flex: 1,
    marginLeft: 10,
  },
  selectButtonText: {
    color: '#DDA0DD',
  },
  videoInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  videoText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  analyzeButton: {
    backgroundColor: '#DDA0DD',
  },
  analyzeButtonText: {
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
  instructionsContainer: {
    alignSelf: 'stretch',
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  instructionItem: {
    fontSize: 14,
    color: colors.grey,
    marginBottom: 5,
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
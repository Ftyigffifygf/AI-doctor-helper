import React, { useState } from 'react';
import { Text, View, ScrollView, SafeAreaView, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { StyleSheet } from 'react-native';
import Icon from '../components/Icon';
import Button from '../components/Button';
import { commonStyles, colors, spacing, borderRadius, typography, shadows } from '../styles/commonStyles';
import { openaiService } from '../services/openaiService';

export default function DiagnosticScreen() {
  const [symptoms, setSymptoms] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!symptoms.trim()) {
      Alert.alert('Error', 'Please enter symptoms to analyze.');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Analyzing symptoms with medical training enhancement...');
      const result = await openaiService.analyzeSymptoms(symptoms, age, gender, medicalHistory);
      setAnalysis(result);
      console.log('Analysis completed:', result);
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      Alert.alert('Error', 'Failed to analyze symptoms. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSymptoms('');
    setAge('');
    setGender('');
    setMedicalHistory('');
    setAnalysis(null);
  };

  const getUrgencyStyle = (urgency: string) => {
    switch (urgency?.toLowerCase()) {
      case 'high': return { color: colors.error };
      case 'medium': return { color: colors.warning };
      case 'low': return { color: colors.success };
      default: return { color: colors.warning };
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 70) return colors.error;
    if (probability >= 40) return colors.warning;
    return colors.success;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Button
            text="← Back"
            onPress={() => router.back()}
            variant="outline"
            size="small"
            style={styles.backButton}
            textStyle={styles.backButtonText}
            fullWidth={false}
          />
          
          <View style={styles.titleRow}>
            <Icon 
              name="medical" 
              size={28} 
              color={colors.white}
              backgroundColor={colors.error}
              rounded
              padding={spacing.sm}
            />
            <View style={styles.titleContainer}>
              <Text style={styles.headerTitle}>🩺 Symptom Diagnostic</Text>
              <Text style={styles.headerSubtitle}>AI-Powered Medical Analysis</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Enhancement Banner */}
      <View style={styles.enhancementBanner}>
        <Icon 
          name="checkmark-circle" 
          size={20} 
          color={colors.white}
        />
        <Text style={styles.enhancementText}>
          Enhanced with MIMIC-III clinical database (58,976 patient cases)
        </Text>
      </View>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Input Section */}
        <View style={styles.inputSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Symptoms *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe your symptoms in detail..."
              placeholderTextColor={colors.textSecondary}
              value={symptoms}
              onChangeText={setSymptoms}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, styles.inputHalf]}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter age"
                placeholderTextColor={colors.textSecondary}
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputGroup, styles.inputHalf]}>
              <Text style={styles.label}>Gender</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter gender"
                placeholderTextColor={colors.textSecondary}
                value={gender}
                onChangeText={setGender}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Medical History</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Any relevant medical history (optional)"
              placeholderTextColor={colors.textSecondary}
              value={medicalHistory}
              onChangeText={setMedicalHistory}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            text="🔍 Analyze Symptoms"
            onPress={handleAnalyze}
            loading={isLoading}
            variant="primary"
            size="medium"
            style={styles.analyzeButton}
            icon={!isLoading ? <Icon name="search-outline" size={20} color={colors.white} /> : undefined}
          />
          
          <Button
            text="Clear All"
            onPress={handleClear}
            variant="outline"
            size="medium"
            style={styles.clearButton}
            icon={<Icon name="refresh-outline" size={20} color={colors.primary} />}
          />
        </View>

        {/* Analysis Results */}
        {analysis && (
          <View style={styles.resultsContainer}>
            <View style={styles.resultsHeader}>
              <Icon 
                name="document-text-outline" 
                size={24} 
                color={colors.primary}
              />
              <Text style={styles.resultsTitle}>📋 Diagnostic Analysis</Text>
            </View>
            
            {/* Possible Conditions */}
            {analysis.possibleConditions?.map((condition: any, index: number) => (
              <View key={index} style={styles.conditionCard}>
                <View style={styles.conditionHeader}>
                  <Text style={styles.conditionName}>{condition.condition}</Text>
                  <View style={[
                    styles.probabilityBadge, 
                    { backgroundColor: getProbabilityColor(condition.probability) }
                  ]}>
                    <Text style={styles.probabilityText}>{condition.probability}%</Text>
                  </View>
                </View>
                
                <Text style={styles.conditionDescription}>{condition.description}</Text>
                
                {condition.datasetEvidence && (
                  <View style={styles.evidenceContainer}>
                    <Icon 
                      name="bar-chart-outline" 
                      size={16} 
                      color={colors.info}
                    />
                    <Text style={styles.evidenceText}>{condition.datasetEvidence}</Text>
                  </View>
                )}
                
                {condition.recommendations && condition.recommendations.length > 0 && (
                  <View style={styles.recommendationsContainer}>
                    <Text style={styles.recommendationsTitle}>Recommendations:</Text>
                    {condition.recommendations.map((rec: string, recIndex: number) => (
                      <View key={recIndex} style={styles.recommendationItem}>
                        <Icon 
                          name="checkmark-outline" 
                          size={14} 
                          color={colors.success}
                        />
                        <Text style={styles.recommendationText}>{rec}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}

            {/* Recommended Tests */}
            {analysis.recommendedTests && analysis.recommendedTests.length > 0 && (
              <View style={styles.testsSection}>
                <View style={styles.sectionHeader}>
                  <Icon 
                    name="flask-outline" 
                    size={20} 
                    color={colors.warning}
                  />
                  <Text style={styles.sectionTitle}>🧪 Recommended Tests</Text>
                </View>
                
                {analysis.recommendedTests.map((test: string, index: number) => (
                  <View key={index} style={styles.testItem}>
                    <Icon 
                      name="medical-outline" 
                      size={16} 
                      color={colors.warning}
                    />
                    <Text style={styles.testText}>{test}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Summary Metrics */}
            <View style={styles.metricsContainer}>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Urgency Level</Text>
                <Text style={[styles.metricValue, getUrgencyStyle(analysis.urgencyLevel)]}>
                  {analysis.urgencyLevel}
                </Text>
              </View>

              {analysis.confidenceScore && (
                <View style={styles.metricCard}>
                  <Text style={styles.metricLabel}>Confidence Score</Text>
                  <Text style={[styles.metricValue, { color: colors.primary }]}>
                    {analysis.confidenceScore}%
                  </Text>
                </View>
              )}

              {analysis.similarCases && (
                <View style={styles.metricCard}>
                  <Text style={styles.metricLabel}>Similar Cases</Text>
                  <Text style={[styles.metricValue, { color: colors.info }]}>
                    {analysis.similarCases}
                  </Text>
                </View>
              )}
            </View>

            {/* Disclaimer */}
            <View style={styles.disclaimerContainer}>
              <Icon 
                name="information-circle-outline" 
                size={20} 
                color={colors.warning}
              />
              <Text style={styles.disclaimerText}>
                {analysis.disclaimer || 'This AI analysis should not replace professional medical advice. Please consult with a healthcare professional for proper diagnosis and treatment.'}
              </Text>
            </View>

            {/* Enhancement Footer */}
            {analysis.trainingEnhanced && (
              <View style={styles.enhancementFooter}>
                <Icon 
                  name="analytics-outline" 
                  size={16} 
                  color={colors.primary}
                />
                <Text style={styles.enhancementFooterText}>
                  Analysis enhanced with medical training data from: {analysis.datasetSources?.join(', ')}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Footer Spacing */}
        <View style={styles.footerSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  // Header Styles
  header: {
    backgroundColor: colors.primary,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: borderRadius.xxl,
    borderBottomRightRadius: borderRadius.xxl,
    ...shadows.large,
  },
  headerContent: {
    paddingHorizontal: spacing.xl,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
    backgroundColor: 'transparent',
    borderColor: colors.white,
  },
  backButtonText: {
    color: colors.white,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    marginLeft: spacing.md,
    flex: 1,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.bodySmall,
    color: colors.white,
    opacity: 0.9,
  },
  
  // Enhancement Banner
  enhancementBanner: {
    backgroundColor: colors.success,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    margin: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.medium,
  },
  enhancementText: {
    ...typography.bodySmall,
    color: colors.white,
    fontWeight: '600',
    marginLeft: spacing.md,
    flex: 1,
  },
  
  // Content Styles
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  
  // Input Section
  inputSection: {
    marginBottom: spacing.xl,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  inputHalf: {
    flex: 1,
  },
  label: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.sm,
    fontSize: 16,
  },
  input: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.body.fontSize,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.small,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  
  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  analyzeButton: {
    flex: 2,
  },
  clearButton: {
    flex: 1,
  },
  
  // Results Container
  resultsContainer: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.medium,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  resultsTitle: {
    ...typography.h3,
    color: colors.text,
    marginLeft: spacing.md,
  },
  
  // Condition Cards
  conditionCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.small,
  },
  conditionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  conditionName: {
    ...typography.h4,
    color: colors.text,
    flex: 1,
  },
  probabilityBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  probabilityText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '700',
  },
  conditionDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  evidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    backgroundColor: colors.backgroundAlt,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  evidenceText: {
    ...typography.caption,
    color: colors.info,
    fontStyle: 'italic',
    marginLeft: spacing.sm,
    flex: 1,
  },
  recommendationsContainer: {
    marginTop: spacing.md,
  },
  recommendationsTitle: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  recommendationText: {
    ...typography.bodySmall,
    color: colors.text,
    marginLeft: spacing.sm,
    flex: 1,
  },
  
  // Tests Section
  testsSection: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  testItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  testText: {
    ...typography.bodySmall,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  
  // Metrics Container
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.md,
  },
  metricCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metricLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  metricValue: {
    ...typography.h4,
    fontWeight: '700',
  },
  
  // Disclaimer
  disclaimerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  disclaimerText: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 16,
    marginLeft: spacing.sm,
  },
  
  // Enhancement Footer
  enhancementFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.backgroundAlt,
    borderRadius: borderRadius.sm,
  },
  enhancementFooterText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: spacing.sm,
    flex: 1,
  },
  
  // Footer
  footerSpacing: {
    height: spacing.xl,
  },
});
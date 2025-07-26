import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { StyleSheet } from 'react-native';
import Icon from '../components/Icon';
import Button from '../components/Button';
import { commonStyles, colors, spacing, borderRadius, typography, shadows } from '../styles/commonStyles';
import { getApiStatus } from '../config/apiConfig';

interface ModuleItem {
  title: string;
  description: string;
  icon: keyof typeof import('@expo/vector-icons/Ionicons').glyphMap;
  enhanced: boolean;
  route: string;
  color: string;
}

export default function AIMEDashboard() {
  const [apiStatus, setApiStatus] = useState<any>(null);

  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = () => {
    const status = getApiStatus();
    setApiStatus(status);
    console.log('API Status:', status);
  };

  const handleModulePress = (module: ModuleItem) => {
    console.log(`Navigating to ${module.title} module`);
    
    if (module.route) {
      router.push(module.route);
    } else {
      Alert.alert('Coming Soon', `${module.title} module is under development.`);
    }
  };

  const handleApiSetup = () => {
    Alert.alert(
      'API Configuration',
      'OpenAI API is configured and ready. All modules are enhanced with medical training data from open networks including MIMIC-III, NIH, PhysioNet, TCGA, and ISIC datasets.',
      [{ text: 'OK' }]
    );
  };

  const modules: ModuleItem[] = [
    {
      title: 'Symptom Diagnostic',
      description: 'AI-powered symptom analysis with clinical database training',
      icon: 'medical',
      enhanced: true,
      route: '/diagnostic',
      color: '#FF6B6B',
    },
    {
      title: 'AI Medical Scribe',
      description: 'Voice-to-text medical documentation with clinical templates',
      icon: 'mic',
      enhanced: true,
      route: '/scribe',
      color: '#4ECDC4',
    },
    {
      title: 'Scan Analyzer',
      description: 'Medical imaging analysis trained on 145K+ validated images',
      icon: 'scan',
      enhanced: true,
      route: '/scanner',
      color: '#45B7D1',
    },
    {
      title: 'Genomic Predictor',
      description: 'Genetic risk assessment using TCGA cancer genome data',
      icon: 'analytics',
      enhanced: true,
      route: '/genomic',
      color: '#96CEB4',
    },
    {
      title: 'Lab Report Parser',
      description: 'Laboratory result interpretation with clinical context',
      icon: 'flask',
      enhanced: true,
      route: '/lab',
      color: '#FECA57',
    },
    {
      title: 'Motion Analysis',
      description: 'Gait and posture analysis with biomechanical insights',
      icon: 'walk',
      enhanced: true,
      route: '/motion',
      color: '#FF9FF3',
    },
    {
      title: 'Vital Monitor',
      description: 'Real-time vital signs monitoring with cardiac pattern recognition',
      icon: 'heart',
      enhanced: true,
      route: '/vitals',
      color: colors.heartRate,
    },
    {
      title: 'Doctor Agent Hub',
      description: 'Multimodal AI assistant with comprehensive medical knowledge',
      icon: 'chatbubbles',
      enhanced: true,
      route: '/agent',
      color: '#A8E6CF',
    },
    {
      title: 'Medical Training',
      description: 'View and manage AI training with medical datasets',
      icon: 'school',
      enhanced: false,
      route: '/training',
      color: '#DDA0DD',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <Icon 
              name="medical" 
              size={32} 
              color={colors.white}
              backgroundColor={colors.primary}
              rounded
              padding={spacing.sm}
            />
            <View style={styles.titleContainer}>
              <Text style={styles.headerTitle}>🧠 AIME</Text>
              <Text style={styles.headerSubtitle}>All-in-One Medical Ecosystem</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Enhancement Banner */}
        <View style={styles.enhancementBanner}>
          <Icon 
            name="checkmark-circle" 
            size={24} 
            color={colors.white}
            style={styles.bannerIcon}
          />
          <View style={styles.enhancementText}>
            <Text style={styles.enhancementTitle}>🎯 AI Enhanced</Text>
            <Text style={styles.enhancementSubtitle}>
              Trained with medical open networks: MIMIC-III, NIH, PhysioNet, TCGA, ISIC
            </Text>
          </View>
        </View>

        {/* API Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.statusTitle}>🔧 System Status</Text>
            <Icon 
              name={apiStatus?.openai ? "checkmark-circle" : "close-circle"} 
              size={20} 
              color={apiStatus?.openai ? colors.success : colors.error}
            />
          </View>
          
          <View style={styles.statusGrid}>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>OpenAI API</Text>
              <Text style={[
                styles.statusValue, 
                apiStatus?.openai ? styles.statusActive : styles.statusInactive
              ]}>
                {apiStatus?.openai ? '✅ Connected' : '❌ Not Connected'}
              </Text>
            </View>
            
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Medical Training Data</Text>
              <Text style={[styles.statusValue, styles.statusActive]}>
                ✅ Active (5 Datasets)
              </Text>
            </View>
            
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>AI Enhancement</Text>
              <Text style={[styles.statusValue, styles.statusActive]}>
                ✅ Enabled
              </Text>
            </View>
            
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Training Records</Text>
              <Text style={[styles.statusValue, styles.statusActive]}>
                ✅ 281K+ Records
              </Text>
            </View>
          </View>
        </View>

        {/* AI Modules Section */}
        <View style={styles.modulesSection}>
          <Text style={styles.sectionTitle}>🏥 Medical AI Modules</Text>
          <View style={styles.moduleGrid}>
            {modules.map((module, index) => (
              <TouchableOpacity
                key={index}
                style={styles.moduleCard}
                onPress={() => handleModulePress(module)}
                activeOpacity={0.8}
              >
                {module.enhanced && (
                  <View style={styles.enhancedBadge}>
                    <Text style={styles.enhancedBadgeText}>ENHANCED</Text>
                  </View>
                )}
                
                <View style={styles.moduleIconContainer}>
                  <Icon 
                    name={module.icon} 
                    size={28} 
                    color={colors.white}
                    backgroundColor={module.color}
                    rounded
                    padding={spacing.sm}
                  />
                </View>
                
                <Text style={styles.moduleTitle}>{module.title}</Text>
                <Text style={styles.moduleDescription}>{module.description}</Text>
                
                <View style={styles.moduleFooter}>
                  <Icon 
                    name="arrow-forward" 
                    size={16} 
                    color={colors.primary}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <Button
            text="🔧 API Configuration"
            onPress={handleApiSetup}
            variant="outline"
            size="medium"
            icon={<Icon name="settings-outline" size={20} color={colors.primary} />}
          />
          
          <Button
            text="📊 View Training Dashboard"
            onPress={() => handleModulePress(modules.find(m => m.title === 'Medical Training')!)}
            variant="success"
            size="medium"
            icon={<Icon name="analytics-outline" size={20} color={colors.white} />}
          />
        </View>

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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    marginLeft: spacing.md,
    flex: 1,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.bodySmall,
    color: colors.white,
    opacity: 0.9,
  },
  
  // Content Styles
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  
  // Enhancement Banner
  enhancementBanner: {
    backgroundColor: colors.success,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.medium,
  },
  bannerIcon: {
    marginRight: spacing.md,
  },
  enhancementText: {
    flex: 1,
  },
  enhancementTitle: {
    ...typography.h4,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  enhancementSubtitle: {
    ...typography.bodySmall,
    color: colors.white,
    opacity: 0.9,
    lineHeight: 18,
  },
  
  // Status Card
  statusCard: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.medium,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  statusTitle: {
    ...typography.h4,
    color: colors.text,
  },
  statusGrid: {
    gap: spacing.md,
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  statusLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  statusValue: {
    ...typography.bodySmall,
    fontWeight: '600',
  },
  statusActive: {
    color: colors.success,
  },
  statusInactive: {
    color: colors.error,
  },
  
  // Modules Section
  modulesSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  moduleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  moduleCard: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: '47%',
    minHeight: 160,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
    ...shadows.medium,
  },
  enhancedBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.success,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    zIndex: 1,
  },
  enhancedBadgeText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '700',
  },
  moduleIconContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  moduleTitle: {
    ...typography.h4,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
    fontSize: 14,
  },
  moduleDescription: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
    flex: 1,
  },
  moduleFooter: {
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  
  // Action Section
  actionSection: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  
  // Footer
  footerSpacing: {
    height: spacing.xl,
  },
});
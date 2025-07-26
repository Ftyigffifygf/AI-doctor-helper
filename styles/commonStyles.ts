import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

export const colors = {
  // Primary Medical Theme Colors
  primary: '#162456',        // Deep Medical Blue
  secondary: '#193cb8',      // Bright Medical Blue
  accent: '#64B5F6',         // Light Blue Accent
  
  // Background Colors
  background: '#101824',     // Dark Background
  backgroundAlt: '#162133',  // Alternative Dark Background
  
  // Text Colors
  text: '#e3e3e3',          // Primary Light Text
  textSecondary: '#a0a0a0',  // Secondary Text
  white: '#ffffff',          // Pure White
  
  // Status Colors
  success: '#4CAF50',        // Green for Success
  warning: '#FF9800',        // Orange for Warning
  error: '#F44336',          // Red for Error
  info: '#2196F3',           // Blue for Info
  
  // UI Element Colors
  grey: '#90CAF9',           // Light Blue Grey
  lightGray: '#f5f5f5',      // Light Gray
  card: '#193cb8',           // Card Background
  shadow: '#000000',         // Shadow Color
  
  // Medical Specific Colors
  heartRate: '#FFB6C1',      // Light Pink for Heart Rate
  bloodPressure: '#87CEEB',  // Sky Blue for Blood Pressure
  temperature: '#FFA07A',    // Light Salmon for Temperature
  oxygen: '#98FB98',         // Pale Green for Oxygen
  
  // Border and Divider Colors
  border: '#333333',         // Border Color
  divider: '#444444',        // Divider Color
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const borderRadius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  round: 50,
};

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: '800' as const,
    lineHeight: 34,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 30,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 26,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
};

export const shadows = {
  small: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.medium,
  },
  secondary: {
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.medium,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  success: {
    backgroundColor: colors.success,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.medium,
  },
  warning: {
    backgroundColor: colors.warning,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.medium,
  },
  error: {
    backgroundColor: colors.error,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.medium,
  },
  small: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  large: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
    paddingHorizontal: spacing.xl,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  
  // Typography Styles
  title: {
    ...typography.h1,
    textAlign: 'center',
    color: colors.text,
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.h3,
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  text: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  textSmall: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  caption: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  
  // Layout Styles
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  column: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  spaceAround: {
    justifyContent: 'space-around',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Card Styles
  card: {
    backgroundColor: colors.backgroundAlt,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginVertical: spacing.sm,
    width: '100%',
    ...shadows.medium,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    ...typography.h4,
    color: colors.text,
    flex: 1,
  },
  cardContent: {
    flex: 1,
  },
  
  // Input Styles
  input: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.body.fontSize,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.lightGray,
    marginBottom: spacing.md,
    width: '100%',
  },
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  inputError: {
    borderColor: colors.error,
    borderWidth: 2,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  
  // Button Container Styles
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginTop: spacing.lg,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: spacing.md,
  },
  
  // Status Styles
  statusSuccess: {
    color: colors.success,
  },
  statusWarning: {
    color: colors.warning,
  },
  statusError: {
    color: colors.error,
  },
  statusInfo: {
    color: colors.info,
  },
  
  // Utility Styles
  flex1: {
    flex: 1,
  },
  fullWidth: {
    width: '100%',
  },
  textCenter: {
    textAlign: 'center',
  },
  textLeft: {
    textAlign: 'left',
  },
  textRight: {
    textAlign: 'right',
  },
  
  // Icon Styles
  icon: {
    width: 60,
    height: 60,
    tintColor: colors.white,
  },
  iconSmall: {
    width: 24,
    height: 24,
  },
  iconMedium: {
    width: 32,
    height: 32,
  },
  iconLarge: {
    width: 48,
    height: 48,
  },
  
  // Spacing Utilities
  marginTop: {
    marginTop: spacing.md,
  },
  marginBottom: {
    marginBottom: spacing.md,
  },
  marginVertical: {
    marginVertical: spacing.md,
  },
  marginHorizontal: {
    marginHorizontal: spacing.md,
  },
  paddingTop: {
    paddingTop: spacing.md,
  },
  paddingBottom: {
    paddingBottom: spacing.md,
  },
  paddingVertical: {
    paddingVertical: spacing.md,
  },
  paddingHorizontal: {
    paddingHorizontal: spacing.md,
  },
});
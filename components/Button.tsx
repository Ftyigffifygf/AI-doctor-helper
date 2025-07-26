import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { colors, typography, borderRadius, spacing, shadows } from '../styles/commonStyles';

interface ButtonProps {
  text: string;
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export default function Button({ 
  text, 
  onPress, 
  style, 
  textStyle, 
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  fullWidth = true
}: ButtonProps) {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      ...shadows.medium,
    };

    // Size styles
    switch (size) {
      case 'small':
        baseStyle.paddingVertical = spacing.sm;
        baseStyle.paddingHorizontal = spacing.md;
        break;
      case 'large':
        baseStyle.paddingVertical = spacing.lg;
        baseStyle.paddingHorizontal = spacing.xxl;
        break;
      default:
        baseStyle.paddingVertical = spacing.md;
        baseStyle.paddingHorizontal = spacing.xl;
    }

    // Variant styles
    switch (variant) {
      case 'secondary':
        baseStyle.backgroundColor = colors.secondary;
        break;
      case 'outline':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderWidth = 2;
        baseStyle.borderColor = colors.primary;
        break;
      case 'success':
        baseStyle.backgroundColor = colors.success;
        break;
      case 'warning':
        baseStyle.backgroundColor = colors.warning;
        break;
      case 'error':
        baseStyle.backgroundColor = colors.error;
        break;
      default:
        baseStyle.backgroundColor = colors.primary;
    }

    // Disabled state
    if (disabled || loading) {
      baseStyle.opacity = 0.6;
    }

    // Full width
    if (fullWidth) {
      baseStyle.width = '100%';
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      ...typography.button,
      textAlign: 'center',
    };

    // Size-specific text styles
    switch (size) {
      case 'small':
        baseTextStyle.fontSize = 14;
        break;
      case 'large':
        baseTextStyle.fontSize = 18;
        break;
      default:
        baseTextStyle.fontSize = 16;
    }

    // Variant-specific text colors
    switch (variant) {
      case 'outline':
        baseTextStyle.color = colors.primary;
        break;
      default:
        baseTextStyle.color = colors.white;
    }

    return baseTextStyle;
  };

  return (
    <TouchableOpacity 
      style={[getButtonStyle(), style]} 
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled || loading}
    >
      {loading && (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' ? colors.primary : colors.white} 
          style={{ marginRight: spacing.sm }}
        />
      )}
      {icon && !loading && (
        <React.Fragment>
          {icon}
          <Text style={{ width: spacing.sm }} />
        </React.Fragment>
      )}
      <Text style={[getTextStyle(), textStyle]}>
        {loading ? 'Loading...' : text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Legacy styles for backward compatibility
  button: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
    width: '100%',
    ...shadows.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.button.fontSize,
    fontWeight: typography.button.fontWeight,
    textAlign: 'center',
  },
});
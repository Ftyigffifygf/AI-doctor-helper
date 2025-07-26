import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../styles/commonStyles';

interface IconProps {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  style?: ViewStyle;
  backgroundColor?: string;
  rounded?: boolean;
  padding?: number;
}

export default function Icon({ 
  name, 
  size = 24, 
  color = colors.white, 
  style,
  backgroundColor,
  rounded = false,
  padding = 0
}: IconProps) {
  const containerStyle: ViewStyle = {
    alignItems: 'center',
    justifyContent: 'center',
  };

  if (backgroundColor) {
    containerStyle.backgroundColor = backgroundColor;
  }

  if (rounded) {
    containerStyle.borderRadius = (size + padding * 2) / 2;
  }

  if (padding > 0) {
    containerStyle.padding = padding;
    containerStyle.width = size + padding * 2;
    containerStyle.height = size + padding * 2;
  }

  return (
    <View style={[containerStyle, style]}>
      <Ionicons name={name} size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Legacy styles for backward compatibility
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
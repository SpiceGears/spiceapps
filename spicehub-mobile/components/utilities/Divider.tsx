import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
} from 'react-native';

export interface DividerProps {
  /** true for vertical divider, false for horizontal */
  vertical?: boolean;
  /** thickness in pixels (defaults to a hairline) */
  thickness?: number;
  /** color of the line */
  color?: string;
  /** margin around the line */
  margin?: number;
  /** any additional styling */
  style?: ViewStyle;
}

/** 
 * A lightweight divider. 
 * - horizontal: full-width, controlled height 
 * - vertical: full-height of container, controlled width 
 */
export default function Divider({
  vertical = false,
  thickness = StyleSheet.hairlineWidth,
  color = '#E0E0E0',
  margin = 8,
  style,
}: DividerProps) {
  if (vertical) {
    return (
      <View
        style={[
          {
            width: thickness,
            backgroundColor: color,
            marginHorizontal: margin,
            alignSelf: 'stretch',
          },
          style,
        ]}
      />
    );
  }

  return (
    <View
      style={[
        {
          height: thickness,
          backgroundColor: color,
          marginVertical: margin,
            // full width by default
          width: '100%',
        },
        style,
      ]}
    />
  );
}
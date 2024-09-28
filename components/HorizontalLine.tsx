import React from 'react';
import { View, StyleSheet,ViewStyle } from 'react-native';

type DimensionValue = number | `${number}%` | 'auto' | undefined;

// Define props interface for customizations
interface HorizontalLineProps {
  color?: string; // Optional prop to customize line color
  thickness?: number; // Optional prop to customize line thickness
  width?: DimensionValue; // Optional prop to customize line width (percentage or absolute)
  margin?: number;
}

// Define the functional component with props
const HorizontalLine: React.FC<HorizontalLineProps> = ({
  color = '#bfbdbb', // Default color
  thickness = 1, // Default thickness
  width = '85%', // Default width
  margin = 24
}) => {

    const lineStyle: ViewStyle = {
        backgroundColor: color,
        height: thickness,
        width: width,
        marginStart: margin,
        marginEnd:margin,
        marginTop:margin,
        alignSelf: 'baseline', // Center the line horizontally by default
      };
    
    return <View style={lineStyle} />;

};

export default HorizontalLine;

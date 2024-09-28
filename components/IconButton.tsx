import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageSourcePropType } from 'react-native';

interface IconButtonProps {
  text: string;
  imageSource: ImageSourcePropType;
  onPress: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({ text, imageSource, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Image source={imageSource} style={styles.icon} />
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#787676',
    padding: 10,
    borderRadius: 5,
    marginTop:24
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontFamily:'PlusJakartaSans-Italic-VariableFont_wght'
  },
});

export default IconButton;

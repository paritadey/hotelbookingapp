import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; 

interface SearchBarProps {
  text: string;
  imageSource: ImageSourcePropType;
  onPress: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ text, imageSource, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Icon name="search" size={24} color="#000" />
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 5,
    marginTop: 24
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  text: {
    color: '#8a858b',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Italic-VariableFont_wght'
  },
});

export default SearchBar;

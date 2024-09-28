import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export interface ImageProp{
    image:string,
}
const RoundedImage: React.FC<ImageProp> = ({image}) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: image }} 
        style={styles.image}
      />
    </View>
  );
};

export default RoundedImage;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 100, // Make it a circle (half of width/height for circle)
    borderWidth: 1,    // Optional: Border around the image
    borderColor: '#000',  // Optional: Border color
  },
});

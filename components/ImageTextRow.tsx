import React from 'react';
import { View, Text, Image, StyleSheet, ImageSourcePropType, Dimensions, ScrollView } from 'react-native';

interface ImageTextRowProps {
  image:ImageSourcePropType;  
  text: string; 
  imageSize?: number; 
  data:string[];
}

const ImageTextRow: React.FC<ImageTextRowProps> = ({
  image,  
  text,
  imageSize = 40, // Default image size
  data,
}) => {
  return (
    <View style={styles.container}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <Image
        source={image} 
        style={[styles.image, { width: imageSize, height: imageSize }]}
        resizeMode="cover"
      />
      <Text style={[styles.text, ]}>{text} :</Text>
        {
        data.map((option, index) => (
            <Text key={index} style={styles.flavor}>{option},</Text>))
        }
        </ScrollView>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Arrange children in a row
    alignItems: 'center', // Center vertically
    padding: 10,
  },
  image: {
    marginRight: 10, 
    borderRadius: 20, 
  },
  text: {
    fontSize: 16,
    marginTop:8,
    color:'#000000',
    fontFamily:'PlusJakartaSans-Italic-VariableFont_wght',
  },
  flavor:{
    fontSize: 14,
    marginLeft: 8,
    color:'#000000',
    marginTop:8,
    fontFamily:'PlusJakartaSans-Italic-VariableFont_wght',
}
});

export default ImageTextRow;

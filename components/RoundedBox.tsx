import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export interface RoundedBoxProp{
    image:string,
    text:string|undefined,
}
const RoundedBox: React.FC<RoundedBoxProp> = ({image, text}) => {
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Image
          source={{ uri: image }} // Replace with your image URL
          style={styles.image}
        />
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
};

export default RoundedBox;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop:24,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
    width: '100%',
    height:54,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25, // Make the image circular
    marginRight: 10,
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
})
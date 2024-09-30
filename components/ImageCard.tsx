import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';

interface ImageCardProps {
    hotelAddress: string;
    summary:string;
    amenities:string[];
}

const ImageCard: React.FC<ImageCardProps> = ({hotelAddress, summary, amenities}) => {
  return (
    <View style={styles.container}>
      <Card>
        <Card.Content>
          <Title>★  {summary}</Title>
          <Paragraph> 🌐  Amenities: {amenities}</Paragraph>
          <Paragraph>📍 Address :{hotelAddress}</Paragraph>

        </Card.Content>
        <Card.Cover source={{ uri: 'https://i.pinimg.com/736x/0c/a8/8d/0ca88d0c8b63a9d0589ab61211e36e6f.jpg' }} style={styles.image} />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: 10,
  },
  image: {
    marginTop:24,
    height: 200,
  },
});

export default ImageCard;

import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { Hotel, Photos } from '../hotelList/type'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigator'
import { WebView } from 'react-native-webview';

type Props = NativeStackScreenProps<RootStackParamList, 'HotelItemScreen'>;


const HotelItemScreen: React.FC<Props> = ({ route, navigation }) => {
  const { hotel } = route.params;
  let url: string = '';
  const results: Photos[] = JSON.parse(JSON.stringify(hotel.photos))
  //console.log("Data we are getting: ",results);
  const attribute = results.map((it) => it.html_attributions);
  //console.log("Attribute:", attribute);
  if (Array.isArray(attribute)) {
    const urlMatch = attribute[0][0].match(/href="(.*?)"/);
    url = urlMatch ? urlMatch[1] : "";
  }
  console.log("outside attribute array: ", url);
  return (
    <View style={{ flex: 1 }}>
      {/* <Text>{hotel.name}</Text>
    <Text>{hotel.formatted_address}</Text> */}
      {/* <WebView 
      source={{ uri: url }} 
      style={{width:'100%', height:'50%' }} 
      javaScriptEnabled={true} 
      domStorageEnabled={true}
      startInLoadingState={true}
      scalesPageToFit={true} 
      
    /> */}
    </View>
  )
}

export default HotelItemScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
})
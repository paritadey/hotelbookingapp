import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions } from 'react-native'
import React, { useEffect } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {RootStackParamList} from '../AppNavigator'
import { Provider } from 'react-redux';
import store from '../locationCode/store';
import SearchData from '../searchHotelList/SearchData';

const SearchHotelScreen = ({ route, navigation }: NativeStackScreenProps<RootStackParamList, 'SearchHotel'>) => {
  const { locationName } = route.params;
    console.log("You are in :", locationName);

    return (
    <View>
      <Provider store={store}>
        <SearchData
          locationName={locationName} 
          navigation={navigation}/>
      </Provider>
    </View>
  )
}

export default SearchHotelScreen;

const styles = StyleSheet.create({})
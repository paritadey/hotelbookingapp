import { StyleSheet, TouchableOpacity, Image, View, Dimensions, Alert, Text, Button, ImageBackground, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigator'
import { ApiResponse, Data } from '../hotelDetails/type';
import { fetchHotelDetails } from '../hotelDetails/apiService';
import { DisplayData } from "../hotelDetails/DisplayData";
import AddressModal from './AddressModal';
import { database } from '../firebaseConfig'; 
import { ref, set } from 'firebase/database';
import { CommonActions } from '@react-navigation/native';
import { RootState } from '../authentication/store';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons'; 


const HotelDetails = ({ route, navigation }: NativeStackScreenProps<RootStackParamList, 'HotelScreen'>) => {
  const { hotelId, checkIn, checkOut, rooms, adults, currencyCode, priceDetails, priceForDisplay, strikethroughPrice } = route.params;
  console.log("Hotel Id to search:", hotelId, checkIn, checkOut, rooms, adults, currencyCode, priceDetails, priceForDisplay, strikethroughPrice);
  const [data, setData] = useState<ApiResponse>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  let displayDataInstance: DisplayData;
  const [isModalVisible, setModalVisible] = useState(false);
  let latitude: number;
  let longitude: number;
  let time:number;
  const toggleModal = async(latitude:number, longitude:number, hotelName:string, hotelAddress:string, summary:string, amenities:string[]) => {
    setModalVisible(!isModalVisible);
    if(isModalVisible){
      console.log("recent search: ", latitude, longitude, hotelAddress, hotelName, hotelId, summary, amenities);
      const userRef = ref(database, 'recentSearch/' +user?.name.replace(' ','').trim()+'/'+ "TraV_Search"+hotelId);
      await set(userRef, {
        user: user?.name.replace(' ','').trim(),
        hotelId:hotelId,
        hotelName: hotelName,
        hotelAddress: hotelAddress,
        currencyCode: currencyCode,
        latitude: latitude,
        longitude: longitude,
        summary: summary,
        amenities: amenities     
      });  
    }
  };
  const user = useSelector((state: RootState) => state.auth.user);
  console.log("User data:", user?.email);

  useEffect(() => {
    const loadHotelDetails = async () => {
      try {
        setLoading(true);
        const hotelData = await fetchHotelDetails(hotelId.toString(),
          checkIn.toString(),
          checkOut.toString(),
          rooms.toString(),
          adults.toString(),
          currencyCode.toString());
        setData(hotelData);
      } catch (err) {
        setError('Failed to fetch hotel details.'); // Handle error gracefully
        Alert.alert('Error', 'Failed to fetch hotel details.'); // Show error to user
      } finally {
        setLoading(false);
      }
    };

    loadHotelDetails();
  }, [hotelId.toString,
  checkIn.toString(),
  checkOut.toString(),
  rooms.toString(),
  adults.toString(),
  currencyCode.toString()]);

  const handleBackPress = () => {
    navigation.goBack();
  }

  const handleReserve = async (hotelName: string, hotelAddress: string, checkIn: string,
    checkOut: string, currencyCode: string, priceForDisplay: string, rooms: string, adults:
      string, longitude: number, latitude: number, summary: string, amenities: string[]) => {
    try {
      time = Date.now();
      const userRef = ref(database, 'hotelBooking/' +user?.name.replace(' ','').trim()+'/'+ "TraV_"+time);
      showLocalNotification(hotelName, checkIn, checkOut);
      // Setting data in the database
      await set(userRef, {
        user: user?.name.replace(' ','').trim(),
        bookingId:"TraV_"+time,
        timeStamp:Date.now(),
        hotelName: hotelName,
        hotelAddress: hotelAddress,
        checkIn: checkIn,
        checkOut: checkOut,
        currencyCode: currencyCode,
        price: priceForDisplay,
        roomsToBook: rooms,
        adults: adults,
        latitude: latitude,
        longitude: longitude,
        summary: summary,
        amenities: amenities     
      });

      console.log("Data saved successfully!");
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Dashboard' }],
        })
      )
    } catch (error) {
      console.error('Error storing data: ', error);
      Alert.alert('Error', 'Could not store data');
    }
  }

  const showLocalNotification = (hotelName: string, checkIn: string, checkOut: string) => {
    console.log("Inside showLocalNotification");
  };

  //  console.log("Hotel Details:", data);

  const displayHotel = () => {
    if (data != null) {
      displayDataInstance = new DisplayData(data);
      // Use the instance
      const geoPoints = displayDataInstance.getGeoCode()
      latitude = geoPoints[0];
      longitude = geoPoints[1];

      return (
        <View style={styles.container}>
          <View style={styles.blackSelection}>
            <ImageBackground
              source={{ uri: 'https://i.pinimg.com/736x/0c/a8/8d/0ca88d0c8b63a9d0589ab61211e36e6f.jpg' }}
              style={styles.image}
              resizeMode='cover'>
              <View style={styles.header}>
                <TouchableOpacity onPress={handleBackPress}>
                <Icon name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>toggleModal(latitude, longitude, displayDataInstance.title, displayDataInstance.location.address,displayDataInstance.getSummary(),displayDataInstance.getAmenitiesList())}>
                  <Text style={styles.text}>{displayDataInstance.title}</Text>
                </TouchableOpacity>
                <AddressModal isVisible={isModalVisible} latitude={latitude} longitude={longitude} hotelAddress={displayDataInstance.location.address} hotelName={displayDataInstance.title} 
                onClose={()=>toggleModal(latitude, longitude, displayDataInstance.title, displayDataInstance.location.address,displayDataInstance.getSummary(),displayDataInstance.getAmenitiesList())} />

              </View>
              <View style={styles.card}>
                <ScrollView>
                  <Text style={styles.subText}> ★ {displayDataInstance.rankingDetails.replace('#', '').replace('<a>', '').replace('</a>', '')}</Text>
                  <Text style={styles.subText}> ℹ️ About Hotel: {displayDataInstance.getSummary()}</Text>
                  <Text style={styles.subText}> 🌐 Amenities: {displayDataInstance.getAmenitiesList()}</Text>
                  <Text style={styles.subText}> ✔️ Availability from: {checkIn} to {checkOut}</Text>
                  <Text style={styles.subText}> 🛏️ Number of Rooms: {rooms}</Text>
                  <Text style={styles.subText}> 👤 Number of Person: {adults}</Text>
                  <Text style={styles.subText}>{priceDetails} ⏰</Text>
                  <Text style={styles.subTextL2}> 📍 Address: {displayDataInstance.location.address}</Text>
                  <Text style={styles.subTextL1}>Amount to pay: {priceForDisplay} 💰</Text>
                  <TouchableOpacity style={[styles.button]} onPress={() => handleReserve(displayDataInstance.title, displayDataInstance.location.address, checkIn, checkOut, currencyCode, priceForDisplay, rooms, adults, longitude, latitude, displayDataInstance.getSummary(),
                    displayDataInstance.getAmenitiesList())}>
                    <Text style={styles.buttonText}>Reserve</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </ImageBackground>
          </View>
        </View>
      );
    }
  }


  return (
    <View>
      <View>
        {displayHotel()}
      </View>
    </View>
  )
}
export default HotelDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 16,
    marginTop: 24,
  },
  text: {
    width: Dimensions.get('window').width / 1.25,
    fontSize: 16,
    color: '#FFFFFF',
    paddingHorizontal: 24,
    fontFamily: 'PlusJakartaSans-ExtraBoldItalic'
  },
  subText: {
    width: '100%',
    fontSize: 14,
    color: '#000000',
    paddingVertical: 8,
    fontFamily: 'PlusJakartaSans-Italic-VariableFont_wght'
  },
  subTextL1: {
    width: '100%',
    fontSize: 16,
    color: '#000000',
    paddingVertical: 8,
    fontFamily: 'PlusJakartaSans-BoldItalic'
  },
  subTextL2: {
    width: '100%',
    fontSize: 16,
    color: '#000000',
    paddingVertical: 8,
    fontFamily: 'PlusJakartaSans-MediumItalic'
  },
  card: {
    backgroundColor: '#ffffff',       // Background color for the card
    padding: 20,                   // Padding inside the card
    marginVertical: Dimensions.get('window').height / 4,                   // Margin around the card
    borderRadius: 15,              // Rounded corners
    // Shadow properties for iOS
    shadowColor: '#000',
    height: Dimensions.get('window').height,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Elevation for Android
    elevation: 5,
  },
  blackSelection: {
    flex: 1.,
    backgroundColor: '#FFFFFF',
  },
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 2,
  },
  button: {
    backgroundColor: '#d49cd0', // Lavender color
    borderRadius: 20, // Rounded corners
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginStart: 24,
    marginEnd: 24,
    marginTop: 24,
    marginBottom: 64,
  },
  buttonText: {
    color: '#000000', // White text color
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-BoldItalic',
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    height: '60%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '80%',
    borderRadius: 10,
  },

})
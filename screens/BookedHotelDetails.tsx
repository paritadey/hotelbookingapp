import { StyleSheet, TouchableOpacity, Alert, ImageBackground, View, Text, Dimensions, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigator'
import AddressModal from './AddressModal';
import { ref, remove } from 'firebase/database';
import { database } from '../firebaseConfig';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Notifications from '../notification/Notifications'


type Props = NativeStackScreenProps<RootStackParamList, 'BookedHotel'>;

const BookedHotelDetails: React.FC<Props> = ({ navigation, route }) => {
  const { booking } = route.params;
  console.log("The booking order details :", booking);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleBackPress = () => {
    navigation.goBack();
  }
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const isCheckInDateOld = (checkInDate: string): boolean => {
    const currentDate = new Date();
    const checkIn = new Date(checkInDate); // Convert checkIn string to a Date object

    return checkIn < currentDate; // Return true if checkIn is earlier than the current date
  };

  // Use the function to check if check-in is old
  const isOld = isCheckInDateOld(booking.checkIn);

  const handleCancelReservation = () => {
    if (isOld) {
      Alert.alert(
        "Cancelation",
        "You cannot cancel past booking.",
        [
          {
            text: "Ok",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert(
        "Cancelation",
        "Do you want to cancel the booking ?",
        [
          {
            text: "No",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          {
            text: "Yes",
            onPress: () => updateDatabase()
          }
        ],
        { cancelable: false }
      );
    }
  }

  const updateDatabase = async () => {
    try {
      const userRef = ref(database, '/hotelBooking/' + booking.user + '/' + booking.bookingId); // Use the `ref` function with the database and path
      // Remove the data
      await remove(userRef);
      console.log('Data deleted successfully.');
    } catch (error) {
      console.error('Error deleting data:', error);
    }
    showLocalCancelBookingNotification(booking.hotelName, booking.bookingId);
    navigation.goBack();
  }

  const showLocalCancelBookingNotification = async (hotelName: string, bookingId: string) => {
    console.log("Inside showLocalCancelBookingNotification");
    const reminderDate = new Date(Date.now() + 2 * 1000); // Schedule for 2 seconds from now
    Notifications.scheduleCancelNotification(reminderDate, hotelName, bookingId);
  };
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
            <TouchableOpacity onPress={toggleModal}>
              <Text style={styles.text}>{booking.hotelName}  🗺️</Text>
            </TouchableOpacity>
            <AddressModal isVisible={isModalVisible} latitude={booking.latitude} longitude={booking.longitude} hotelAddress={booking.hotelAddress} hotelName={booking.hotelName} onClose={toggleModal} />
          </View>
          <View style={styles.card}>
            <ScrollView>
              <Text style={styles.subText}> ℹ️ About Hotel: {booking.summary}</Text>
              <Text style={styles.subText}> 🌐 Amenities: {booking.amenities}</Text>
              <Text style={styles.subText}> ✔️ Booked from: {booking.checkIn} to {booking.checkOut}</Text>
              <Text style={styles.subText}> 🛏️ Number of Rooms: {booking.roomsToBook}</Text>
              <Text style={styles.subText}> 👤 Number of Person: {booking.adults}</Text>
              <Text style={styles.subTextL2}> 📍 Address: {booking.hotelAddress}</Text>
              <Text style={styles.subText}> Per Night Hotel Price : {booking.oneNightPrice} /-</Text>
              <Text style={styles.subTextL1}>Amount paid: ₹ {booking.price} /- 💰</Text>
              <TouchableOpacity style={[styles.button]} onPress={handleCancelReservation}>
                <Text style={styles.buttonText}>{isOld ? 'Past Reservation' : 'Cancel Reservation'} </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </ImageBackground>
      </View>
    </View>
  )
}
export default BookedHotelDetails;

const styles = StyleSheet.create({
  subText: {
    width: '100%',
    fontSize: 14,
    color: '#000000',
    paddingVertical: 8,
    fontFamily: 'PlusJakartaSans-Italic-VariableFont_wght'
  },
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  item: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 64,
  },
  blackSelection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 16,
    marginTop: 24,
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

  text: {
    width: Dimensions.get('window').width / 1.25,
    fontSize: 16,
    color: '#FFFFFF',
    paddingHorizontal: 24,
    fontFamily: 'PlusJakartaSans-ExtraBoldItalic'
  },
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 2,
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
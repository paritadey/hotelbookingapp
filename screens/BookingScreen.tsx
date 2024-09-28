import { StyleSheet, Text, View, ActivityIndicator, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { database } from '../firebaseConfig'; // adjust the path as needed
import { ref, onValue } from 'firebase/database';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigator'
import { RootState } from '../authentication/store';
import { useSelector } from 'react-redux';

export type BookingList = {
  user:string;
  bookingId:string;
  hotelName: string;
  hotelAddress: string;
  checkIn: string;
  checkOut: string;
  currencyCode: string;
  price: string;
  roomsToBook: string;
  adults: string;
  latitude: number;
  longitude: number;
  summary: string;
  amenities: string[];
  timeStamp:string;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Booking'>;

const BookingScreen :React.FC<Props> = ({ navigation, route }) => {
  const [data, setData] = useState<BookingList[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const user = useSelector((state: RootState) => state.auth.user);
  console.log("User data:", user?.email);

  useEffect(() => {
    const dataRef = ref(database, 'hotelBooking/'+user?.name.replace(' ', '').trim());
    // Set up a listener for changes in the data at this reference
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const data: Record<string, BookingList> = snapshot.val() || [];
      const bookingList = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }))
      setData(bookingList);
      setLoading(false);
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  const handleBookedHotelClick=(booking:BookingList)=>{
    console.log("Booked hotel details:", booking);
    navigation.navigate("BookedHotel", {booking})
  }
  const UserItem: React.FC<{ booking: BookingList }> = ({ booking }) => (
    <View>
      <View style={styles.itemContainer}>
        <TouchableOpacity onPress={()=>handleBookedHotelClick(booking)}>
        <Image source={{ uri: 'https://i.pinimg.com/564x/80/0a/f0/800af0101b474de67b3d36ea7cac4711.jpg' }} style={styles.image} />
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text style={styles.subtitle}>Your Booking is confirmed with {booking.hotelName}</Text>
          <Text style={styles.subText}>for price: {booking.price}</Text>
          <View style={styles.dateContainer}>
          <Text style={styles.checkIn}>Check-In {"\n"} {booking.checkIn}</Text>
          <Text style={styles.checkOut}>Check-Out {"\n"} {booking.checkOut}</Text>
        </View>

        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {data ? (
        <FlatList
          data={data}
          renderItem={({ item }) => <UserItem booking={item} />}
          keyExtractor={(item) => item.hotelName}
        />
      ) : (
        <Text>No data available</Text>
      )}
    </View>
  )
}
export default BookingScreen;
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
    paddingTop: 20,
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
  },
  itemContainer: {
    flexDirection: 'row', // Align items in a row
    alignItems: 'center',  // Center items vertically
    padding: 16,
    backgroundColor: '#ffffff',
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    elevation: 3, // Add shadow for Android
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'PlusJakartaSans-Italic-VariableFont_wght',
    color: '#000000',

  },
  subtitle: {
    fontSize: 16,
    color: '#777',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Center items vertically
  },
  checkIn: {
    flex: 1, // Allows the check-in text to take up remaining space
    fontSize: 14,
    color: '#000000',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  checkOut: {
    flex: 1, // Allows the check-out text to take up remaining space
    fontSize: 14,
    color: '#000000',
    fontFamily: 'PlusJakartaSans-SemiBold',
    textAlign: 'right', // Align the check-out text to the right
  },

})
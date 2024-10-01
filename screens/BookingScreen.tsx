import { StyleSheet, Text, View, ActivityIndicator, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { database } from '../firebaseConfig'; // adjust the path as needed
import { ref, onValue, query, orderByChild } from 'firebase/database';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigator'
import { RootState } from '../authentication/store';
import { useSelector } from 'react-redux';

export type BookingList = {
  user: string;
  bookingId: string;
  hotelName: string;
  hotelAddress: string;
  checkIn: string;
  checkOut: string;
  currencyCode: string;
  oneNightPrice: string;
  price: string;
  roomsToBook: string;
  adults: string;
  latitude: number;
  longitude: number;
  summary: string;
  amenities: string[];
  timeStamp: string;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Booking'>;

const BookingScreen: React.FC<Props> = ({ navigation, route }) => {
  const [data, setData] = useState<BookingList[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const user = useSelector((state: RootState) => state.auth.user);
  console.log("User data:", user?.email);

  useEffect(() => {
    // const dataRef = ref(database, 'hotelBooking/'+user?.name.replace(' ', '').trim());
    const dataRef = query(
      ref(database, 'hotelBooking/' + user?.name.replace(' ', '').trim()),
      orderByChild('timeStamp') // Sort by 'checkIn' date
    );

    // Set up a listener for changes in the data at this reference
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const data: Record<string, BookingList> = snapshot.val() || [];
      const bookingList = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }))
      setData(bookingList.reverse());
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
  const handleBookedHotelClick = (booking: BookingList) => {
    console.log("Booked hotel details:", booking);
    navigation.navigate("BookedHotel", { booking })
  }

  const UserItem: React.FC<{ booking: BookingList }> = ({ booking }) => {

    // Function to check if the checkIn date is in the past
    const isCheckInDateOld = (checkInDate: string): boolean => {
      const currentDate = new Date();
      const checkIn = new Date(checkInDate); // Convert checkIn string to a Date object

      return checkIn < currentDate; // Return true if checkIn is earlier than the current date
    };

    // Use the function to check if check-in is old
    const isOld = isCheckInDateOld(booking.checkIn);

    return (
      <View>
        <TouchableOpacity onPress={() => handleBookedHotelClick(booking)} style={styles.touchable}>
          <View style={styles.itemContainer}>
            <Image
              source={{ uri: 'https://i.pinimg.com/564x/80/0a/f0/800af0101b474de67b3d36ea7cac4711.jpg' }}
              style={styles.image}
            />
            <View style={styles.textContainer}>
              <Text style={styles.subtitle}>Your Booking is confirmed with {booking.hotelName}</Text>
              <Text style={styles.subText}>Amount paid: ₹ {booking.price} /-</Text>
              {isOld ? (
                <View style={styles.line} />
              ) : (<View style={styles.greenLine} />
              )}
              <View style={styles.dateContainer}>
                <Text style={styles.checkIn}>
                  Check-In {"\n"} {booking.checkIn} {isOld ? '(Past)' : '(Upcoming)'}
                </Text>
                <Text>➡️</Text>
                <Text style={styles.checkOut}>
                  Check-Out {"\n"} {booking.checkOut}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {data ? (
        <FlatList
          data={data}
          renderItem={({ item }) => <UserItem booking={item} />}
          keyExtractor={(item) => item.hotelName}
        />
      ) : (
        <Text style={styles.noData}>No data available. You have not booked any hotels yet!</Text>
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
  touchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noData: {
    width: '100%',
    fontSize: 16,
    color: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 24,
    fontFamily: 'PlusJakartaSans-MediumItalic'
  },
  line: {
    height: 4, // Line thickness
    backgroundColor: 'red', // Line color
  },
  greenLine: {
    height: 4, // Line thickness
    backgroundColor: 'green', // Line color
  }
})
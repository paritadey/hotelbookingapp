import { ImageBackground, StyleSheet, Text, View, Dimensions, TouchableOpacity, FlatList, Image, ActivityIndicator, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import GetLocation, { Location, LocationErrorCode, isLocationError, } from 'react-native-get-location'
import Geocoder from 'react-native-geocoding';
import { Double } from 'react-native/Libraries/Types/CodegenTypes';
import { Key } from '../utils/GoogleKey';
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParamList } from '../AppNavigator'
import SearchBar from '../components/SearchBar';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHotelsRequest } from '../hotelList/action';
import { HotelState } from '../hotelList/reducer';
import { ThunkDispatch } from 'redux-thunk';
import { HotelActions } from '../hotelList/action';  // Your actions
import { Hotel, HotelListState } from '../hotelList/type';
import { database } from '../firebaseConfig'; // adjust the path as needed
import { ref, onValue } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type RecentSearch = {
  user: string;
  hotelId: string;
  hotelName: string;
  hotelAddress: string;
  currencyCode: string;
  latitude: number;
  longitude: number;
  summary: string;
  amenities: string[];

}
type Props = NativeStackScreenProps<RootStackParamList, 'Main'>;
type AppDispatch = ThunkDispatch<HotelState, any, HotelActions>;

Geocoder.init(Key); // Replace with the API Key

const MainScreen: React.FC<Props> = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const dispatchHotel: AppDispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<LocationErrorCode | null>(null);
  const [address, setAddress] = useState(String);
  let cityName: string = '';
  let hotelData: Hotel[];
  const hotelList = useSelector((state: HotelState) => state.hotelList);
  const hotelLoading = useSelector((state:HotelState)=>state.hotelLoading);
  const [recentSearchData, seRecentSearchData] = useState<RecentSearch[]>([]);
  const [loadingRecentSearch, setRecentSearchLoading] = useState<boolean>(true);
  useEffect(() => {
    const requestLocation = async () => {
      setLoading(true);
      setLocation(null);
      setError(null);

      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 30000,
        rationale: {
          title: 'Location permission',
          message: 'The app needs the permission to request your location.',
          buttonPositive: 'Ok',
        },
      })
        .then(newLocation => {
          setLoading(false);
          setLocation(newLocation);
          getAddress(newLocation.latitude, newLocation.longitude)
        })
        .catch(ex => {
          if (isLocationError(ex)) {
            const { code, message } = ex;
            console.warn(code, message);
            setError(code);
          } else {
            console.warn(ex);
          }
          setLoading(false);
          setLocation(null);
          getAddress(0, 0)
        });
    };
    requestLocation()
  }, []);

  //get the address from latitude/longitude
  const getAddress = async (latitude: Double, longitude: Double) => {
    try {
      const response = await Geocoder.from(latitude, longitude);
      const addressComponent = response.results[0].formatted_address;
      setAddress(addressComponent);
      cityName = getCityFromFormattedAddress(addressComponent) || 'Unknown City';
      console.log("City name:", cityName);
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const getCityFromFormattedAddress = (formattedAddress: string): string | null => {
    // Split the address by commas
    const addressParts = formattedAddress.split(',');
    //console.log("addressParts:", addressParts, addressParts.length);

    // If the length is sufficient to contain city, return the second part (which is usually the city)
    if (addressParts.length - 3 >= 3) {
      // Trim to remove any extra spaces and return the city
      // console.log("City part we get: ", addressParts[addressParts.length-3].trim());
      return addressParts[addressParts.length - 3].trim();
    }

    // If the format is unexpected, return null
    return null;
  };

  const fetchUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      const jsonData = userData != null ? JSON.parse(userData) : null;
      console.log("User Data in Main screen: ", jsonData.name);
      const dataRef = ref(database, 'recentSearch/' + jsonData.name.replace(' ', '').trim());
      const unsubscribe = onValue(dataRef, (snapshot) => {
        const data: Record<string, RecentSearch> = snapshot.val() || [];
        const recentSearchList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }))
        seRecentSearchData(recentSearchList);
        setRecentSearchLoading(false);
      });

      // Cleanup the listener when the component unmounts
      return () => unsubscribe();
    } catch (error) {
      console.error('Error fetching user data:', error);
      return 'Error fetching data'; // Return an error message string
    }
  }

  useEffect(() => {
    fetchUserData();
  }, []);


  useEffect(() => {
    const timer = setTimeout(() => {
      if (cityName != "Unknown City") {
        dispatchHotel(fetchHotelsRequest(cityName));
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [cityName, dispatch]);


  const navigateToHotelItemScreen = (hotel: Hotel) => {
    navigation.navigate('HotelItemScreen', { hotel });
  };

  if(hotelLoading){
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  const showNearByFlatList = () => {
    if (hotelList != null) {
      //  console.log("Hotel list:", hotelList);
      // Access the results
      const results: Hotel[] = JSON.parse(JSON.stringify(hotelList)).results;
      //  console.log("result in main screen:", results);
      const hotelNames = results.map((hotel) => hotel.formatted_address);
      // console.log("Hotel names nearby: ", hotelNames);          
      if (Array.isArray(results)) {
        //console.log("inside array function:", results.length);
        hotelData = results.map((hotel: any) => ({
          place_id: hotel.place_id,
          business_status: hotel.business_status,
          formatted_address: hotel.formatted_address,
          icon: hotel.icon,
          rating: hotel.rating,
          photos: hotel.photos,
          types: hotel.types,
          name: hotel.name,
        }));
        //console.log("Finalized data: ", hotelData);
      }
    }
    return (
      <View>{}
        <FlatList
          data={hotelData}
          renderItem={({ item }) =>
            <View>
              <View style={[styles.cardItem, styles.cardItemElevated]}>
                <TouchableOpacity onPress={() => navigateToHotelItemScreen(item)}>
                  <Image source={{ uri: 'https://i.pinimg.com/564x/40/4b/8c/404b8c70135db5f5d896fca01ace09cc.jpg' }}
                    style={styles.cardItemImage} />
                </TouchableOpacity>
                <View style={styles.cardItemBody}>
                  <Text style={styles.cardItemTitle}>{item.name}</Text>
                </View>
              </View>
            </View>
          }
          keyExtractor={(item) => item.place_id}
          horizontal // Set to true for horizontal scrolling
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  }

  const handleSearchPress = (address: string) => {
    const locationName = getCityFromFormattedAddress(address);
    console.log("City name inside handleSearch:", cityName);
    if (locationName !== null) {
      navigation.navigate('SearchHotel', { locationName }); // or any other screen name
    }
  }

  const UserSearchItem: React.FC<{ search: RecentSearch }> = ({ search }) => (
    <View>
      <View style={[styles.cardItem, styles.cardItemElevated]}>
        <Image source={{ uri: 'https://i.pinimg.com/564x/c1/a6/93/c1a693d453eb0c6d4f0efea500dcc1f8.jpg' }} style={styles.cardItemImage} />
        <View style={styles.cardItemBody}>
          <Text style={styles.cardItemTitle}>{search.hotelName}</Text>
        </View>
      </View>
    </View>
  );

  const showRecentSearch = (recentSearchData: RecentSearch[]) => {
    if (recentSearchData != null) {
      return (
        <View>
          <Text style={styles.recentSearch}>Recent Search</Text>
          <FlatList
            data={recentSearchData}
            renderItem={({ item }) => <UserSearchItem search={item} />}
            keyExtractor={(item) => item.hotelId}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      );
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.blackSelection}>
        <ScrollView
          showsVerticalScrollIndicator={false}>
          <ImageBackground
            source={{ uri: 'https://i.pinimg.com/564x/d7/cd/e5/d7cde59fd45fa298763c24c1e6ad7f0b.jpg' }}
            style={styles.image}
            resizeMode='cover'>
            <Text style={styles.text}>Location</Text>
            {address ? (
              <Text style={styles.location} numberOfLines={2}>{address}</Text>
            ) : null}
            {error ? <Text style={styles.error} numberOfLines={1}>Error: {error}</Text> : null}
            <View>
              {address ? (
                <SearchBar
                  text="Look for home stay"
                  imageSource={require('../assets/ic_search_symbol.png')}
                  onPress={() => handleSearchPress(address)} />
              ) : null}

            </View>
            <View style={styles.card}>
              <Text style={styles.nearbyText}>Nearby Hotels</Text>
              {showNearByFlatList()}
              <View>
                {recentSearchData ? (showRecentSearch(recentSearchData)) : null}
              </View>
            </View>
          </ImageBackground>
        </ScrollView>

      </View>
    </View>
  )
}

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blackSelection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  whiteSelection: {
    flex: 6.5,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 24,
    fontSize: 16,
    paddingHorizontal: 24,
    color: '#FFFFFF',
    fontFamily: 'PlusJakartaSans-ExtraBold'
  },
  location: {
    width: Dimensions.get('window').width,
    color: '#FFFFFF',
    marginTop: 4,
    paddingHorizontal: 24,
    fontFamily: 'PlusJakartaSans-ExtraBold'
  },
  error: {
    width: 250,
    color: 'red',
    marginTop: 4,
    fontFamily: 'PlusJakartaSans-Italic-VariableFont_wght'
  },
  nearbyText: {
    width: Dimensions.get('window').width,
    color: '#000000',
    marginTop: 4,
    fontSize: 16,
    paddingHorizontal: 24,
    fontFamily: 'PlusJakartaSans-ExtraBold'
  },
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  card: {
    backgroundColor: '#ffffff',       // Background color for the card
    padding: 20,                   // Padding inside the card
    marginVertical: Dimensions.get('window').height / 9,                   // Margin around the card
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
  itemContainer: {
    justifyContent: 'flex-end',
    borderRadius: 5,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cardItem: {
    width: 180,
    height: 180,
    borderRadius: 6,
    marginHorizontal: 8,
    marginVertical: 12,
  },
  cardItemElevated: {
    backgroundColor: '#FFFFFF',
    elevation: 5,
    shadowOffset: {
      width: 1,
      height: 1
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,

  },
  cardItemImage: {
    height: 120,
    marginBottom: 8,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    alignItems: 'center',
  },
  cardItemBody: {
    flex: 1,
    flexGrow: 1,
    paddingHorizontal: 12,
    marginRight: 15, // Space between items
  },
  cardItemTitle: {
    color: '#000000',
    fontSize: 16,
    marginBottom: 4,
    fontFamily: 'PlusJakartaSans-MediumItalic'
  },
  recentSearch: {
    width: Dimensions.get('window').width,
    color: '#828082',
    marginTop: 14,
    fontSize: 16,
    paddingHorizontal: 24,
    fontFamily: 'PlusJakartaSans-ExtraBold'
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
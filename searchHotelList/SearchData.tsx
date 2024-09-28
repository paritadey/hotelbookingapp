import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, FlatList, Alert, Button, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ThunkDispatch } from 'redux-thunk';
import { Location } from '../locationCode/type';
import { LocationIdActions } from '../locationCode/action';
import { useSelector, useDispatch, Provider } from 'react-redux';
import { CityIdState } from '../locationCode/reducer';
import { fetchLOCIdRequest } from '../locationCode/action';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigator'
import { Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { fetchSearchHotelListRequest } from '../searchHotelList/action';
import store, { RootState } from '../searchHotelList/store';
import SearchList from './SearchList';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import IconFilter from 'react-native-vector-icons/FontAwesome'; // Import the desired icon set


type Props = {
  locationName: string;
  navigation: NativeStackNavigationProp<RootStackParamList, 'SearchHotel'>;
};
type AppDispatch = ThunkDispatch<Location, any, LocationIdActions>;

interface City {
  id: string;
  name: string;
  imageUrl: string;
}

const cities: City[] = [
  { id: '1', name: 'Mumbai', imageUrl: 'https://i.pinimg.com/564x/a5/69/20/a56920741d698ae3b98d82246dd97dd6.jpg' },
  { id: '2', name: 'Bangalore', imageUrl: 'https://i.pinimg.com/564x/f8/44/90/f84490933229af9aec3c0d1b8fb86f18.jpg' },
  { id: '3', name: 'Chennai', imageUrl: 'https://i.pinimg.com/564x/ea/9c/75/ea9c75235bad92d424b5e4c8c1a6bd0b.jpg' },
  { id: '4', name: 'Delhi', imageUrl: 'https://i.pinimg.com/564x/2c/bd/c0/2cbdc08438e916fc4613cb5b2406ce1a.jpg' },
  { id: '5', name: 'Hyderabad', imageUrl: 'https://i.pinimg.com/564x/a3/e6/5c/a3e65c9aa010fd836fd6fcddacaca37f.jpg' },
  { id: '6', name: 'Kolkata', imageUrl: 'https://i.pinimg.com/564x/04/56/1f/04561f93dbd46a3847fc078d014941cf.jpg' },
  { id: '7', name: 'Jaipur', imageUrl: 'https://i.pinimg.com/564x/eb/35/2d/eb352d38771ba63ecd75e2f2f4a8a694.jpg' },
  { id: '8', name: 'Pune', imageUrl: 'https://i.pinimg.com/564x/05/96/8f/05968f32e9151fc5053f3c03e4e0af5b.jpg' },
  { id: '9', name: 'Lucknow', imageUrl: 'https://i.pinimg.com/564x/0f/41/7c/0f417c0ba97ca4a69c65e31705a7d942.jpg' },
  { id: '10', name: 'Gurgaon', imageUrl: 'https://i.pinimg.com/564x/3f/33/35/3f33356ab910a42e0eba7fa5bbe8e69e.jpg' },
];


const SearchData: React.FC<Props> = ({ locationName, navigation }) => {
  console.log("location name is search data:", locationName);

  const [showCities, setShowCities] = useState(false); // Controls visibility of the city list
  const [selectedCity, setSelectedCity] = useState<string | null>(null); // Holds the selected city

  const [showCard, setShowCard] = useState(false);

  // State to store values of 5 TextInputs
  const [inputValues, setInputValues] = useState({
    geoId: '',
    checkIn: '',
    checkOut: '',
    currencyCode: '',
    priceMin: '',
    priceMax: '',
    roomNumber: '',
    adult: '',
  });

  const [mCheckInDate, setCheckInDate] = useState<Date>(new Date()); // State to hold the selected date
  const [mShowCheckInPicker, setShowCheckInPicker] = useState(false); // State to control visibility of Date Picker


  const [mCheckOutDate, setCheckOutDate] = useState<Date>(new Date()); // State to hold the selected date
  const [mShowCheckOutPicker, setShowCheckOutPicker] = useState(false); // State to control visibility of Date Picker

  const [condition, setCondition] = useState(false);

  const dispatch: AppDispatch = useDispatch();
  let locationData: Location[];

  useEffect(() => {
    dispatch(fetchLOCIdRequest(locationName));
  }, [dispatch]);


  const fetchChangedCityLOCData = () => {
    if (selectedCity != null) {
      console.log("Selected city: ", selectedCity);
      dispatch(fetchLOCIdRequest(selectedCity)); // Dispatch the action with selectedCity
    }
  };

  const selectLocationId = useSelector((state: CityIdState) => state.data);
  console.log("Location GEOId in search screen:", selectLocationId?.data);
  const results = JSON.parse(JSON.stringify(selectLocationId));
  if (results != null) {
    console.log("Go inside");
    locationData = results.data[0].geoId
    console.log("Location geoId:", locationData);
    inputValues.geoId = results.data[0].geoId;//"304558";
    console.log("geoid:", inputValues.geoId);
  }

  const convertDateFormat = (dateString: string): string => {
    // Split the input date string by '/'
    const [day, month, year] = dateString.split('/');

    // Convert day and month to two-digit format using padStart
    const formattedDay = day.padStart(2, '0');
    const formattedMonth = month.padStart(2, '0');

    // Return the date in 'YYYY-MM-DD' format
    return `${year}-${formattedMonth}-${formattedDay}`;
  };

  const initiateSearchHotel = () => {

    return (
      <View>
        <Provider store={store}>
          <SearchList
            geoId={inputValues.geoId}
            checkIn={convertDateFormat(inputValues.checkIn)}
            checkOut={convertDateFormat(inputValues.checkOut)}
            adults={inputValues.adult}
            currencyCode={inputValues.currencyCode.toUpperCase().trim()}
            priceMax={inputValues.priceMax.trim()}
            priceMin={inputValues.priceMin.trim()}
            rooms={inputValues.roomNumber.trim()}
            navigation={navigation} />
        </Provider>
      </View>
    );

  }

  const selectCity = (city: string) => {
    setSelectedCity(city); // Sets the selected city
    setShowCities(false); // Hides the city list
  };

  const renderCityItem = ({ item }: { item: City }) => (
    <TouchableOpacity style={styles.cityItem} onPress={() => selectCity(item.name)}>
      <Image source={{ uri: item.imageUrl }} style={styles.cityImage} />
      <Text style={styles.cityName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const toggleCard = () => {
    setShowCard(!showCard); // Toggle card visibility
  };

  // Handle Apply Button Click: Log input values and hide the card
  const handleApply = () => {
    // Perform your actions here (like logging or sending the data)
    Alert.alert('Input Values', JSON.stringify(inputValues));
    // Hide the card
    setShowCard(false);
    setCondition(true);
  };

  // Update the text input values
  const handleInputChange = (key: string, value: string) => {
    setInputValues({
      ...inputValues,
      [key]: value,
    });
  };

  const showCheckInDatePicker = () => {
    setShowCheckInPicker(true);
  };

  const showCheckOutDatePicker = () => {
    setShowCheckOutPicker(true);
  };

  // Handle the date change when a new date is selected
  const onCheckInDateChange = (event: any, selectedDate?: Date) => {
    setShowCheckInPicker(Platform.OS === 'ios'); // Keep picker open on iOS, close on other platforms
    if (selectedDate) {
      setCheckInDate(selectedDate); // Set the selected date
    }
  };

  const onCheckOutDateChange = (event: any, selectedDate?: Date) => {
    setShowCheckOutPicker(Platform.OS === 'ios'); // Keep picker open on iOS, close on other platforms
    if (selectedDate) {
      setCheckOutDate(selectedDate); // Set the selected date
    }
  };

  // Format the selected date to a string
  const getFormattedCheckInDate = (): string => {
    inputValues.checkIn = mCheckInDate.toLocaleDateString();
    return mCheckInDate.toLocaleDateString(); // Format date as mm/dd/yyyy
  };

  const getFormattedCheckOutDate = (): string => {
    inputValues.checkOut = mCheckOutDate.toLocaleDateString();
    return mCheckOutDate.toLocaleDateString(); // Format date as mm/dd/yyyy
  };

  const handleChangeLocation = () => {
    setShowCities(!showCities); // Toggles the city list visibility
  }
  const handleBackPress = () => {
    navigation.goBack();
  }
  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress}>
        <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={fetchChangedCityLOCData}>
          <Text style={styles.text}>{selectedCity ? `You are in : ${selectedCity}` : `You are in : ${locationName}`}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleCard}>
        <IconFilter name="filter" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={handleChangeLocation}>
          <Text style={styles.textChange}>Change ?</Text>
        </TouchableOpacity>
        {showCities && (
          <FlatList
            data={cities}
            renderItem={renderCityItem}
            keyExtractor={(item) => item.id}
            numColumns={2} // Display items in two columns (grid view)
            style={styles.grid}
          />
        )}
      </View>
      <View>
        {showCard && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Choose Filters</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Check-in Date"
              placeholderTextColor='#ccc'
              value={getFormattedCheckInDate()} // Display the selected date
              onFocus={showCheckInDatePicker} // Open the date picker on input focus
              showSoftInputOnFocus={false} // Disable keyboard on focus
              onChangeText={(text) => handleInputChange('checkInDate', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Check-out Date"
              placeholderTextColor='#ccc'
              value={getFormattedCheckOutDate()} // Display the selected date
              onFocus={showCheckOutDatePicker} // Open the date picker on input focus
              showSoftInputOnFocus={false} // Disable keyboard on focus
              onChangeText={(text) => handleInputChange('checkOutDate', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Currency Code"
              placeholderTextColor='#ccc'
              value={inputValues.currencyCode}
              autoCapitalize="characters" // Automatically capitalizes the input
              onChangeText={(text) => handleInputChange('currencyCode', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Minimum Price"
              value={inputValues.priceMin}
              placeholderTextColor='#ccc'
              keyboardType="numeric" // Use numeric keyboard for input
              onChangeText={(text) => handleInputChange('priceMin', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Maximum Price"
              placeholderTextColor='#ccc'
              keyboardType="numeric" // Use numeric keyboard for input
              value={inputValues.priceMax}
              onChangeText={(text) => handleInputChange('priceMax', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Room"
              placeholderTextColor='#ccc'
              keyboardType="numeric" // Use numeric keyboard for input
              value={inputValues.roomNumber}
              onChangeText={(text) => handleInputChange('roomNumber', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter number of Adults"
              placeholderTextColor='#ccc'
              keyboardType="numeric" // Use numeric keyboard for input
              value={inputValues.adult}
              onChangeText={(text) => handleInputChange('adult', text)}
            />
            <TouchableOpacity style={[styles.button]} onPress={handleApply}>
              <Text style={styles.buttonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View>
        {mShowCheckInPicker && (
          <DateTimePicker
            value={mCheckInDate} // Pass the current date as the initial date
            mode="date" // Mode is 'date' to show the date picker
            display="default" // Default display style (change to 'spinner' for a different style)
            onChange={onCheckInDateChange} // Handle date selection
            minimumDate={new Date()} // Optional: restrict selection to current or past dates
          />
        )}
      </View>
      <View>
        {mShowCheckOutPicker && (
          <DateTimePicker
            value={mCheckOutDate} // Pass the current date as the initial date
            mode="date" // Mode is 'date' to show the date picker
            display="default" // Default display style (change to 'spinner' for a different style)
            onChange={onCheckOutDateChange} // Handle date selection
            minimumDate={new Date()} // Optional: restrict selection to current or past dates
          />
        )}
      </View>
      <View>{
        condition ? (
          initiateSearchHotel()
        ) : <Text>Issue</Text>}
      </View>
    </View>
  );
}

export default SearchData;

const styles = StyleSheet.create({
  header: {
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 16,
    marginTop: 24,
  },
  text: {
    width: Dimensions.get('window').width / 1.30,
    fontSize: 16,
    color: '#000000',
    paddingHorizontal: 24,
    fontFamily: 'PlusJakartaSans-SemiBoldItalic'
  },
  textChange: {
    width: 120,
    fontSize: 12,
    color: 'red',
    marginHorizontal: 36,
    paddingHorizontal: 20,
    fontFamily: 'PlusJakartaSans-SemiBoldItalic'
  },
  grid: {
    marginTop: 20,
    width: '100%',
    padding: 10,
    marginBottom: 90,
  },
  cityItem: {
    flex: 1,
    margin: 10,
    padding: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  cityName: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'PlusJakartaSans-Italic-VariableFont_wght',
  },
  cityImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  filter: {
    width: 30,
    height: 30,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    margin: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    color: '#000000',
    fontFamily: 'PlusJakartaSans-Italic-VariableFont_wght',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    color: '#000000',
    paddingHorizontal: 10,
    fontFamily: 'PlusJakartaSans-Italic-VariableFont_wght',
    width: Dimensions.get('window').width / 1.3,
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
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-BoldItalic',
  },

})
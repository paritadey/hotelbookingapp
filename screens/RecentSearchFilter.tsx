import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Dimensions, ScrollView, Alert } from 'react-native';
import IconFilter from 'react-native-vector-icons/FontAwesome'; // Import the desired icon set
import { Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSelector, useDispatch, } from 'react-redux';
import { fetchHotelRSRequest } from '../recentSearch/action';
import { NearByHotelState } from '../recentSearch/reducer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AddressModal from './AddressModal';
import { RecentSearch } from './MainScreen';
import ImageCard from '../components/ImageCard';
import { database } from '../firebaseConfig';
import { ref, set } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RecentSearchFilterProp {
    searchItem: RecentSearch;
    backPress: () => void;
    reserveClick: () => void;
}

const RecentSearchFilter: React.FC<RecentSearchFilterProp> = ({ searchItem, backPress, reserveClick }) => {
    const dispatchHotel = useDispatch();
    const [isModalVisible, setModalVisible] = useState(false);
    const [showCard, setShowCard] = useState(false);
    const [show, setShow] = useState(false);
    const searchData = useSelector((state: NearByHotelState) => state.dataItem);
    const loading = useSelector((state: NearByHotelState) => state.loading);
    let time: number;

    const handleLeftArrow = () => {
        backPress()
    }
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    }
    const toggleCard = () => {
        setShowCard(!showCard); // Toggle card visibility
    };

    const [inputValues, setInputValues] = useState({
        hotelId: '',
        checkIn: '',
        checkOut: '',
        currencyCode: '',
        roomNumber: '',
        adult: '',
    });
    const [mCheckInDate, setCheckInDate] = useState<Date>(new Date()); // State to hold the selected date
    const [mShowCheckInPicker, setShowCheckInPicker] = useState(false); // State to control visibility of Date Picker


    const [mCheckOutDate, setCheckOutDate] = useState<Date>(new Date()); // State to hold the selected date
    const [mShowCheckOutPicker, setShowCheckOutPicker] = useState(false); // State to control visibility of Date Picker

    const getFormattedCheckInDate = (): string => {
        inputValues.checkIn = mCheckInDate.toLocaleDateString();
        return mCheckInDate.toLocaleDateString(); // Format date as mm/dd/yyyy
    };

    const getFormattedCheckOutDate = (): string => {
        inputValues.checkOut = mCheckOutDate.toLocaleDateString();
        return mCheckOutDate.toLocaleDateString(); // Format date as mm/dd/yyyy
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

    const handleInputChange = (key: string, value: string) => {
        setInputValues({
            ...inputValues,
            [key]: value,
        });
    };
    const convertDateFormat = (dateString: string): string => {
        // Split the input date string by '/'
        const [day, month, year] = dateString.split('/');

        // Convert day and month to two-digit format using padStart
        const formattedDay = day.padStart(2, '0');
        const formattedMonth = month.padStart(2, '0');

        // Return the date in 'YYYY-MM-DD' format
        return `${year}-${formattedMonth}-${formattedDay}`;
    };


    const handleApply = () => {
        dispatchHotel(fetchHotelRSRequest(searchItem.hotelId, convertDateFormat(inputValues.checkIn).toString(),
            convertDateFormat(inputValues.checkOut).toString(), inputValues.currencyCode.toString(), inputValues.roomNumber.toString(), inputValues.adult.toString()));
        toggleCard();
    };

    if (loading) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }
    //console.log("Data fetched for recent search:", searchData);
    const calculateDaysBetween = (date1: string, date2: string): number | null => {
        const firstDate = new Date(date1);
        const secondDate = new Date(date2);
        // Ensure both dates are valid
        if (!isNaN(firstDate.getTime()) && !isNaN(secondDate.getTime())) {
            const timeDifference = secondDate.getTime() - firstDate.getTime();
            const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
            return Math.ceil(daysDifference);  // Return the calculated days
        } else {
            return 1;  // Return null if dates are invalid
        }
    };

    const handleReserve = async (totalPay: string) => {
        if (!isNaN(parseInt(totalPay))) {
            try {
                time = Date.now();
                const userData = await AsyncStorage.getItem('user');
                const jsonData = userData != null ? JSON.parse(userData) : null;
                console.log("User Data in RecentSearch screen: ", jsonData.name);

                const userRef = ref(database, 'hotelBooking/' + jsonData?.name.replace(' ', '').trim() + '/' + "TraV_" + time);
                // Setting data in the database
                await set(userRef, {
                    user: jsonData?.name.replace(' ', '').trim(),
                    bookingId: "TraV_" + time,
                    timeStamp: Date.now(),
                    hotelName: searchItem.hotelName,
                    hotelAddress: searchItem.hotelAddress,
                    checkIn: inputValues.checkIn,
                    checkOut: inputValues.checkOut,
                    currencyCode: inputValues.currencyCode,
                    oneNightPrice: searchItem.price,
                    price: totalPay,
                    roomsToBook: inputValues.roomNumber,
                    adults: inputValues.adult,
                    latitude: searchItem.latitude, 
                    longitude: searchItem.longitude,
                    summary: searchItem.summary,
                    amenities: searchItem.amenities
                });
                console.log("Data saved successfully!");
                reserveClick();
            } catch (error) {
                console.error('Error storing data: ', error);
                Alert.alert('Error', 'Could not store data');
            }
        } else {
            console.log("Data is invalid");
        }
    }
    const showHotelDetails = () => {
        const result = calculateDaysBetween(inputValues.checkIn, inputValues.checkOut) || 0;
        const totalPay = parseInt(searchItem.price.replace("₹", '').replace(",", '')) * parseInt(inputValues.roomNumber) * result;
        if (searchData != null) {
            return (
                <View>
                    <Text style={styles.subText}>✔️ Available from: {inputValues.checkIn} to {inputValues.checkOut}</Text>
                    <Text style={styles.price}>💰 Price per Room : {searchItem.price}</Text>
                    <Text style={styles.subTextL1}>💰 Total Price to Pay : ₹ {totalPay} /-</Text>
                    <TouchableOpacity style={[styles.button]} onPress={() => handleReserve(totalPay.toString())}>
                        <Text style={styles.buttonText}>Reserve</Text>
                    </TouchableOpacity>
                </View>);
        }
    }
    return (
        <ScrollView>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleLeftArrow}>
                    <Icon name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleModal}>
                    <Text style={styles.text}>{searchItem.hotelName}</Text>
                </TouchableOpacity>
                <AddressModal isVisible={isModalVisible}
                    latitude={searchItem.latitude} longitude={searchItem.longitude}
                    hotelAddress={searchItem.hotelAddress} hotelName={searchItem.hotelName}
                    onClose={toggleModal} />
                <TouchableOpacity onPress={toggleCard}>
                    <IconFilter name="filter" size={24} color="#000" />
                </TouchableOpacity>
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
            <View>
                <View style={styles.container}>
                    <View>
                        <ImageCard
                            hotelAddress={searchItem.hotelAddress}
                            summary={searchItem.summary}
                            amenities={searchItem.amenities} />
                    </View>
                    {showHotelDetails()}
                </View>
            </View>
        </ScrollView>
    );
}

export default RecentSearchFilter;

const styles = StyleSheet.create({
    container: {
        padding: 24,
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
        color: '#000000',
        paddingHorizontal: 24,
        fontFamily: 'PlusJakartaSans-ExtraBoldItalic'
    },
    subText: {
        width: '100%',
        fontSize: 14,
        color: '#000000',
        paddingVertical: 24,
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
    background: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
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
    price: {
        fontSize: 14,
        color: '#000000',
        paddingVertical: 8,
        fontFamily: 'PlusJakartaSans-Italic-VariableFont_wght'
    },
});  
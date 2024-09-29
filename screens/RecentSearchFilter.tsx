import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import { Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSelector, useDispatch, } from 'react-redux';
import { fetchHotelRSRequest } from '../recentSearch/action';
import { NearByHotelState } from '../recentSearch/reducer';
import { Data } from '../recentSearch/type';

interface CheckHotelAvailabilityBottomSheetProps {
    isVisible: boolean;
    hotelId: string;
    onClose: () => void;
    onApply: (data: Data, checkIn:string, checkOut:string, adult:String, rooms:string) => void;
}

const RecentSearchFilter: React.FC<CheckHotelAvailabilityBottomSheetProps> = ({ isVisible, hotelId, onClose, onApply }) => {
    const dispatchHotel = useDispatch();
    const searchData = useSelector((state: NearByHotelState) => state.dataItem);
    const loading = useSelector((state: NearByHotelState) => state.loading);

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
        dispatchHotel(fetchHotelRSRequest(hotelId, convertDateFormat(inputValues.checkIn).toString(),
            convertDateFormat(inputValues.checkOut).toString(), inputValues.currencyCode.toString(), inputValues.roomNumber.toString(), inputValues.adult.toString()));
       // console.log("Recent Search data availability: ", searchData);
        setTimeout(() => {
            if (searchData != null) {
                console.log("inside the if checking");
                onApply(searchData, inputValues.checkIn.toString(), inputValues.checkOut.toString(),
                 inputValues.roomNumber.toString(), inputValues.adult.toString());
            }
            onClose();
        }, 10000); // Delay for 10ms
    }
    if (loading) {
        return (
            <ActivityIndicator size="large" color="#0000ff" />
        );
    }

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            style={styles.modal}
            swipeDirection="down"
            onSwipeComplete={onClose}>
            <View style={styles.container}>
                <Text style={styles.title}>Choose Filter</Text>
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
                    <Text style={styles.buttonText}>Search</Text>
                </TouchableOpacity>
            </View>
            <View>
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
            </View>
        </Modal>
    );
}

export default RecentSearchFilter;

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    container: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        minHeight: 300,
    },
    title: {
        width: Dimensions.get('window').width / 1.1,
        fontSize: 16,
        color: '#000000',
        marginTop: 12,
        paddingVertical: 12,
        fontFamily: 'PlusJakartaSans-ExtraBoldItalic'
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 10,
        color: '#000000',
        paddingHorizontal: 10,
        fontFamily: 'PlusJakartaSans-Italic-VariableFont_wght',
        width: Dimensions.get('window').width / 1.1,
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

});  
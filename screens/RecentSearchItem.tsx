import { StyleSheet, Text, View, ScrollView, ImageBackground, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigator'
import Icon from 'react-native-vector-icons/MaterialIcons';
import AddressModal from './AddressModal';
import RecentSearchFilter from './RecentSearchFilter';
import { Provider } from 'react-redux';
import store from '../recentSearch/store';
import { Data } from '../recentSearch/type';
import { RecentSearch } from './MainScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'RecentSearch'>;

const RecentSearchItem: React.FC<Props> = ({ route, navigation }) => {
    const { searchItem } = route.params;
    console.log("Data passed for Recent Search: ", searchItem);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isFilterModalVisible, setFilterModalVisible] = useState(false);
    const [selectedData, setSelectedData] = useState<Data | null>(null);
    const [checkIn, setCheckInData] = useState('');
    const [checkOut, setCheckOutData] = useState('');
    const [room, setRoomData] = useState('');
    const [adult, setAdultData] = useState('');
  
    const handleBackPress = () => {
        navigation.goBack();
    }
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    }

    const toggleFilterModal = () => {
        setFilterModalVisible(!isFilterModalVisible);
    }

    const checkAvailability = () => {
        toggleFilterModal();
    }
    const handleApply = (data: Data,checkIn:string, checkOut:string, room:string, adult:string) => {
        setSelectedData(data); // Update the selected data
        setCheckInData(checkIn);
        setCheckOutData(checkOut);
        setRoomData(room);
        setAdultData(adult);
    };

    console.log("Data passed from RecentSearchFilter Modal to RecentSearchItem: ", selectedData, checkIn, checkIn, room, adult);

    const showHotelData = (data: Data) => {
        console.log("Data we have found: ", selectedData);
        if (selectedData != null) {
            return (
                <View>

                </View>
            );
        }
    }
    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.blackSelection}>
                    <ImageBackground
                        source={{ uri: 'https://i.pinimg.com/564x/d7/cd/e5/d7cde59fd45fa298763c24c1e6ad7f0b.jpg' }}
                        style={styles.background}
                        resizeMode='cover'>
                        <ImageBackground
                            source={{ uri: 'https://i.pinimg.com/736x/0c/a8/8d/0ca88d0c8b63a9d0589ab61211e36e6f.jpg' }}
                            style={styles.image}
                            resizeMode='cover'>

                            <View style={styles.header}>
                                <TouchableOpacity onPress={handleBackPress}>
                                    <Icon name="arrow-back" size={24} color="#000" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={toggleModal}>
                                    <Text style={styles.text}>{searchItem.hotelName}</Text>
                                </TouchableOpacity>
                                <AddressModal isVisible={isModalVisible} latitude={searchItem.latitude} longitude={searchItem.longitude} hotelAddress={searchItem.hotelAddress} hotelName={searchItem.hotelName}
                                    onClose={toggleModal} />
                            </View>
                            <View style={styles.card}>
                                <Text style={styles.subText}> ★ {searchItem.summary}</Text>
                                <Text style={styles.subText}> 🌐 Amenities: {searchItem.amenities}</Text>
                                <Text style={styles.subTextL2}> 📍 Address: {searchItem.hotelAddress}</Text>
                                <TouchableOpacity onPress={checkAvailability}>
                                    <Text style={styles.subText}>✔️ Check Availability</Text>
                                </TouchableOpacity>
                                <Provider store={store}>
                                    <RecentSearchFilter
                                        hotelId={searchItem.hotelId}
                                        isVisible={isFilterModalVisible}
                                        onApply={()=>handleApply}
                                        onClose={toggleFilterModal} />
                                </Provider>
                                {selectedData ? showHotelData(selectedData) : null}
                            </View>
                        </ImageBackground>
                    </ImageBackground>
                </View>
            </View>
        </ScrollView>
    );
}

export default RecentSearchItem;

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
        marginVertical: Dimensions.get('window').height / 6,                   // Margin around the card
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
    background: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    }

})
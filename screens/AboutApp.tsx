import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal';


interface AboutModalBottomSheetProps {
    isVisible: boolean;
    onClose: () => void;
}

const AboutApp: React.FC<AboutModalBottomSheetProps> = ({ isVisible, onClose }) => {
    const handleOkay =()=>{
        onClose();
    }
    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            style={styles.modal}
            swipeDirection="down"
            onSwipeComplete={onClose}
        >
            <View style={styles.container}>
                <Text style={styles.title}>About TravelStay</Text>
                <Text style = {styles.subText}>This is a React Native application for checking Hotel data in list format of our nearby places. 
                    This app searches current location and shows nearby hotels. User can book the hotel from the searched hotel list. 
                    We have a filter where user can provide all the details to search hotel, and choose from there. On Reserve hotel click,
                    the user can book the hotel. In the Booking tab, user can see all the booked hotel list.
                </Text>
                <Text style={styles.subText}>App Version :1.0.0</Text>
                <Text style={styles.subTextL1}> Developer : Parita Dey (paritadey@gmail.com)</Text>
                <TouchableOpacity style={[styles.button]} onPress={handleOkay}>
                    <Text style={styles.buttonText}>Ok</Text>
                </TouchableOpacity>

            </View>
        </Modal>
    );
}

export default AboutApp;

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
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#000000',
    },
  button: {
    backgroundColor: '#d49cd0', // Lavender color
    borderRadius: 20, // Rounded corners
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginStart:24,
    marginEnd:24,
    marginTop:24,
  },
  buttonText: {
    color: '#000000', // White text color
    fontSize: 16,
    fontFamily:'PlusJakartaSans-BoldItalic',
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
    fontSize: 10,
    color: '#000000',
    paddingVertical: 8,
    fontFamily: 'PlusJakartaSans-BoldItalic'
  },
})
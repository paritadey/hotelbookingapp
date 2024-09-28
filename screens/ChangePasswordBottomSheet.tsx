// ChangePasswordBottomSheet.tsx
import React from 'react';
import { View, TextInput, Button, Text, StyleSheet,Alert, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { resetPass } from '../authentication/authSlice';

interface ChangePasswordBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
}

const ChangePasswordBottomSheet: React.FC<ChangePasswordBottomSheetProps> = ({ isVisible, onClose }) => {
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const dispatch = useDispatch();

  const validatePassword = (password: string) => {
    return password.length >= 6; // Minimum 6 characters
  };

  const handleChangePassword = async() => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }
    if(!validatePassword(newPassword)){
      Alert.alert('Invalid password', 'Password must be at least 6 characters long.');
      return;
    }
    // Handle password change logic here
    console.log("Current Password:", currentPassword);
    console.log("New Password:", newPassword);

    const userData = await AsyncStorage.getItem('user'); //fetching data from AsyncStorage
    const jsonData =userData!=null?JSON.parse(userData):null;
    const jsonValue = JSON.stringify({email:jsonData.email, password:newPassword, phone:jsonData.phone, name:jsonData.name})
    await AsyncStorage.setItem('user', jsonValue); // Store the string
    dispatch(resetPass({ email:jsonData.email, password:newPassword, phone: jsonData.phone, name:jsonData.name }));
    onClose(); // Close the modal after submission
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={styles.modal}
      swipeDirection="down"
      onSwipeComplete={onClose}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Reset Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Current Password"
          placeholderTextColor='#ccc'
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry
          placeholderTextColor='#ccc'
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm New Password"
          secureTextEntry
          value={confirmPassword}
          placeholderTextColor='#ccc'
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity style={[styles.button]} onPress={handleChangePassword}>
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

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
    color:'#000000',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    color:'#000000',
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
});

export default ChangePasswordBottomSheet;

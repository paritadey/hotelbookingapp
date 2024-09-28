import { TouchableOpacity, StyleSheet, Dimensions, View, Alert, TextInput, ImageBackground, SafeAreaView, Text } from 'react-native'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParamList } from '../AppNavigator'
import { signUp } from '../authentication/authSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../authentication/store';
import AsyncStorage from '@react-native-async-storage/async-storage';


type OnboardingProps = NativeStackScreenProps<RootStackParamList, 'Onboarding'>

const OnboardingScreen = ({ navigation }: OnboardingProps) => {

  // const hasSignedUp = useSelector((state: RootState) => state.auth.hasSignedUp);
  // console.log("has signed up in Onboarding screen:", hasSignedUp);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const dispatch = useDispatch();

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6; // Minimum 6 characters
  };

  const validateName = (name: string) => {
    return name.length >= 6; // Minimum 6 characters
  };

  const validatePhoneNumber = (phone: string) => {
    const regex = /^[0-9]{10}$/; // Validates a 10-digit phone number
    return regex.test(phone);
  };

  const handleSignUp = async () => {
    if (!validateName(name)) {
      Alert.alert('Invalid name', 'Please enter a full name.');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return;
    }
    if (!validatePassword(password)) {
      Alert.alert('Invalid password', 'Password must be at least 6 characters long.');
      return;
    }
    if (!validatePhoneNumber(phone)) {
      Alert.alert('Invalid phone number', 'Please enter a valid 10-digit phone number.');
      return;
    }
    Alert.alert('SignUp successful', 'You have successfully signed up.');

    try {
      await AsyncStorage.setItem('hasSignedUp', 'true');
      const user = { email, password, phone, name };
      const jsonValue = JSON.stringify(user); // Convert the object to a string
      await AsyncStorage.setItem('user', jsonValue); // Store the string
      dispatch(signUp(user));
      navigation.replace('Dashboard');
    } catch (error) {
      console.error('Failed to save the data to the storage', error);
    }
  };

  const handleLogin = async () => {
    const hasSignedUp = await AsyncStorage.getItem('hasSignedUp');
    if (!hasSignedUp) {
      navigation.replace('Login');
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <ImageBackground
          source={{ uri: 'https://i.pinimg.com/564x/a9/c1/94/a9c194ee02e5cbc00017a1d2e51e1ad4.jpg' }} // image URL
          style={styles.image}
          imageStyle={styles.imageOpacity} // Apply opacity to the image
          resizeMode="cover">
          <Text style={styles.text}>Get Started</Text>
          <Text style={styles.subtext}>by creating an account</Text>
          <View style={styles.card}>
            <TextInput
              style={styles.input}
              placeholder="Enter Full Name"
              placeholderTextColor="#888"
              value={name}
              onChangeText={setName}></TextInput>
            <TextInput
              style={styles.input}
              placeholder="Enter Email address"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"></TextInput>
            <TextInput
              style={styles.input}
              placeholder="Enter Phone number"
              placeholderTextColor="#888"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"></TextInput>
            <TextInput
              style={styles.input}
              placeholder="Enter Password"
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry></TextInput>
            <View>
              <TouchableOpacity style={[styles.button]} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.textA}>Already have an account?
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.clickableText}>Log in</Text>
              </TouchableOpacity>
            </Text>

          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  )
}
export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,

  },
  imageOpacity: {
    opacity: 0.7, // Set the opacity level here
  },
  text: {
    marginTop: 64,
    textAlign: 'center',
    width: '85%',
    marginHorizontal: 24,
    color: '#000000',
    fontSize: 34,
    fontFamily: 'PlusJakartaSans-BoldItalic',
  },
  subtext: {
    textAlign: 'center',
    width: '85%',
    marginHorizontal: 24,
    color: '#000000',
    fontSize: 10,
    fontFamily: 'PlusJakartaSans-BoldItalic',
  },
  card: {
    backgroundColor: '#fff',       // Background color for the card
    padding: 20,                   // Padding inside the card
    margin: 20,                    // Margin around the card
    borderRadius: 15,              // Rounded corners
    // Shadow properties for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Elevation for Android
    elevation: 5,
  },
  input: {
    height: 40,
    marginTop: 12,
    borderColor: '#ccc',
    fontFamily: 'PlusJakartaSans-BoldItalic',
    color: '#000000',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
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
    color: '#000000', // White text color
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-BoldItalic',
  },
  textA: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'PlusJakartaSans-Italic-VariableFont_wght',
    margin: 8,                    // Margin around the card

  },
  clickableText: {
    color: 'red',
    textDecorationLine: 'underline',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginLeft: 8,
    marginTop: 4,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-BoldItalic'
  },

})
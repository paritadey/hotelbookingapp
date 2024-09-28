import { StyleSheet, SafeAreaView, Text, Alert, TextInput, Dimensions, View, TouchableOpacity, ImageBackground } from 'react-native'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../authentication/authSlice';
import { RootState } from '../authentication/store';
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParamList } from '../AppNavigator'
import AsyncStorage from '@react-native-async-storage/async-storage';

type LoginProps = NativeStackScreenProps<RootStackParamList, 'Login'>

const LoginScreen = ({ navigation }: LoginProps) => {
  // const hasSignedUp = useSelector((state: RootState) => state.auth.hasSignedUp);
  // console.log("has signed up in Login screen:", hasSignedUp);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6; // Minimum 6 characters
  };

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return;
    }
    if (!validatePassword(password)) {
      Alert.alert('Invalid password', 'Password must be at least 6 characters long.');
      return;
    }
    const userData = await AsyncStorage.getItem('user');
    const jsonData = userData != null ? JSON.parse(userData) : null;
    if (jsonData && jsonData.email === email && jsonData.password === password) {
      dispatch(login({ email, password, phone: jsonData.phone, name: jsonData.name }));
      navigation.reset({ //clears the navigation stack and sets a new stack with the specified routes.
        index: 0,
        routes: [{ name: 'Dashboard' }]
      })
    } else {
      Alert.alert('Invalid email or password.');
    }
  }

  const handleForgotPass = () => {
    navigation.navigate('ForgotPass');
  }
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <ImageBackground
          source={{ uri: 'https://i.pinimg.com/564x/a9/c1/94/a9c194ee02e5cbc00017a1d2e51e1ad4.jpg' }} // image URL
          style={styles.image}
          imageStyle={styles.imageOpacity} // Apply opacity to the image
          resizeMode="cover">
          <Text style={styles.text}>Welcome Back</Text>
          <Text style={styles.subtext}>start the journey by logging into your account</Text>
          <View style={styles.card}>
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
              placeholder="Enter Password"
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry></TextInput>
            <View>
              <TouchableOpacity style={[styles.button]} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleForgotPass}>
              <Text style={styles.textReset}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  )
}

export default LoginScreen;

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
    margin: 20,
    marginVertical: 25,                   // Margin around the card
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
  textReset: {
    fontSize: 16,
    color: 'red',
    textDecorationLine: 'underline',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    fontFamily: 'PlusJakartaSans-Italic-VariableFont_wght',
    margin: 8,                    // Margin around the card
  },
})
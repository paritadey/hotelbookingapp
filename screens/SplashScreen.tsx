import { Animated, StyleSheet, Text, View, ImageBackground, Dimensions, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react';
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParamList } from '../AppNavigator'
import AsyncStorage from '@react-native-async-storage/async-storage';


type SplashProps = NativeStackScreenProps<RootStackParamList, 'Splash'>

const SplashScreen = ({ navigation }: SplashProps) => {
  // const hasSignedUp = useSelector((state: RootState) => state.auth.hasSignedUp);
  // console.log("has signed up in Splash screen:", hasSignedUp);

  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity value is 0
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, // Animate to opacity 1 (visible)
      duration: 5000, // Duration of the animation (2 seconds)
      useNativeDriver: true, // Use native driver for better performance
    }).start(); // Start the animation
  }, [fadeAnim]);

  const onPress = async () => {
    const hasSignedUp = await AsyncStorage.getItem('hasSignedUp');
    if (hasSignedUp) {
      navigation.reset({ //clears the navigation stack and sets a new stack with the specified routes.
        index: 0,
        routes: [{ name: 'Login' }]
      })
    }
    else {
      navigation.reset({ //clears the navigation stack and sets a new stack with the specified routes.
        index: 0,
        routes: [{ name: 'Onboarding' }]
      })
    }
  }

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <ImageBackground
          source={{ uri: 'https://i.pinimg.com/564x/41/64/08/416408bbaa63ec89a9e963d50f48d325.jpg' }} // Replace with your image URL
          style={styles.image}
          resizeMode="cover"  // or 'contain' or 'stretch', depending on your needs
        >
          <View>
            <Text style={styles.storyText}> Create stories of</Text>
            <Animated.Text style={[styles.journeyText, { opacity: fadeAnim }]}>Travel Journey</Animated.Text>
            <Text style={styles.chooseText}>by choosing Soulful Stays !</Text>
          </View>
          <View>
            <TouchableOpacity style={[styles.button]} onPress={onPress}>
              <Text style={styles.buttonText}>Let's Go</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  storyText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-BoldItalic',
    color: '#000000',
    paddingHorizontal: 40,
    marginTop: 100
  },
  chooseText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-BoldItalic',
    marginTop: 4,
    color: '#000000',
    paddingHorizontal: 100

  },
  journeyText: {
    fontSize: 24,
    fontFamily: 'PlusJakartaSans-BoldItalic',
    paddingVertical: 4,
    color: '#000000',
    paddingHorizontal: 64
  },
  button: {
    backgroundColor: '#d49cd0', // Lavender color
    borderRadius: 20, // Rounded corners
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginStart: 24,
    marginEnd: 24,
    marginTop: Dimensions.get('window').height / 1.8,
  },
  buttonText: {
    color: '#000000', // White text color
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-BoldItalic',
  },

});

export default SplashScreen;  
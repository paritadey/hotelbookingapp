import { StyleSheet, Alert } from 'react-native'
import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons'; // Import icon library
import MainScreen from './MainScreen';
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParamList } from '../AppNavigator'
import { Provider } from 'react-redux';
import store from '../hotelList/store';
import { Hotel } from '../hotelList/type';
import ProfileScreen from './ProfileScreen';
import BookingScreen from './BookingScreen';
import { RootState } from '../authentication/store';
import { useSelector } from 'react-redux';
import { User } from '../authentication/authSlice';
import messaging from '@react-native-firebase/messaging';
import { Platform, Linking } from 'react-native';
import { PermissionsAndroid } from 'react-native';
import database from '@react-native-firebase/database';


type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

type TabParamList = {
  Main: undefined;
  HotelItemScreen: { hotel: Hotel };
  Booking: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const DashboardScreen = ({ navigation }: Props) => {
  const user = useSelector((data: RootState) => data.auth.user);
  console.log("User data:", user);

  // Request user permission for notifications
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }

    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Notification permission denied');
      }
    }
  };

  const saveFcmToken = async (userId: string, fcmToken: string) => {
    const userRef = database().ref(`/hotelBooking/users/${userId}`);
    await userRef.update({
      fcmToken,
    });
  };

  // Function to open the exact alarm settings for Android 12+
  const openExactAlarmSettings = () => {
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      Alert.alert(
        'Exact Alarms Permission Required',
        'To set exact alarms, please allow the permission in your device settings.',
        [
          {
            text: 'Go to Settings',
            onPress: () => Linking.openSettings(),  // Opens the settings
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
        { cancelable: true }
      );
    } else {
      console.log('This feature is only required for Android 12 or above.');
    }
  };


  useEffect(() => {
    requestUserPermission();
    // Call this function when you need to guide the user to enable exact alarms
   // openExactAlarmSettings();

    // Get the device token
    messaging().getToken().then(token => {
      console.log('FCM Token:', token);
      // Save the token to your backend if necessary
      if (user?.name != null) {
        saveFcmToken(user?.name.replace(' ', '').toString(), token)
      }
    });

    // Listen to whether the token refreshes
    return messaging().onTokenRefresh(token => {
      console.log('FCM Token refreshed:', token);
      // Handle token refresh
      if (user?.name != null) {
        saveFcmToken(user?.name.replace(' ', '').toString(), token)
      }
    });
  }, []);
  return (
    <Tab.Navigator
      initialRouteName="Main"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Main':
              iconName = 'home-outline';
              break;
            case 'Booking':
              iconName = 'calendar-outline';
              break;
            case 'Profile':
              iconName = 'person-outline';
              break;
            default:
              iconName = 'help-outline'; // Fallback icon
              break;
          }
          // Return the appropriate icon
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Main">
        {({ navigation, route }) => (
          <Provider store={store}>
            <MainScreen
              navigation={navigation} route={route}
            />
          </Provider>
        )}
      </Tab.Screen>
      <Tab.Screen name="Booking" component={BookingScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default DashboardScreen;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenText: {
    fontSize: 24,
  },

})
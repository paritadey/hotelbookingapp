import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
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
import {User} from '../authentication/authSlice';


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
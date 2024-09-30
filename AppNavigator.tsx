import {NavigationContainer} from "@react-navigation/native"
import {createNativeStackNavigator} from "@react-navigation/native-stack"

import SplashScreen from './screens/SplashScreen';
import OnboardingScreen from './screens/Onboarding';
import LoginScreen from "./screens/LoginScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import DashboardScreen from "./screens/DashboardScreen";
import MainScreen, { RecentSearch } from "./screens/MainScreen";
import { Hotel } from "./hotelList/type";
import HotelItemScreen from "./screens/HotelItemScreen";
import SearchHotelScreen from "./screens/SearchHotelScreen";
import ProfileScreen from "./screens/ProfileScreen";
import HotelDetails from "./screens/HotelDetails";
import BookingScreen, { BookingList } from "./screens/BookingScreen";
import BookedHotelDetails from "./screens/BookedHotelDetails";
import RecentSearchItem from "./screens/RecentSearchItem";

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login:undefined;
  Welcome:undefined;
  ForgotPass:undefined;
  Dashboard:undefined;
  Main:undefined;
  HotelItemScreen:{hotel:Hotel};
  SearchHotel:{locationName:string};
  Profile:undefined;
  HotelScreen: {hotelId:string, checkIn:string, checkOut:string, rooms:string, adults:string, currencyCode:string, priceDetails:string, priceForDisplay:string, strikethroughPrice:string};
  Booking: undefined;
  BookedHotel: {booking: BookingList};
  RecentSearch: {searchItem: RecentSearch};
}

const Stack = createNativeStackNavigator<RootStackParamList>()

const AppNavigator = () => {
    return (
        <NavigationContainer>
        <Stack.Navigator initialRouteName='Splash'>
          <Stack.Screen
            name='Splash'
            component={SplashScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name='Onboarding'
            component={OnboardingScreen}   
            options={{headerShown: false}}     
          />
          <Stack.Screen
            name='Login'
            component={LoginScreen}   
            options={{headerShown: false}}     
          />
          <Stack.Screen
            name='ForgotPass'
            component={ForgotPasswordScreen}   
            options={{headerShown: false}}     
          />
          <Stack.Screen
            name='Dashboard'
            component={DashboardScreen}   
            options={{headerShown: false}}     
          />
          <Stack.Screen
            name='Main'
            component={MainScreen}   
            options={{headerShown: false}}     
          />
          <Stack.Screen 
            name="HotelItemScreen" 
            component={HotelItemScreen} 
            options={{headerShown:false}}
          />
          <Stack.Screen 
            name="SearchHotel" 
            component={SearchHotelScreen} 
            options={{headerShown:false}}
          />
          <Stack.Screen 
            name="Profile" 
            component={ProfileScreen} 
            options={{headerShown:false}}
          />
          <Stack.Screen 
            name="HotelScreen" 
            component={HotelDetails} 
            options={{headerShown:false}}
          />
          <Stack.Screen 
            name="Booking" 
            component={BookingScreen} 
            options={{headerShown:false}}
          />
          <Stack.Screen 
            name="BookedHotel" 
            component={BookedHotelDetails} 
            options={{headerShown:false}}
          />
          <Stack.Screen 
            name="RecentSearch" 
            component={RecentSearchItem} 
            options={{headerShown:false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
  
    );
}  

export default AppNavigator;


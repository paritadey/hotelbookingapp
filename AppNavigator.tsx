import {NavigationContainer} from "@react-navigation/native"
import {createNativeStackNavigator} from "@react-navigation/native-stack"
import { Linking, ActivityIndicator } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import SplashScreen from './screens/SplashScreen';
import OnboardingScreen from './screens/Onboarding';
import LoginScreen from "./screens/LoginScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import DashboardScreen from "./screens/DashboardScreen";
import MainScreen from "./screens/MainScreen";
import { Hotel } from "./hotelList/type";
import HotelItemScreen from "./screens/HotelItemScreen";
import SearchHotelScreen from "./screens/SearchHotelScreen";
import ProfileScreen from "./screens/ProfileScreen";
import HotelDetails from "./screens/HotelDetails";
import BookingScreen, { BookingList } from "./screens/BookingScreen";
import BookedHotelDetails from "./screens/BookedHotelDetails";
import {User} from './authentication/authSlice';

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
  BookedHotel: {booking: BookingList}
}

const Stack = createNativeStackNavigator<RootStackParamList>()
const NAVIGATION_IDS = ['Main', 'Dashboard'];

function buildDeepLinkFromNotificationData(data:any): string | null {
  const navigationId = data?.navigationId;
  console.log("navigation id :", navigationId);
  if (!NAVIGATION_IDS.includes(navigationId)) {
    console.warn('Unverified navigationId', navigationId)
    return null;
  }
  if (navigationId === 'Main') {
    return 'myapp://Main';
  }
  if (navigationId === 'Dashboard') {
    return 'myapp://Dashboard';
  }
  return null
}

const linking = {
  prefixes: ['myapp://'],
  config: {
    screens: {
      MainScreen: 'Main',
      DashboardScreen: 'Dashboard'
    }
  },
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    if (typeof url === 'string') {
      return url;
    }
    //getInitialNotification: When the application is opened from a quit state.
    const message = await messaging().getInitialNotification();
    const deeplinkURL = buildDeepLinkFromNotificationData(message?.data);
    if (typeof deeplinkURL === 'string') {
      return deeplinkURL;
    }
  },
  subscribe(listener: (url: string) => void) {
    const onReceiveURL = ({url}: {url: string}) => listener(url);

    // Listen to incoming links from deep linking
    const linkingSubscription = Linking.addEventListener('url', onReceiveURL);
    messaging().setBackgroundMessageHandler(async remoteMessage=>{
      console.log('Message handled in the background!', remoteMessage);
    });

    const foreground = messaging().onMessage(async remoteMessage =>{
      console.log('A new FCM message arrived!', remoteMessage);
    })
    //onNotificationOpenedApp: When the application is running, but in the background.
    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      const url = buildDeepLinkFromNotificationData(remoteMessage.data)
      if (typeof url === 'string') {
        listener(url)
      }
    });

    return () => {
      linkingSubscription.remove();
      unsubscribe();
      foreground();
    };
  },
}

const AppNavigator = () => {
    return (
        <NavigationContainer linking={linking} fallback={<ActivityIndicator animating />}>
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
        </Stack.Navigator>
      </NavigationContainer>
  
    );
}  

export default AppNavigator;


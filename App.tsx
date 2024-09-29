import React, {useEffect} from 'react';
import AppNavigator from './AppNavigator';
import { Provider } from 'react-redux';
import store from './authentication/store';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { PermissionsAndroid } from 'react-native';

const App = () => {

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

  useEffect(() => {
    requestUserPermission();
  
    // Get the device token
    messaging().getToken().then(token => {
      console.log('FCM Token:', token);
      // Save the token to your backend if necessary
    });
  
    // Listen to whether the token refreshes
    return messaging().onTokenRefresh(token => {
      console.log('FCM Token refreshed:', token);
      // Handle token refresh
    });
  }, []);
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  )
}
export default App;
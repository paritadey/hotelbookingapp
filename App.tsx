/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import AppNavigator from './AppNavigator';
import { Provider } from 'react-redux';
import store from './authentication/store';

const App=()=>{
  return(
    <Provider store={store}>
      <AppNavigator/>
    </Provider>
  )
}
export default App;
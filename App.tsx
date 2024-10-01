import React, {useEffect} from 'react';
import AppNavigator from './AppNavigator';
import { Provider } from 'react-redux';
import store from './authentication/store';

const App = () => {
return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  )
}
export default App;
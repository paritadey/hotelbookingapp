import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import hotelRSReducer from './reducer'; // Import your root reducer
import rootSaga from './sagas'; // Import your root saga

// Create the saga middleware
const sagaMiddleware = createSagaMiddleware();

// Configure the store with the reducer and saga middleware
const store = configureStore({
  reducer: hotelRSReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: {
        warnAfter: 128, // Increase the warning threshold to 128ms or any value you find reasonable
      },
      thunk: false, // Disable Thunk if you don't need it
      serializableCheck: false,
    }).concat(sagaMiddleware), // Add the saga middleware
});

// Run the root saga
sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

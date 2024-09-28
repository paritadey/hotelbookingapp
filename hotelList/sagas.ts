import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchHotelsApi } from './api';
import { fetchHotelsSuccess, fetchHotelsFailure, HotelActions } from './action';
import { HotelList, FETCH_HOTELS_REQUEST, } from './type';

// Worker Saga: will be fired on FETCH_HOTELS_REQUEST actions
function* fetchHotelsSaga(action: HotelActions) {
  try {
    // Extract query from the action payload
    const query = action.payload as string;

    // Call the API and await response
    const hotelList: HotelList = yield call(fetchHotelsApi, query);

    // Dispatch success action with fetched hotel data
    yield put(fetchHotelsSuccess(hotelList));
  } catch (error: any) {
    // Dispatch failure action with error message
    yield put(fetchHotelsFailure(error.message));
  }
}

// Watcher Saga: spawns a new fetchHotelsSaga task on each FETCH_HOTELS_REQUEST
function* watchFetchHotels() {
  yield takeLatest(FETCH_HOTELS_REQUEST, fetchHotelsSaga);
}

export default watchFetchHotels;

import { call, put, takeLatest } from 'redux-saga/effects';
import axios, {AxiosResponse} from 'axios';
import { fetchSearchHotelListSuccess, fetchSearchHotelListFailure, FetchSearchRequestAction } from './action';
import { Root, FETCH_SEARCH_HOTEL_LIST_REQUEST } from './type';
import {LOCATION_API_KEY, LOCATION_API_HOST} from '../utils/GoogleKey';

function* fetchSearch(action: FetchSearchRequestAction){
  const { geoId, checkIn, checkOut, priceMin, priceMax, currencyCode, rooms, adults } = action.payload;
  const options = {
    method: 'GET',
    url: 'https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchHotels',
    params: {
      geoId,
      checkIn,
      checkOut,
      priceMin, priceMax, currencyCode, rooms, adults,
      pageNumber: '1',
    },
    headers: {
      'x-rapidapi-key': LOCATION_API_KEY,
      'x-rapidapi-host': LOCATION_API_HOST
    },
  };

  console.log("params:",options.params);

  try {
    const response: AxiosResponse<Root> = yield call(axios.request, options);
  //  console.log("Data we found from search hotel:", response.data.data.data);
    yield put(fetchSearchHotelListSuccess(response.data));
  } catch (error:any) {
    yield put(fetchSearchHotelListFailure(error.message));
  }
}

export function* watchFetchSearchHotels() {
  yield takeLatest(FETCH_SEARCH_HOTEL_LIST_REQUEST, fetchSearch);
}

// Root saga
export default function* rootSaga() {
  yield watchFetchSearchHotels();
}

import { call, put, takeLatest } from 'redux-saga/effects';
import axios, { AxiosResponse } from 'axios';
import { fetchHotelRSSuccess, fetchHotelRSFailure, FetchHotelRSRequestAction } from './action';
import { Data, FETCH_HOTEL_DETAILS_REQUEST_RS } from './type';
import { LOCATION_API_KEY, LOCATION_API_HOST } from '../utils/GoogleKey';

function* fetchSearch(action: FetchHotelRSRequestAction) {
    const { id, checkIn, checkOut, currencyCode, rooms, adults } = action.payload;
    const options = {
        method: 'GET',
        url: 'https://tripadvisor16.p.rapidapi.com/api/v1/hotels/getHotelDetails',
        params: {
            id,
            checkIn,
            checkOut, currencyCode, rooms, adults,
        },
        headers: {
            'x-rapidapi-key': LOCATION_API_KEY,
            'x-rapidapi-host': LOCATION_API_HOST
        },
    };

    console.log("params:", options.params);

    try {
        const response: AxiosResponse<Data> = yield call(axios.request, options);
      //  console.log("Data we found from search hotel for recent search:", response.data);
        yield put(fetchHotelRSSuccess(response.data));
    } catch (error: any) {
        yield put(fetchHotelRSFailure(error.message));
    }
}

export function* watchFetchSearchHotels() {
    yield takeLatest(FETCH_HOTEL_DETAILS_REQUEST_RS, fetchSearch);
}

// Root saga
export default function* rootSaga() {
    yield watchFetchSearchHotels();
}

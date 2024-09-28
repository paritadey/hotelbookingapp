import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchLocationIdApi } from './api'; // Import your API function
import { fetchLOCIdSuccess, fetchLOCIdFailure, LocationIdActions } from './action';
import { Location, FETCH_LOC_ID_REQUEST } from './type';

function* handleFetchCityData(action: LocationIdActions) {
    try {
      // Extract query from the action payload
      const query = action.payload as string;
  
      // Call the API and await response
      const locationId: Location = yield call(fetchLocationIdApi, query);
      console.log('Location Details in Sagas:', locationId);
      // Dispatch success action with fetched hotel data
      yield put(fetchLOCIdSuccess(locationId));
    } catch (error: any) {
      // Dispatch failure action with error message
      yield put(fetchLOCIdFailure(error.message));
    }
  }

  function* fetchLocationIdSaga(action:LocationIdActions) {
    try {
      const query = action.payload as string;
      const response:Location = yield call(fetchLocationIdApi, query);
      yield put({ type: 'FETCH_LOC_ID_SUCCESS', payload: response.data });
    } catch (error:any) {
      yield put({ type: 'FETCH_LOC_ID_FAILURE', payload: error.message });
    }
  }
  
function* watchFetchLocationId() {
    yield takeLatest(FETCH_LOC_ID_REQUEST, handleFetchCityData);
  }
  
  export default watchFetchLocationId;
  
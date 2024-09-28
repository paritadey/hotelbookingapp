import { HotelList, FETCH_HOTELS_REQUEST, FETCH_HOTELS_SUCCESS, FETCH_HOTELS_FAILURE} from "./type";


interface FetchHotelsRequestAction {
  type: typeof FETCH_HOTELS_REQUEST;
  payload: string;  // Assuming cityName is a string
}

interface FetchHotelsSuccessAction {
  type: typeof FETCH_HOTELS_SUCCESS;
  payload: HotelList;
}

interface FetchHotelsFailureAction {
  type: typeof FETCH_HOTELS_FAILURE;
  payload: string; // error message
}

// Action Creators
export const fetchHotelsRequest = (cityName: string): FetchHotelsRequestAction => ({
  type: FETCH_HOTELS_REQUEST,
  payload: cityName,
});

export const fetchHotelsSuccess = (hotelList: HotelList): FetchHotelsSuccessAction => ({
  type: FETCH_HOTELS_SUCCESS,
  payload: hotelList,
});

export const fetchHotelsFailure = (error: string): FetchHotelsFailureAction => ({
  type: FETCH_HOTELS_FAILURE,
  payload: error,
});


export type HotelActions = FetchHotelsRequestAction | FetchHotelsSuccessAction | FetchHotelsFailureAction;

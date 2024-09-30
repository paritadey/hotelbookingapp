import { Data, FETCH_HOTEL_DETAILS_REQUEST_RS, FETCH_HOTEL_DETAILS_SUCCESS_RS, FETCH_HOTEL_DETAILS_FAILURE_RS} from "./type";
import {HotelRSActions} from './action';

export interface NearByHotelState {
    loading: boolean;
    dataItem: Data| null; 
    error: string | null;
  }
  
  const initialState: NearByHotelState = {
    loading: false,
    dataItem: null,
    error: null,
  };

  const hotelRSReducer = (state = initialState, action: HotelRSActions) => {
    switch (action.type) {
      case FETCH_HOTEL_DETAILS_REQUEST_RS:
        return { ...state, loading: true, error: null };
      case FETCH_HOTEL_DETAILS_SUCCESS_RS:
        return { ...state, loading: false, dataItem: action.payload };
      case FETCH_HOTEL_DETAILS_FAILURE_RS:
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export default hotelRSReducer;
  

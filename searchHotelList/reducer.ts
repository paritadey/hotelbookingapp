import { FETCH_SEARCH_HOTEL_LIST_REQUEST, FETCH_SEARCH_HOTEL_LIST_SUCCESS, FETCH_SEARCH_HOTEL_LIST_FAILURE, Root } from './type';
import {SearchActions} from './action';

export interface SearchHotelState {
    loading: boolean;
    hotelList: Root| null; 
    error: string | null;
  }
  
  const initialState: SearchHotelState = {
    loading: false,
    hotelList: null,
    error: null,
  };
  
const searchReducer = (state = initialState, action: SearchActions) => {
  switch (action.type) {
    case FETCH_SEARCH_HOTEL_LIST_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_SEARCH_HOTEL_LIST_SUCCESS:
      return { ...state, loading: false, hotelList: action.payload };
    case FETCH_SEARCH_HOTEL_LIST_FAILURE:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};

export default searchReducer;

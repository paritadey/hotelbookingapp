import { HotelList, FETCH_HOTELS_REQUEST, FETCH_HOTELS_SUCCESS, FETCH_HOTELS_FAILURE} from "./type";
import { HotelActions,} from './action';
  
  export interface HotelState {
    hotelLoading: boolean;
    hotelList: HotelList | null;
    hotelError: string | null;
  }
  
  const initialState: HotelState = {
    hotelLoading: false,
    hotelList: null,
    hotelError: null,
  };
  
  const hotelReducer = (state = initialState, action: HotelActions): HotelState => {
    switch (action.type) {
      case FETCH_HOTELS_REQUEST:
        return {
          ...state,
          hotelLoading: true,
          hotelError: null,
        };
      case FETCH_HOTELS_SUCCESS:
        return {
          ...state,
          hotelLoading: false,
          hotelList: action.payload,
        };
      case FETCH_HOTELS_FAILURE:
        return {
          ...state,
          hotelLoading: false,
          hotelError: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default hotelReducer;
  
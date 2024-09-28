import { FETCH_LOC_ID_REQUEST, FETCH_LOC_ID_SUCCESS, FETCH_LOC_ID_FAILURE, Location } from './type';
import { LocationIdActions,} from './action';

export interface CityIdState {
  loading: boolean;
  data: Location| null; 
  error: string | null;
}

const initialState: CityIdState = {
  loading: false,
  data: null,
  error: null,
};

const cityReducer = (state = initialState, action: LocationIdActions): CityIdState => {
  switch (action.type) {
    case FETCH_LOC_ID_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_LOC_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case FETCH_LOC_ID_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
export default cityReducer;

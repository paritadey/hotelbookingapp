import { Location, FETCH_LOC_ID_REQUEST, FETCH_LOC_ID_SUCCESS, FETCH_LOC_ID_FAILURE} from "./type";

interface FetchLocationIdRequestAction {
    type: typeof FETCH_LOC_ID_REQUEST;
    payload: string;  // Assuming cityName is a string
  }
  
  interface FetchLocationIdSuccessAction {
    type: typeof FETCH_LOC_ID_SUCCESS;
    payload: Location;
  }
  
  interface FetchLocationIdFailureAction {
    type: typeof FETCH_LOC_ID_FAILURE;
    payload: string; // error message
  }

  // Action Creators
export const fetchLOCIdRequest = (locationName: string): FetchLocationIdRequestAction => ({
    type: FETCH_LOC_ID_REQUEST,
    payload: locationName,
  });
  
  export const fetchLOCIdSuccess = (location: Location): FetchLocationIdSuccessAction => ({
    type: FETCH_LOC_ID_SUCCESS,
    payload: location,
  });
  
  export const fetchLOCIdFailure = (error: string): FetchLocationIdFailureAction => ({
    type: FETCH_LOC_ID_FAILURE,
    payload: error,
  });
  
  export type LocationIdActions = FetchLocationIdRequestAction | FetchLocationIdSuccessAction | FetchLocationIdFailureAction;

  
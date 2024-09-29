import { Data, FETCH_HOTEL_DETAILS_REQUEST_RS, FETCH_HOTEL_DETAILS_SUCCESS_RS, FETCH_HOTEL_DETAILS_FAILURE_RS} from "./type";

export interface FetchHotelRSRequestAction {
    type: typeof FETCH_HOTEL_DETAILS_REQUEST_RS;
    payload: {id: string,checkIn:string, checkOut:string,
        currencyCode:string, rooms:string, adults:string};  
  }
  
export interface FetchHotelRSSuccessAction {
    type: typeof FETCH_HOTEL_DETAILS_SUCCESS_RS;
    payload: Data;
  }
  
export interface FetchHotelRSFailureAction {
    type: typeof FETCH_HOTEL_DETAILS_FAILURE_RS;
    payload: string; // error message
  }
  
  // Action Creators  
  export const fetchHotelRSRequest = (id: string, checkIn: string, checkOut: string, currencyCode: string, rooms?: string, adults?: string) => ({
    type: 'FETCH_HOTEL_DETAILS_REQUEST_RS',
    payload: {
      id, checkIn,checkOut,currencyCode,rooms,adults
    }
  });
  
  export const fetchHotelRSSuccess = (data:Data): FetchHotelRSSuccessAction => ({
    type: FETCH_HOTEL_DETAILS_SUCCESS_RS,
    payload: data,
  });
  
  export const fetchHotelRSFailure = (error: string): FetchHotelRSFailureAction => ({
    type: FETCH_HOTEL_DETAILS_FAILURE_RS,
    payload: error,
  });
  
  
  export type HotelRSActions = FetchHotelRSRequestAction | FetchHotelRSSuccessAction | FetchHotelRSFailureAction;
  
import {FETCH_HOTEL_DETAILS_REQUEST, FETCH_HOTEL_DETAILS_SUCCESS, FETCH_HOTEL_DETAILS_FAILURE,}from './type'

export interface FetchHotelDetailsRequestAction {
  type: typeof FETCH_HOTEL_DETAILS_REQUEST;
  payload: {
    id: string;
    checkIn: string;
    checkOut: string;
    adults: string;
    rooms: string;
    currencyCode: string;
  };
}

export interface FetchHotelDetailsSuccessAction {
  type: typeof FETCH_HOTEL_DETAILS_SUCCESS;
  payload: any; // Use a more specific type here if possible
}

export interface FetchHotelDetailsFailureAction {
  type: typeof FETCH_HOTEL_DETAILS_FAILURE;
  payload: string; // Error message
}
  
  export const fetchHotelDetailsRequest = (id: string, checkIn: string, checkOut: string, currencyCode: string, rooms?: string, adults?: string) => ({
    type: FETCH_HOTEL_DETAILS_REQUEST,
    payload: {
      id, checkIn,checkOut,currencyCode,rooms,adults
    }
  });
    
    export const fetchHotelDetailsSuccess = (data: any): FetchHotelDetailsSuccessAction => ({
      type: FETCH_HOTEL_DETAILS_SUCCESS,
      payload: data,
    });
    
    export const fetchHotelDetailsFailure = (error: string): FetchHotelDetailsFailureAction => ({
      type: FETCH_HOTEL_DETAILS_FAILURE,
      payload: error,
    });
        
    export type HotelDetailsActions =  | FetchHotelDetailsRequestAction
    | FetchHotelDetailsSuccessAction
    | FetchHotelDetailsFailureAction;

  
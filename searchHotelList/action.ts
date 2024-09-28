import { Root, FETCH_SEARCH_HOTEL_LIST_REQUEST, FETCH_SEARCH_HOTEL_LIST_SUCCESS, FETCH_SEARCH_HOTEL_LIST_FAILURE} from "./type";


export interface FetchSearchRequestAction {
  type: typeof FETCH_SEARCH_HOTEL_LIST_REQUEST;
  payload: { geoId: string,checkIn:string, checkOut:string,
    currencyCode:string, priceMin:string, priceMax:string,rooms:string, adults:string };
}

export interface FetchSearchSuccessAction {
  type: typeof FETCH_SEARCH_HOTEL_LIST_SUCCESS;
  payload: Root;
}

export interface FetchSearchFailureAction {
  type: typeof FETCH_SEARCH_HOTEL_LIST_FAILURE;
  error: string;
}

export const fetchSearchHotelListRequest = (geoId: string, checkIn: string, checkOut: string, currencyCode: string, priceMin?: string, priceMax?: string, rooms?: string, adults?: string) => ({
  type: 'FETCH_SEARCH_HOTEL_LIST_REQUEST',
  payload: {
    geoId, checkIn,checkOut,currencyCode,priceMin,priceMax,rooms,adults
  }
});
  
  export const fetchSearchHotelListSuccess = (data: Root): FetchSearchSuccessAction => ({
    type: FETCH_SEARCH_HOTEL_LIST_SUCCESS,
    payload: data,
  });
  
  export const fetchSearchHotelListFailure = (error: string):FetchSearchFailureAction  => ({
    type: FETCH_SEARCH_HOTEL_LIST_FAILURE,
     error,
  });
  
  export type SearchActions = FetchSearchRequestAction | FetchSearchSuccessAction | FetchSearchFailureAction;

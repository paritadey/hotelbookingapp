export interface Photos{
    height:number;
    width:number;
    html_attributions: string[];
}
export interface Hotel{
    place_id:string,
    business_status:string,
    formatted_address:string,
    icon:string,
    rating:number,
    photos:Photos,
    name:string,
    types:string[],
}
export interface HotelList {
    data:Hotel[],
}

export interface HotelListState {
    loading: boolean;
    hotel: HotelList[];
    error: string | null;
  }

  // Action Types
  export const FETCH_HOTELS_REQUEST = 'FETCH_HOTELS_REQUEST';
  export const FETCH_HOTELS_SUCCESS = 'FETCH_HOTELS_SUCCESS';
  export const FETCH_HOTELS_FAILURE = 'FETCH_HOTELS_FAILURE';
  


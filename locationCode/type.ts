export interface Location{
    data:LocationData;
}
export interface LocationData{
    geoId: number;
    title:string;
    trackingItems:string;
    secondaryText:string;
}

  // Action Types
  export const FETCH_LOC_ID_REQUEST = 'FETCH_LOC_ID_REQUEST';
  export const FETCH_LOC_ID_SUCCESS = 'FETCH_LOC_ID_SUCCESS';
  export const FETCH_LOC_ID_FAILURE = 'FETCH_LOC_ID_FAILURE';
  


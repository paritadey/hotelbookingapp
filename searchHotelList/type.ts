  // Action Types
  export const FETCH_SEARCH_HOTEL_LIST_REQUEST = 'FETCH_SEARCH_HOTEL_LIST_REQUEST';
  export const FETCH_SEARCH_HOTEL_LIST_SUCCESS = 'FETCH_SEARCH_HOTEL_LIST_SUCCESS';
  export const FETCH_SEARCH_HOTEL_LIST_FAILURE = 'FETCH_SEARCH_HOTEL_LIST_FAILURE';
  export interface Root {
    status: boolean
    message: string
    timestamp: number
    data: Data
  }
  
  export interface Data {
    sortDisclaimer: string
    data: Daum[]
  }
  
  export interface Daum {
    id: string
    title: string
    primaryInfo?: string
    secondaryInfo: string
    bubbleRating: BubbleRating[]
    priceForDisplay: string,
    strikethroughPrice?: string
    priceDetails?: string
    priceSummary?: string
   // cardPhotos: CardPhoto[]
  }
    
  export interface BubbleRating {
    count: string
    rating: number
  }
  
  export interface CardPhoto {
    sizes: Sizes
  }
  
  export interface Sizes {
    maxHeight: number
    maxWidth: number
    urlTemplate: string
  }
  
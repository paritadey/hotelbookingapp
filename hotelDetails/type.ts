export const FETCH_HOTEL_DETAILS_REQUEST = 'FETCH_HOTEL_DETAILS_REQUEST';
export const FETCH_HOTEL_DETAILS_SUCCESS = 'FETCH_HOTEL_DETAILS_SUCCESS';
export const FETCH_HOTEL_DETAILS_FAILURE = 'FETCH_HOTEL_DETAILS_FAILURE';


export interface Amenity {
  title: string;
  content: string[];
}
export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface Location {
  address: string;
  title: string;
}
export interface Photo {
  maxHeight: number;
  maxWidth: number;
  urlTemplate: string;
}

export interface PhotosData {
  photos: Photo[];
}

export interface Data {
  amenitiesScreen: Amenity[];
  geoPoint: GeoPoint;
  location: Location;
  numberReviews: number;
  photosData: PhotosData[];
  rankingDetails: string;
  rating: number;
  title: string;
}

export interface ApiResponse {
  data: Data;
  message: string;
  status: boolean;
  timestamp: number;
}

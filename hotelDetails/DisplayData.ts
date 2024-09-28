import { Double } from 'react-native/Libraries/Types/CodegenTypes';
import {Data, Amenity,ApiResponse, GeoPoint, Location, PhotosData}from './type'

export class DisplayData implements Data {
    amenitiesScreen: Amenity[];
    geoPoint: GeoPoint;
    location: Location;
    numberReviews: number;
    photosData: PhotosData[];
    rankingDetails: string;
    rating: number;
    message: string;
    status: boolean;
    timestamp: number;
    title: string;
  
    constructor(json: ApiResponse) {
      this.amenitiesScreen = json.data.amenitiesScreen;
      this.geoPoint = json.data.geoPoint;
      this.location = json.data.location;
      this.numberReviews = json.data.numberReviews;
      this.photosData = json.data.photosData;
      this.rankingDetails = json.data.rankingDetails;
      this.rating = json.data.rating;
      this.message = json.message;
      this.status = json.status;
      this.timestamp = json.timestamp;
      this.title = json.data.title;
    }
  
    // You can add methods to the class as needed
    getSummary() {
      return `${this.title} has a rating of ${this.rating} and ${this.numberReviews} reviews.`;
    }
  
    getAmenitiesList(): string[] {
      return this.amenitiesScreen.map(amenity => amenity.title.concat(',').concat(' '));
    }
    getGeoCode():number[]{
        const latitude = this.geoPoint.latitude;
        const longitude = this.geoPoint.longitude;
        const geoPlace: number[]=[latitude, longitude];
        console.log("Lat/Long:", geoPlace[0], geoPlace[1]);
        return geoPlace;
    }
  }
  
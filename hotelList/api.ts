import axios from 'axios';
import { HotelList } from './type';
import { Key } from '../utils/GoogleKey';

export const fetchHotelsApi = async (query: string): Promise<HotelList> => {
    const apiKey = Key; // Google Places API key
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=hotels+in+${query.toLowerCase()}&key=${apiKey}`;
    try {
      const response = await axios.get(url);
      // Handle successful response
      //console.log('Hotel Data:', response.data);
      return response.data;
    } catch (error) {
      // Handle error
      console.error('Error fetching hotels:', error);
      throw error; // Re-throw if needed
    }
  };

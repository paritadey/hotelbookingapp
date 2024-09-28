import axios, {AxiosResponse} from 'axios';
import { Location } from './type';
import {LOCATION_API_KEY, LOCATION_API_HOST} from '../utils/GoogleKey';

export const fetchLocationIdApi = async (locationName: string): Promise<Location> => {
  console.log("Query data to search:", locationName);
    try {
      const response: AxiosResponse<Location> = await axios.get(`https://${LOCATION_API_HOST}/api/v1/hotels/searchLocation`, {
        params: {
          query: locationName, // Pass the city name as the query parameter
        },
        headers: {
          'x-rapidapi-key': LOCATION_API_KEY,
          'x-rapidapi-host': LOCATION_API_HOST,
        },
      });
      console.log("Response data in api.ts file:", response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching hotel locations:', error);
      throw error; // Let the calling function handle the error
    }
};
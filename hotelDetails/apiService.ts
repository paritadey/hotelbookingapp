import axios from 'axios';
import { LOCATION_API_HOST, LOCATION_API_KEY } from '../utils/GoogleKey';

const options = {
  method: 'GET',
  url: 'https://tripadvisor16.p.rapidapi.com/api/v1/hotels/getHotelDetails',
  headers: {
    'x-rapidapi-key': LOCATION_API_KEY, // Replace with your actual RapidAPI key
    'x-rapidapi-host': LOCATION_API_HOST,
  },
};

export const fetchHotelDetails = async (hotelId: string, checkIn: string, checkOut: string, adults: string, rooms: string, currency: string) => {
  try {
    const response = await axios.request({
      ...options,
      params: {
        id: hotelId,
        checkIn: checkIn,
        checkOut: checkOut,
        adults: adults,
        rooms: rooms,
        currency: currency,
      },
    });
    console.log("Response data:", response.data);
    return response.data;
  } catch (error:any) {
    console.error('Error fetching hotel details:', error);
    throw error; // Rethrow the error if you want to handle it later
  }
};

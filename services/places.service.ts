import { LocationData } from "@/stores/locationStore";
import { LocationPoint, PlacePrediction } from "@/types";
import axios from "axios";

const apiKey = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY

export const fetchAutocompletePredictions = async (query: string, location?: LocationData, radius?: number): Promise<PlacePrediction[]> => {
  const res = await axios.get(
    'https://maps.googleapis.com/maps/api/place/autocomplete/json',
    {
      params: {
        input: query,
        key: apiKey,
        language: 'ua',
        components: 'country:ua',
        ...(location && {
          location: `${location.coords.latitude},${location.coords.longitude}`,
          radius: radius || 10000,
        }),
      },
    }
  );
  return res.data.predictions;
};

export const getGeocodeDataFromCoordinates = async (
  lat: number,
  lng: number,
): Promise<{ city: string, region: string, country: string } | null> => {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        latlng: `${lat},${lng}`,
        key: apiKey,
        language: 'ua', // Ukrainian response
      },
    });

    if (response.data.results.length === 0) return null;

    // Find the first result that has locality + administrative_area_level_1
    const result = response.data.results.find((r: any) => {
      const types = r.types || [];
      return types.includes('locality') || types.includes('administrative_area_level_1');
    }) || response.data.results[0];

    let city = '';
    let region = '';
    let country = '';

    result.address_components.forEach((component: any) => {
      if (component.types.includes('locality')) {
        city = component.long_name;
      }
      if (component.types.includes('administrative_area_level_1')) {
        region = component.long_name;
      }
      if (component.types.includes('country')) {
        country = component.long_name;
      }
    });

    const addressData = {
      city,
      region,
      country,
    }
    return addressData || null;
  } catch (error) {
    console.error('Error fetching region data:', error);
    return null;
  }
}

export const getPlaceData = async (placeId: string): Promise<LocationPoint> => {
  const response = await axios.get(
    'https://maps.googleapis.com/maps/api/place/details/json',
    {
      params: {
        place_id: placeId,
        key: apiKey,
        fields: 'geometry,formatted_address',
      },
    }
  );

  console.log(response)

  const location = response.data.result.geometry.location;
  return {
    latitude: location.lat,
    longitude: location.lng,
    formatted_address: response.data.result.formatted_address,
  };
};

export const getAddressFromCoords = async (latitude: number, longitude: number): Promise<PlacePrediction[]> => {
  const response = await axios.get(
    'https://maps.googleapis.com/maps/api/geocode/json',
    {
      params: {
        latlng: `${latitude},${longitude}`,
        key: apiKey,
        language: 'ua'
      },
    }
  );

  return response.data.results;
};
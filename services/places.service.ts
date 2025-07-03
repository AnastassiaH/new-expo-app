import { LocationPoint, PlaceCoords, PlacePrediction } from "@/types";
import polyline from '@mapbox/polyline';
import axios from "axios";

const apiKey = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY

export const fetchAutocompletePredictions = async (query: string, location?: PlaceCoords, radius?: number): Promise<PlacePrediction[]> => {
  try {
    const res = await axios.get(
      'https://maps.googleapis.com/maps/api/place/autocomplete/json',
      {
        params: {
          input: query,
          key: apiKey,
          language: 'uk',
          components: 'country:ua',
          ...(location && {
            location: `${location.latitude},${location.longitude}`,
            radius: radius || 10000,
          }),
        },
      }
    );
    return res.data.predictions;
  } catch (error) {
    throw error;
  }
};

export const getDataFromCoordinates = async (
  lat: number,
  lng: number,
): Promise<{ city: string, region: string, country: string, addresses: PlacePrediction[] } | null> => {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        latlng: `${lat},${lng}`,
        key: apiKey,
        language: 'uk',
      },
    });

    if (response.data.results.length === 0) return null;

    const addresses = response.data.results.map((r: any) => ({
      formatted_address: r.formatted_address,
      place_id: r.place_id,
      location: {
        lat: r.geometry.location.lat,
        lng: r.geometry.location.lng,
      },
    }));

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
      addresses: addresses.slice(0, 2)
    }
    return addressData || null;
  } catch (error) {
    throw error;
  }
}

export const getPlaceData = async (placeId: string): Promise<LocationPoint | null> => {
  try {
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

    if (!response.data.result) {
      throw new Error('Error fetching place data');
    }

    const location = response.data.result.geometry.location;

    if (!location) {
      throw new Error('No geometry in result');
    }
    return {
      latitude: location.lat,
      longitude: location.lng,
      description: response.data.result.formatted_address,
    };
  } catch (error) {
    throw error;
  }
};

export const getRouteCoords = async (from: PlaceCoords, to: PlaceCoords): Promise<PlaceCoords[] | null> => {

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${from.latitude},${from.longitude}&destination=${to.latitude},${to.longitude}&key=${apiKey}`
    );
    const json = await res.json();
    const points = polyline.decode(json.routes[0].overview_polyline.points);
    return points.map(([lat, lng]) => ({ latitude: lat, longitude: lng }));
  } catch (error) {
    throw error;
  }
};

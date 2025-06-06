import { LocationPoint, RideData } from "@/types"

export const generateRideData = (fromPlace: LocationPoint, toPlace: LocationPoint, distance: number): RideData => {
  return {
    placeFrom: {
      distance,
      name: fromPlace.formatted_address,
      point: {
        x: fromPlace.latitude,
        y: fromPlace.longitude
      }
    },
    placeTo: {
      distance,
      name: toPlace.formatted_address,
      point: {
        x: toPlace.latitude,
        y: toPlace.longitude
      }
    },
    userId: 0
  }
}

export const isLocationObject = (value: any): boolean => {
  return (
    value.hasOwnProperty('latitude') &&
    value.hasOwnProperty('longitude')
  )
}

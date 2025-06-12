import { LocationPoint, RideData } from "@/types"

export const generateRideData = (fromPlace: LocationPoint, toPlace: LocationPoint, distance: number): RideData => {
  return {
    placeFrom: {
      distance,
      name: fromPlace.description,
      point: {
        x: fromPlace.latitude,
        y: fromPlace.longitude
      }
    },
    placeTo: {
      distance,
      name: toPlace.description,
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

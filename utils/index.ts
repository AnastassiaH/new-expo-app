import { RideData } from "@/types"

export const generateRideData = (data: any): RideData => {
  return {
    placeFrom: {
      distance: +data.fromDist,
      name: data.from.formatted_address,
      point: {
        x: data.from.lat,
        y: data.from.lng
      }
    },
    placeTo: {
      distance: +data.toDistance || 500,
      name: data.to.formatted_address,
      point: {
        x: data.to.lat,
        y: data.to.lng
      }
    },
    userId: 0
  }
}

export const isLocationObject = (value: any): boolean => {
  return (
    typeof value === 'object' &&
    value !== null &&
    value.hasOwnProperty('formatted_address') &&
    value.hasOwnProperty('lat') &&
    value.hasOwnProperty('lng')
  )
}

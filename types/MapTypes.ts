export interface Location {
  latitude: number;
  longitude: number;
  description?: string;
}

export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface MapProps {
  initialRegion?: MapRegion;
  currentCoords?: Location;
  customCity?: Location;
}

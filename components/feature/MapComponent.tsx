import { DEFAULT_MAPS_ERROR_MESSAGE } from "@/constants";
import { useCurrentLocationData } from "@/hooks/useCurrentLocationData";
import { getRouteCoords } from "@/services/places.service";
import { useGoogleMapsError } from "@/stores/errorStore";
import useRideFormStore from "@/stores/rideFormStore";
import { PlaceCoords } from "@/types";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

const edgeMapPadding = {
  top: 250,
  bottom: 50,
  left: 50,
  right: 50,
}

export default function MapComponent() {
  const { fromLocation, toLocation } = useRideFormStore()
  const { currentCoords } = useCurrentLocationData()
  const [routeCoords, setRouteCoords] = useState<PlaceCoords[]>([])
  const mapRef = useRef<MapView>(null);
  const setError = useGoogleMapsError(s => s.setError)

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const coords = await getRouteCoords(fromLocation!, toLocation!);
        setRouteCoords(coords!);

        mapRef.current?.fitToCoordinates(coords!, {
          edgePadding: edgeMapPadding,
          animated: true,
        });
      } catch (err: any) {
        setError(err?.message || DEFAULT_MAPS_ERROR_MESSAGE)
      }
    };

    if (fromLocation && toLocation) {
      fetchRoute();
    } else if (currentCoords) {
      mapRef.current?.animateToRegion({
        latitude: currentCoords.latitude + 0.002,
        longitude: currentCoords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 500)
    }
  }, [fromLocation, toLocation, currentCoords]);

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      showsUserLocation={true}
    >
      {fromLocation && (
        <Marker
          coordinate={{
            latitude: fromLocation.latitude,
            longitude: fromLocation.longitude,
          }}
          title="From"
          identifier="from"
        >
          <View style={styles.markerContainer}>
            <View style={styles.markerDot} />
          </View>
        </Marker>
      )}
      {toLocation && (
        <Marker
          coordinate={{
            latitude: toLocation.latitude,
            longitude: toLocation.longitude,
          }}
          title="To"
          identifier="to"
        >
          <View style={styles.markerContainer}>
            <View style={[styles.markerDot, styles.markerDotTo]} />
          </View>
        </Marker>
      )}

      {fromLocation && toLocation && (
        <Polyline
          coordinates={routeCoords}
          strokeColor="#007AFF"
          strokeWidth={4}
        />
      )}
    </MapView>
  )
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  markerContainer: {
    width: 30,
    height: 30,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000',
  },
  markerDotTo: {
    backgroundColor: '#007AFF',
  },
  homeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
  },
  homeButtonFrom: {
    backgroundColor: '#e3f2fd',
  },
  homeButtonTo: {
    backgroundColor: '#fce4ec',
  },
  homeIcon: {
    marginRight: 8,
  },
})
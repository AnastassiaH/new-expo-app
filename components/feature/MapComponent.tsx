import { getRouteCoords } from "@/services/places.service";
import useRideStore from "@/stores/rideStore";
import { PlaceCoords } from "@/types";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

export default function MapComponent() {
  const { fromLocation, toLocation } = useRideStore()
  const [routeCoords, setRouteCoords] = useState<PlaceCoords[]>([])

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const coords = await getRouteCoords(fromLocation!, toLocation!);
        setRouteCoords(coords!);
      } catch (err) {
        console.error('Failed to get route coords:', err);
      }
    };

    if (fromLocation && toLocation) {
      fetchRoute();
    }
  }, [fromLocation, toLocation]);

  return (
    <MapView
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
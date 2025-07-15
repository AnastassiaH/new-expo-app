import { useMapRegion } from '@/hooks/useMapRegion';
import { useRoute } from '@/hooks/useRoute';
import { useLocationStore } from '@/stores/locationStore';
import useRideFormStore from '@/stores/rideFormStore';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polyline } from 'react-native-maps';

export default function Map() {
  const { customCity, useCustomCity, currentLocation } = useLocationStore();
  const { fromLocation, toLocation } = useRideFormStore();
  const mapRef = useRef<MapView>(null);
  const [mapReady, setMapReady] = useState(false);
  const { routeCoords } = useRoute(fromLocation, toLocation);
  const mapRegion = useMapRegion(currentLocation, customCity, useCustomCity);

  useEffect(() => {
    if (mapRef.current) {
      setMapReady(true);
    }
  }, [mapRef]);

  useEffect(() => {
    if (fromLocation && toLocation && routeCoords && routeCoords.length > 0 && mapReady) {
      mapRef.current?.fitToCoordinates(routeCoords, {
        edgePadding: {
          top: 250,
          bottom: 50,
          left: 50,
          right: 50,
        },
        animated: true,
      });
    }
  }, [fromLocation, toLocation, routeCoords, mapReady]);

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        initialRegion={mapRegion}
        region={mapRegion}
        ref={mapRef}
        style={styles.map}
        showsUserLocation={!!currentLocation}
        showsMyLocationButton={false}
        followsUserLocation={true} // IOS only
        onMapReady={() => setMapReady(true)}
      >
        {/* {fromLocation && (
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
        )} */}

        {/* {toLocation && (
          <Marker
            coordinate={{
              latitude: toLocation.latitude,
              longitude: toLocation.longitude,
            }}
            title="To"
            identifier="to"
          >
            <View style={styles.markerContainer}>
              <View style={[styles.markerDot, { backgroundColor: theme.colors.primary }]} />
            </View>
          </Marker>
        )} */}

        {fromLocation && toLocation && (
          <Polyline
            coordinates={routeCoords}
            strokeColor="#007AFF"
            strokeWidth={4}
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
  },
  markerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'white',
    borderWidth: 2,
  },
  customCityDot: {
    backgroundColor: 'blue',
  },
});

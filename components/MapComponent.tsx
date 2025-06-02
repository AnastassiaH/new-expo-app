import { LocationPoint } from '@/types'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import MapView, { Marker, Polyline, Region } from 'react-native-maps'

interface MapComponentProps {
  currentLocation: LocationPoint | null
  fromLocation: LocationPoint | null
  toLocation: LocationPoint | null
  routeCoordinates: any[] | null
  mapRegion: Region
}

const MapComponent: React.FC<MapComponentProps> = ({
  currentLocation,
  fromLocation,
  toLocation,
  routeCoordinates,
  mapRegion
}) => {
  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        region={mapRegion}
        provider={undefined}
        customMapStyle={[]}
      >
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            title="Your Location"
            pinColor="black"
          />
        )}
        {fromLocation && (
          <Marker
            coordinate={fromLocation}
            title="From"
            pinColor="blue"
          />
        )}
        {toLocation && (
          <Marker
            coordinate={toLocation}
            title="To"
            pinColor="red"
          />
        )}
        {routeCoordinates && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#FF0000"
            strokeWidth={3}
          />
        )}
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  mapContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  map: {
    width: '100%',
    height: '100%',
  },
})

export default MapComponent 
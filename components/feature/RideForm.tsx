import PlacesAutocomplete from "@/components/feature/PlacesAutocomplete"
import { ErrorModal, Loader } from "@/components/ui"
import { createRide } from "@/services/api.service"
import { useActiveRideStore } from "@/stores/activeRideStore"
import { useGoogleMapsError } from "@/stores/errorStore"
import { LocationData, useLocationStore } from "@/stores/locationStore"
import useRideFormStore from "@/stores/rideFormStore"
import { PlaceCoords } from "@/types"
import { generateRideData } from "@/utils"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import { Button, TextInput } from "react-native-paper"

export default function RideForm() {
  const { fromLocation, toLocation, setFromLocation, setToLocation, clearForm } = useRideFormStore()
  const [walkDistance, setWalkDistance] = useState<string | null>(null)
  const [isActive, setIsActive] = useState<'from' | 'to' | null>(null)
  const [createRideError, setCreateRideError] = useState<string | null>(null)
  const [lastLocation, setLastLocation] = useState<LocationData | null>(null)
  const [locationUpdating, setLocationUpdating] = useState(false)
  const setMapsError = useGoogleMapsError(s => s.setError)
  const setActiveRide = useActiveRideStore(s => s.setActiveRide)
  const location = useLocationStore(s => s.currentLocation)
  const setSelectorVisible = useLocationStore(s => s.setSelectorVisible)
  const customCity = useLocationStore(s => s.customCity)
  const useCustomCity = useLocationStore(s => s.useCustomCity)
  const locationData = useLocationStore(s => s.locationData)
  const loading = useLocationStore(s => s.loading)

  useEffect(() => {
    if (!location) return;

    const isSignificantChange = lastLocation
      ? Math.abs(location.coords.latitude - lastLocation.coords.latitude) > 0.0001 ||
      Math.abs(location.coords.longitude - lastLocation.coords.longitude) > 0.0001
      : true;

    if (isSignificantChange) {
      setLocationUpdating(true);
      setLastLocation(location);
      setTimeout(() => setLocationUpdating(false), 500);
    }
  }, [location]);

  const onCreateRide = async () => {
    const rideData = generateRideData(fromLocation!, toLocation!, +walkDistance!)

    try {
      const response = await createRide(rideData)
      if (response?.id) {
        setActiveRide(response)
        router.replace('/(app)/partners' as never)
      }
    } catch (error: any) {
      setCreateRideError(error?.message)
    } finally {
      clearForm()
    }
  }

  const onCloseRideError = () => {
    setCreateRideError(null)
    router.replace('/(app)/ride' as never)
    clearForm()
  }

  if (createRideError) {
    return (
      <ErrorModal
        visible={!!createRideError}
        message={createRideError}
        onClose={onCloseRideError}
        tryAgain={onCreateRide}
      />
    )
  }

  if (loading) return <Loader />

  return (
    <View>
      <View style={styles.formWrapper}>
        {locationUpdating && (
          <Loader />
        )}
        <View style={styles.formRow}>
          <View style={[styles.inputContainer, { width: '100%' }]}>
            <Ionicons name="location" size={20} color="black" style={styles.inputIcon} />
            <PlacesAutocomplete
              placeholder="From"
              active={isActive === 'from'}
              onPlaceSelect={(location) => {
                setFromLocation(location)
                setIsActive(null)
              }}
              searchCoords={useCustomCity ? customCity! as PlaceCoords : lastLocation?.coords!}
              predictedAddresses={useCustomCity ? [] : locationData?.addresses}
              city={useCustomCity ? customCity?.name! : locationData?.city!}
              onError={setMapsError}
              onFocus={() => {
                !lastLocation?.coords && !customCity && setSelectorVisible(true)
                setIsActive('from')
              }}
              testID="from-input"
            />
          </View>
        </View>
        <View style={styles.formRow}>
          <View style={[styles.inputContainer]}>
            <Ionicons name="flag" size={20} color="black" style={styles.inputIcon} />
            <PlacesAutocomplete
              placeholder="To"
              active={isActive === 'to'}
              onPlaceSelect={(location) => {
                setToLocation(location)
                setIsActive(null)
              }}
              searchCoords={useCustomCity ? customCity! as PlaceCoords : location?.coords!}
              city={useCustomCity ? customCity?.name! : locationData?.city!}
              onError={setMapsError}
              onFocus={() => {
                !location?.coords && !customCity && setSelectorVisible(true)
                setIsActive('to')
              }}
            />
          </View>
        </View>
        <View style={[styles.inputContainer, { backgroundColor: '#f5f5f5' }]}>
          <Ionicons name="walk" size={20} color="black" style={styles.inputIcon} />
          <TextInput
            keyboardType="numeric"
            textColor="black"
            style={styles.input}
            selectionColor="black"
            placeholderTextColor="black"
            underlineColor="transparent"
            placeholder="Can walk (meters)"
            value={walkDistance || ''}
            onChangeText={(num) => setWalkDistance(num)}
            returnKeyType="done"
          />
        </View>
        <Button
          mode="contained"
          onPress={onCreateRide}
          style={{ marginTop: 20 }}
        >
          Create a ride
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  formWrapper: {
    width: '100%',
    gap: 10,
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 40,
    zIndex: 1,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    borderRadius: 8,
  },
  inputIcon: {
    position: 'absolute',
    left: 10,
    top: 14,
    zIndex: 1
  },
  input: {
    height: 50,
    borderRadius: 4,
    paddingHorizontal: 40,
    color: '#000',
    width: '100%',
    backgroundColor: '#fff',
    flex: 1,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
})
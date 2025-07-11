import PlacesAutocomplete from "@/components/feature/PlacesAutocomplete"
import { ErrorModal, Loader } from "@/components/ui"
import { WALK_DISTANCE_MAX } from "@/constants"
import { createRide } from "@/services/api.service"
import { useActiveRideStore } from "@/stores/activeRideStore"
import { useGoogleMapsError } from "@/stores/errorStore"
import { LocationData, useLocationStore } from "@/stores/locationStore"
import useRideFormStore from "@/stores/rideFormStore"
import { LocationPoint, PlaceCoords } from "@/types"
import { generateRideData } from "@/utils"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import { Button, TextInput, useTheme } from "react-native-paper"

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
  const [validationErrors, setValidationErrors] = useState<{
    from?: boolean
    to?: boolean
    walk?: boolean
  }>({
    from: false,
    to: false,
    walk: false,
  })
  const theme = useTheme()
  const [fromInputValue, setFromInputValue] = useState('');
  const [toInputValue, setToInputValue] = useState('');

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

  const validateForm = (fromLocation: LocationPoint | null, toLocation: LocationPoint | null, walkDistance: string | null) => {
    const newErrors = {
      from: !fromLocation || (!fromLocation?.latitude || !fromLocation?.longitude),
      to: !toLocation || (!toLocation?.latitude || !toLocation?.longitude),
      walk: !walkDistance || isNaN(+walkDistance) || +walkDistance <= 0 || +walkDistance > WALK_DISTANCE_MAX,
    }
    setValidationErrors(newErrors)

    return !Object.values(newErrors).some(Boolean)
  }

  const clearValidationErrors = () => {
    setValidationErrors({
      from: false,
      to: false,
      walk: false,
    })
  }

  const onCreateRide = async () => {
    if (!validateForm(fromLocation, toLocation, walkDistance)) return

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
        <View style={styles.formRow}>
          <View style={[styles.inputContainer, { width: '100%' }]}>
            <Ionicons name="location" size={20} color="black" style={styles.inputIcon} />
            <PlacesAutocomplete
              value={fromInputValue}
              onChangeText={text => {
                setFromInputValue(text);
                setFromLocation(null);
              }}
              onPlaceSelect={place => {
                setFromLocation(place);
                setFromInputValue(place?.description || '');
              }}
              placeholder="From"
              active={isActive === 'from'}
              searchCoords={useCustomCity ? customCity! as PlaceCoords : lastLocation?.coords!}
              predictedAddresses={useCustomCity ? [] : locationData?.addresses}
              city={useCustomCity ? customCity?.name! : locationData?.city!}
              onError={setMapsError}
              onFocus={() => {
                !lastLocation?.coords && !customCity && setSelectorVisible(true)
                setIsActive('from')
                setValidationErrors({
                  from: false,
                  to: false,
                  walk: false,
                })
              }}
              testID="from-input"
              isValidationError={validationErrors?.from}
              clearValidationErrors={clearValidationErrors}
            />
          </View>
        </View>
        <View style={styles.formRow}>
          <View style={[styles.inputContainer, validationErrors?.to && { borderColor: theme.colors.error }]}>
            <Ionicons name="flag" size={20} color="black" style={styles.inputIcon} />
            <PlacesAutocomplete
              placeholder="To"
              value={toInputValue}
              onChangeText={text => {
                setToInputValue(text);
                setToLocation(null);
              }}
              active={isActive === 'to'}
              onPlaceSelect={(location) => {
                setToLocation(location)
                setToInputValue(location?.description || '')
              }}
              searchCoords={useCustomCity ? customCity! as PlaceCoords : location?.coords!}
              city={useCustomCity ? customCity?.name! : locationData?.city!}
              onError={setMapsError}
              onFocus={() => {
                !location?.coords && !customCity && setSelectorVisible(true)
                setIsActive('to')
                setValidationErrors({
                  from: false,
                  to: false,
                  walk: false,
                })
              }}
              isValidationError={validationErrors?.to}
              clearValidationErrors={clearValidationErrors}
            />
          </View>
        </View>
        <View style={[styles.inputContainer, { backgroundColor: '#f5f5f5' }]}>
          <Ionicons name="walk" size={20} color="black" style={styles.inputIcon} />
          <TextInput
            keyboardType="numeric"
            textColor="black"
            style={[styles.input, validationErrors?.walk && { borderColor: theme.colors.error }]}
            selectionColor="black"
            placeholderTextColor="black"
            underlineColor="transparent"
            placeholder="Can walk (meters)"
            value={walkDistance || ''}
            onChangeText={(num) => {
              setWalkDistance(num)
              clearValidationErrors()
            }}
            returnKeyType="done"
            mode="outlined"
            outlineStyle={{ borderColor: 'transparent' }}
            onFocus={() => {
              setValidationErrors({
                from: false,
                to: false,
                walk: false,
              })
            }}
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
    paddingHorizontal: 25,
    color: '#000',
    width: '100%',
    backgroundColor: '#fff',
    flex: 1,
    borderColor: 'transparent',
    borderWidth: 1,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
})
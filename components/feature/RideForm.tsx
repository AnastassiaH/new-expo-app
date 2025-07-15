import PlacesAutocomplete from "@/components/feature/PlacesAutocomplete"
import { ErrorModal, Loader } from "@/components/ui"
import { WALK_DISTANCE_MAX } from "@/constants"
import { useRideCancellation } from "@/hooks/useRideCancellation"
import { createRide } from "@/services/api.service"
import { useActiveRideStore } from "@/stores/activeRideStore"
import { useGoogleMapsError } from "@/stores/errorStore"
import { useLocationStore } from "@/stores/locationStore"
import useRideFormStore from "@/stores/rideFormStore"
import { LocationPoint, PlaceCoords } from "@/types"
import { generateRideData } from "@/utils"
import { Ionicons } from "@expo/vector-icons"
import { router, useFocusEffect } from "expo-router"
import { useCallback, useState } from "react"
import { StyleSheet, View } from "react-native"
import { Button, TextInput, useTheme } from "react-native-paper"
import ConfirmationModal from "../ui/ConfirmationModal"

export default function RideForm() {
  const fromLocation = useRideFormStore(s => s.fromLocation)
  const toLocation = useRideFormStore(s => s.toLocation)
  const setFromLocation = useRideFormStore(s => s.setFromLocation)
  const setToLocation = useRideFormStore(s => s.setToLocation)
  const [walkDistance, setWalkDistance] = useState<string | null>(null)
  const [isActive, setIsActive] = useState<'from' | 'to' | null>(null)
  const [createRideError, setCreateRideError] = useState<string | null>(null)
  const setMapsError = useGoogleMapsError(s => s.setError)
  const [isActiveRideModalVisible, setIsActiveRideModalVisible] = useState(false)
  const activeRide = useActiveRideStore(s => s.activeRide)
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
  const { handleConfirmCancel, loading: cancellationLoading, error: cancellationError } = useRideCancellation()
  const [isRideCreating, setIsRideCreating] = useState(false)

  useFocusEffect(
    useCallback(() => {
      return () => {
        setFromLocation(null)
        setToLocation(null)
        setWalkDistance(null)
        setIsActive(null)
        setValidationErrors({
          from: false,
          to: false,
          walk: false,
        })
      }
    }, [])
  )

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
    if (activeRide?.id) {
      setIsActiveRideModalVisible(true)
      return
    }
    if (!validateForm(fromLocation, toLocation, walkDistance)) return

    const rideData = generateRideData(fromLocation!, toLocation!, +walkDistance!)

    try {
      setIsRideCreating(true)
      const response = await createRide(rideData)
      if (response?.id) {
        setActiveRide(response)
      }
    } catch (error: any) {
      setCreateRideError(error?.message)
    } finally {
      setIsRideCreating(false)
      setFromLocation(null)
      setToLocation(null)
      setWalkDistance(null)
    }
  }

  const onCloseRideError = () => {
    setCreateRideError(null)
    router.replace('/(app)/ride' as never)
    setFromLocation(null)
    setToLocation(null)
    setWalkDistance(null)
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
        {isRideCreating &&
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, opacity: 0.5 }}>
            <Loader />
          </View>}
        <View style={styles.formRow}>
          <View style={[styles.inputContainer, { width: '100%' }]}>
            <Ionicons name="location" size={20} color="black" style={styles.inputIcon} />
            <PlacesAutocomplete
              onPlaceSelect={setFromLocation}
              placeholder="From"
              active={isActive === 'from'}
              searchCoords={useCustomCity ? customCity! as PlaceCoords : location?.coords!}
              predictedAddresses={useCustomCity ? [] : locationData?.addresses}
              city={useCustomCity ? customCity?.name! : locationData?.city!}
              onError={setMapsError}
              onFocus={() => {
                !location?.coords && !customCity && setSelectorVisible(true)
                setIsActive('from')
                clearValidationErrors()
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
              active={isActive === 'to'}
              onPlaceSelect={setToLocation}
              searchCoords={useCustomCity ? customCity! as PlaceCoords : location?.coords!}
              city={useCustomCity ? customCity?.name! : locationData?.city!}
              onError={setMapsError}
              onFocus={() => {
                !location?.coords && !customCity && setSelectorVisible(true)
                setIsActive('to')
                clearValidationErrors()
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
            onFocus={clearValidationErrors}
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
      <ConfirmationModal
        visible={isActiveRideModalVisible}
        message="Хочете скасувати цю та створити нову?"
        title="Активна поїздка вже створена"
        loading={cancellationLoading}
        onConfirm={() => {
          handleConfirmCancel()
          setIsActiveRideModalVisible(false)
        }}
        onClose={() => {
          setIsActiveRideModalVisible(false)
        }}
      />
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
import PlacesAutocomplete from "@/components/feature/PlacesAutocomplete"
import { useCurrentLocationData } from "@/hooks/useCurrentLocationData"
import { createRide } from "@/services/api.service"
import { useGoogleMapsError } from "@/stores/errorStore"
import useRideStore from "@/stores/rideStore"
import { generateRideData } from "@/utils"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import { Button, Modal, Portal, TextInput } from "react-native-paper"
import { Loader } from "../ui"

export default function RideForm() {
  const { setActiveRide, fromLocation, toLocation, setFromLocation, setToLocation } = useRideStore()
  const { currentLocationData, currentCoords, loading } = useCurrentLocationData()
  const [walkDistance, setWalkDistance] = useState<string | null>(null)
  const [createRideError, setCreateRideError] = useState<string | null>(null)
  const setMapsError = useGoogleMapsError(s => s.setError)

  const onCreateRide = async () => {
    const rideData = generateRideData(fromLocation!, toLocation!, +walkDistance!)

    try {
      const response = await createRide(rideData)
      if (response?.id) {
        setActiveRide(response)
        router.replace('/(app)/Partners')
      }
    } catch (error: any) {
      console.log('create ride error', error?.code, error)
      setCreateRideError(error?.message)
    }
  }

  if (createRideError) return (
    <Portal>
      <Modal visible={!!createRideError} onDismiss={() => {
        setCreateRideError(null)
        router.reload()
      }}>
        <View>
          <Text style={{ color: '#ff0000', fontSize: 16 }}>{createRideError}</Text>
        </View>
      </Modal>
    </Portal>
  )

  if (loading) return <Loader />

  return (
    <View>
      <View style={styles.formWrapper}>
        <View style={styles.formRow}>
          <View style={[styles.inputContainer, { width: '100%' }]}>
            <Ionicons name="location" size={20} color="black" style={styles.inputIcon} />
            <PlacesAutocomplete
              placeholder="From"
              onPlaceSelect={(location) => setFromLocation(location)}
              currentCoords={currentCoords}
              currentLocationData={currentLocationData}
              currentEnabled={true}
              onError={setMapsError}
            />
          </View>
        </View>
        <View style={styles.formRow}>
          <View style={[styles.inputContainer]}>
            <Ionicons name="flag" size={20} color="black" style={styles.inputIcon} />
            <PlacesAutocomplete
              placeholder="To"
              onPlaceSelect={(location) => setToLocation(location)}
              currentCoords={currentCoords}
              currentLocationData={currentLocationData}
              onError={setMapsError}
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
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
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
  },
})
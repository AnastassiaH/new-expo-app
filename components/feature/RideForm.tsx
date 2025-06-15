import PlacesAutocomplete from "@/components/feature/PlacesAutocomplete"
import { useCurrentLocationData } from "@/hooks/useCurrentLocationData"
import { createRide } from "@/services/api.service"
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

  const onCreateRide = async () => {
    const rideData = generateRideData(fromLocation!, toLocation!, +walkDistance!)

    try {
      const response = await createRide(rideData)
      if (response?.id) {
        setActiveRide(response)
        router.replace('/(app)/partners')
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
            />
          </View>
        </View>
        <View style={[styles.inputContainer, { backgroundColor: '#f5f5f5' }]}>
          <Ionicons name="walk" size={20} color="black" style={styles.inputIcon} />
          <TextInput
            keyboardType="numeric"
            style={[
              styles.input,
              // { borderColor: errors.fromDist ? 'red' : '#000', borderWidth: 0 }
            ]}
            selectionColor="black"
            underlineColor="transparent"
            mode="outlined"
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    minWidth: '45%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  confirmButton: {
    backgroundColor: '#ff4444',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  formWrapper: {
    width: '100%',
    gap: 10,
    backgroundColor: 'transparent',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
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
    height: 52,
    flex: 1,
    width: '100%',
    paddingLeft: 40,
    borderRadius: 8,
  },
  separator: {
    backgroundColor: '#000',
    color: '#000',
    height: 1
  },
  listView: {
    position: 'absolute',
    top: '100%',
    left: 0,
    height: '400%',
    right: 0,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 4,
    zIndex: 10,
    backgroundColor: '#dddddd',
    opacity: 0.9,
  },
  row: {
    padding: 12,
    borderBottomWidth: 1,
    backgroundColor: 'rgba(255,0,0,0.2)',
    borderColor: '#blue',
  },
  homeButtonsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
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
  homeText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
})
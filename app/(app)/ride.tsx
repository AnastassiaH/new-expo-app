import RideForm from "@/components/feature/RideForm";
import { useLocationStore } from "@/stores/locationStore";
import shared from "@/styles/shared";
import { LocationPoint } from "@/types";
import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";


export default function Ride() {
	const [stringLocation, setStringLocation] = useState<string | null>(null)
	const [fromLocation, setFromLocation] = useState<LocationPoint | null>(null)
	const [toLocation, setToLocation] = useState<LocationPoint | null>(null)
	const [mapRegion, setMapRegion] = useState({
		latitude: 49.8397,
		longitude: 24.0297,
		latitudeDelta: 0.0922,
		longitudeDelta: 0.0421,
	})
	const [routeCoordinates, setRouteCoordinates] = useState<[] | null>([])
	const [isCancelModalVisible, setIsCancelModalVisible] = useState(false)
	// const loadPersistedHomeAddress = useUserStore(state => state.loadPersistedHomeAddress)
	const { location: userLocation, requestLocation } = useLocationStore()

	useEffect(() => {
		console.log('ride rendered')
	}, [])

	// useEffect(() => {
	// 	loadPersistedHomeAddress()
	// }, [])

	// useEffect(() => {
	// 	if (stringLocation) {
	// 		setMapRegion({
	// 			latitude: +stringLocation.split(',')[0],
	// 			longitude: +stringLocation.split(',')[1],
	// 			latitudeDelta: 0.0922,
	// 			longitudeDelta: 0.0421,
	// 		})
	// 	}
	// }, [stringLocation])

	// if (!userLocation) {
	// 	return null // ask user for a permission to access location modal with portal later
	// }

	return (
		<View style={{ flex: 1 }}>
			<View style={[shared.container, { justifyContent: 'flex-start', paddingTop: 60 }]}>
				{/* <MapComponent
					currentLocation={stringLocation ? {
						latitude: +stringLocation.split(',')[0],
						longitude: +stringLocation.split(',')[1],
						formatted_address: '',
					} : null}
					fromLocation={fromLocation}
					toLocation={toLocation}
					routeCoordinates={routeCoordinates}
					mapRegion={mapRegion}
				/> */}

				<RideForm />

			</View>

			<Modal
				animationType="slide"
				transparent={true}
				visible={isCancelModalVisible}
				onRequestClose={() => setIsCancelModalVisible(false)}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Cancel Current Ride?</Text>
						<Text style={styles.modalText}>
							You have an active ride. Do you want to cancel it and create a new one?
						</Text>
						<View style={styles.modalButtons}>
							<TouchableOpacity
								style={[styles.modalButton, styles.cancelButton]}
								onPress={() => setIsCancelModalVisible(false)}
							>
								<Text style={styles.buttonText}>Keep Current</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.modalButton, styles.confirmButton]}
							// onPress={handleCancelConfirmation}
							>
								<Text style={styles.buttonText}>Cancel & Create</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
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

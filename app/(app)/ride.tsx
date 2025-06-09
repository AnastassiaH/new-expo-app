import MapComponent from "@/components/MapComponent";
import SignOutButton from "@/components/SignOutButton";
import { DEFAULT_ERROR_MESSAGE } from "@/constants";
import { cancelRide, createRide } from "@/services/api.service";
import { adjustMapRegion, fetchRoute } from '@/services/map.service';
import { useLocationStore } from "@/stores/locationStore";
import useRideStore from "@/stores/rideStore";
import { useUserStore } from "@/stores/userStore";
import shared from "@/styles/shared";
import { LocationPoint, RideData } from "@/types";
import { generateRideData, isLocationObject } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import * as Location from 'expo-location';
import { ErrorBoundaryProps, router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GooglePlaceData, GooglePlaceDetail, GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Button, TextInput as PaperTextInput, useTheme } from "react-native-paper";

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
	return (
		<View style={{ flex: 1, backgroundColor: "beige" }}>
			<Text>{error.message || DEFAULT_ERROR_MESSAGE}</Text>
			<Text onPress={retry}>Try Again?</Text>
		</View>
	);
}

export default function Page() {
	const theme = useTheme()
	const [error, setError] = useState<Error | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [stringLocation, setStringLocation] = useState<string | null>(null)
	const { setActiveRide, activeRide } = useRideStore()
	const [fromLocation, setFromLocation] = useState<LocationPoint | null>(null)
	const [toLocation, setToLocation] = useState<LocationPoint | null>(null)
	const [mapRegion, setMapRegion] = useState({
		latitude: 49.8397,
		longitude: 24.0297,
		latitudeDelta: 0.0922,
		longitudeDelta: 0.0421,
	})
	const [routeCoordinates, setRouteCoordinates] = useState<[] | null>([])
	const [fromValue, setFromValue] = useState<string | null>(null)
	const [toValue, setToValue] = useState<string | null>(null)
	const [isCancelModalVisible, setIsCancelModalVisible] = useState(false)
	const [pendingRideData, setPendingRideData] = useState<RideData | null>(null)
	const { homeAddress } = useUserStore()
	const loadPersistedHomeAddress = useUserStore(state => state.loadPersistedHomeAddress)
	const { location: userLocation } = useLocationStore()

	const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY

	const {
		control,
		handleSubmit,
		setValue,
		clearErrors,
		formState: { errors }
	} = useForm()

	useEffect(() => {
		checkLocation()
	}, [])

	useEffect(() => {
		if (!toValue) {
			setRouteCoordinates(null)
			setToLocation(null)
		}
	}, [toValue])

	useEffect(() => {
		if (!fromValue) {
			setRouteCoordinates(null)
			setFromLocation(null)
		}
	}, [fromValue])

	useEffect(() => {
		if (stringLocation) {
			setMapRegion({
				latitude: +stringLocation.split(',')[0],
				longitude: +stringLocation.split(',')[1],
				latitudeDelta: 0.0922,
				longitudeDelta: 0.0421,
			})
		}
	}, [stringLocation])

	useEffect(() => {
		loadPersistedHomeAddress()
	}, [])

	const checkLocation = useCallback(async () => {
		setIsLoading(true)
		try {
			let location = await Location.getCurrentPositionAsync({})
			if (location) {
				setStringLocation(
					() => `${location.coords.latitude},${location.coords.longitude}`
				)
				console.log(location)
				setIsLoading(false)
			}
		} catch (error) {
			console.log('Location error', error)
			setError(error as Error)
		} finally {
			setIsLoading(false)
		}
	}, [])

	const onCreateRide = async (data: any) => {
		const rideData = generateRideData(data)

		if (activeRide) {
			setPendingRideData(rideData)
			setIsCancelModalVisible(true)
			return
		}

		try {
			const response = await createRide(rideData)
			if (response?.id) {
				setActiveRide(response)
				router.replace('/(app)/partners')
			}
		} catch (error: any) {
			console.log('ride screen error', error?.code, error)
		}

		setValue('fromDist', '')
		setValue('toDist', '')
		setValue('from', '')
		setValue('to', '')
		setFromLocation(null)
		setToLocation(null)
		setRouteCoordinates(null)
	}

	const handleCancelConfirmation = async () => {
		setIsCancelModalVisible(false)

		if (!activeRide?.id) {
			return
		}

		if (pendingRideData) {
			clearLocations()
			try {
				await cancelRide(activeRide.id)
				const response = await createRide(pendingRideData)
				if (response?.id) {
					setActiveRide(response)
					router.replace('/(app)/partners')
				}
			} catch (error) {
				console.log('Error canceling ride:', error)
			}
		}
	}

	const clearLocations = () => {
		setValue('from', '')
		setValue('to', '')
		setFromLocation(null)
		setToLocation(null)
		setRouteCoordinates(null)
	}

	const onFromLocationSelect = (_: GooglePlaceData, details: GooglePlaceDetail | null) => {
		if (!details) {
			clearLocations()
			return
		}
		const location = {
			latitude: details.geometry?.location.lat,
			longitude: details.geometry?.location.lng
		}
		setValue('from', {
			formatted_address: details.formatted_address,
			lat: location.latitude,
			lng: location.longitude
		})
		setFromLocation(location)
		if (toLocation) {
			fetchRoute(location, toLocation).then(coordinates => {
				setRouteCoordinates(coordinates)
			})
			const newRegion = adjustMapRegion(location, toLocation)
			if (newRegion) {
				setMapRegion(newRegion)
			}
		}
	}

	const onToLocationSelect = (_: GooglePlaceData, details: GooglePlaceDetail | null) => {
		if (!details) {
			clearLocations()
			return
		}
		const location = {
			latitude: details.geometry?.location.lat,
			longitude: details.geometry?.location.lng
		}
		setValue('to', {
			formatted_address: details.formatted_address,
			lat: location.latitude,
			lng: location.longitude
		})
		setToLocation(location)
		if (fromLocation) {
			fetchRoute(fromLocation, location).then(coordinates => {
				setRouteCoordinates(coordinates)
			})
			const newRegion = adjustMapRegion(fromLocation, location)
			if (newRegion) {
				setMapRegion(newRegion)
			}
		}
	}

	const handlePickHome = (isFrom: boolean) => {
		if (homeAddress) {
			const locationData = {
				formatted_address: homeAddress.formatted_address,
				lat: homeAddress.latitude,
				lng: homeAddress.longitude
			}
			const location = {
				latitude: homeAddress.latitude,
				longitude: homeAddress.longitude
			}

			if (isFrom) {
				setValue('from', locationData)
				setFromLocation(location)
				if (toLocation) {
					fetchRoute(location, toLocation).then(coordinates => {
						setRouteCoordinates(coordinates)
					})
					const newRegion = adjustMapRegion(location, toLocation)
					if (newRegion) {
						setMapRegion(newRegion)
					}
				}
			} else {
				setValue('to', locationData)
				setToLocation(location)
				if (fromLocation) {
					fetchRoute(fromLocation, location).then(coordinates => {
						setRouteCoordinates(coordinates)
					})
					const newRegion = adjustMapRegion(fromLocation, location)
					if (newRegion) {
						setMapRegion(newRegion)
					}
				}
			}
		}
	}

	if (!userLocation) {
		return null // ask user for a permission to access location modal with portal
	}

	return (
		<SafeAreaView>
			<View style={{ flex: 1 }}>

				<SignOutButton />
				{/* <Text style={{ fontSize: 20, color: 'gray' }}>Ride</Text>
				<Button style={{ marginTop: 20 }} mode="contained" onPress={() => Alert.alert('Message', 'Hello World!')}>Show message</Button>
			   */}
				<View style={[shared.container, { justifyContent: 'flex-start' }]}>
					<MapComponent
						currentLocation={stringLocation ? {
							latitude: +stringLocation.split(',')[0],
							longitude: +stringLocation.split(',')[1]
						} : null}
						fromLocation={fromLocation}
						toLocation={toLocation}
						routeCoordinates={routeCoordinates}
						mapRegion={mapRegion}
					/>

					<View style={styles.formWrapper}>
						{homeAddress && (
							<View style={styles.homeButtonsContainer}>
								<TouchableOpacity
									style={[styles.homeButton, styles.homeButtonFrom]}
									onPress={() => handlePickHome(true)}
								>
									<Ionicons name="home" size={20} color="#333" style={styles.homeIcon} />
									<Text numberOfLines={1} style={styles.homeText}>
										From Home
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[styles.homeButton, styles.homeButtonTo]}
									onPress={() => handlePickHome(false)}
								>
									<Ionicons name="home" size={20} color="#333" style={styles.homeIcon} />
									<Text numberOfLines={1} style={styles.homeText}>
										To Home
									</Text>
								</TouchableOpacity>
							</View>
						)}
						<View style={styles.formRow}>
							<Controller
								control={control}
								name="from"
								rules={{
									validate: isLocationObject,
									required: 'You must enter a place from'
								}}
								render={({ field }) => (
									<View style={[styles.inputContainer]}>
										<Ionicons name="location" size={20} color="black" style={styles.inputIcon} />
										<GooglePlacesAutocomplete
											placeholder="My location"
											predefinedPlaces={[]}
											predefinedPlacesAlwaysVisible={false}
											fetchDetails={true}
											query={{
												key: GOOGLE_PLACES_API_KEY,
												language: 'en',
												components: 'country:ua',
												location: stringLocation,
												radius: 10000
											}}
											onPress={onFromLocationSelect}
											enablePoweredByContainer={false}
											styles={{
												textInput: {
													...styles.input,
													borderWidth: 1,
													borderColor: errors.from ? theme.colors.error : theme.colors.outline,
												},
												separator: styles.separator,
												listView: styles.listView,
												row: styles.row
											}}
											textInputProps={{
												onFocus: () => clearErrors('from'),
												value: field.value?.formatted_address || '',
												onChangeText: (text) => {
													if (!text) {
														field.onChange(null)
													}
												}
											}}
										/>
									</View>
								)}
							/>
						</View>
						<View style={styles.formRow}>
							<Controller
								control={control}
								name="to"
								rules={{
									validate: isLocationObject,
									required: 'You must enter a place to'
								}}
								render={({ field }) => (
									<View style={[styles.inputContainer]}>
										<Ionicons name="flag" size={20} color="black" style={styles.inputIcon} />
										<GooglePlacesAutocomplete
											placeholder="Where to"
											fetchDetails={true}
											predefinedPlaces={[]}
											predefinedPlacesAlwaysVisible={false}
											query={{
												key: GOOGLE_PLACES_API_KEY,
												language: 'en',
												components: 'country:ua',
												location: stringLocation,
												radius: 10000
											}}
											onPress={onToLocationSelect}
											enablePoweredByContainer={false}
											styles={{
												textInput: {
													...styles.input,
													margin: 0,
													borderWidth: 1,
													borderColor: errors.to ? theme.colors.error : theme.colors.outline,
												},
												separator: styles.separator,
												listView: styles.listView,
												row: styles.row
											}}
											textInputProps={{
												onFocus: () => clearErrors('to'),
												value: field.value?.formatted_address || '',
												onChangeText: (text) => {
													if (!text) {
														field.onChange(null)
													}
												}
											}}
										/>
									</View>
								)}
							/>
						</View>
						<Controller
							control={control}
							name="fromDist"
							rules={{
								pattern: /^[1-9][0-9]{0,3}$/g,
								required: 'You must enter a distance'
							}}
							render={({ field: { value } }) => (
								<View style={[styles.inputContainer, { backgroundColor: '#f5f5f5' }]}>
									<Ionicons name="walk" size={20} color="black" style={styles.inputIcon} />
									<PaperTextInput
										keyboardType="numeric"
										style={[
											styles.input,
											{ borderColor: errors.fromDist ? theme.colors.error : '#000', borderWidth: 0 }
										]}
										selectionColor="black"
										underlineColor="transparent"
										mode="outlined"
										placeholder="Can walk (meters)"
										value={value}
										onChangeText={(num) => setValue('fromDist', num)}
										returnKeyType="done"
										onFocus={() => clearErrors('fromDist')}
									/>
								</View>
							)}
						/>
						<Button
							mode="contained"
							onPress={handleSubmit(onCreateRide)}
							style={{ marginTop: 20 }}
						>
							Create a ride
						</Button>
					</View>

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
									onPress={handleCancelConfirmation}
								>
									<Text style={styles.buttonText}>Cancel & Create</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>
			</View>
		</SafeAreaView>
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
		right: 0,
		borderWidth: 1,
		borderRadius: 8,
		marginTop: 4,
		zIndex: 10,
	},
	row: {
		padding: 12,
		borderBottomWidth: 1,
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

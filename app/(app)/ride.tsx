import Map from "@/components/feature/Map";
import RideForm from "@/components/feature/RideForm";
import ErrorOverlay from "@/components/ui/ErrorOverlay";
import { DEFAULT_ERROR_MESSAGE, DEFAULT_MAPS_ERROR_MESSAGE } from "@/constants";
import { useGoogleMapsError } from "@/stores/errorStore";
import { ErrorBoundaryProps } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#fff", alignItems: 'center', justifyContent: 'center' }}>
			<Text>{error.message || DEFAULT_ERROR_MESSAGE}</Text>
			<Text onPress={retry}>Try Again?</Text>
		</SafeAreaView>
	);
}

export default function Ride() {
	const mapError = useGoogleMapsError(s => s.error)
	const clearMapError = useGoogleMapsError(s => s.clearError)

	if (mapError) return (
		<ErrorOverlay error={mapError || DEFAULT_MAPS_ERROR_MESSAGE} clearError={clearMapError} />
	)

	return (
		<View style={{ flex: 1 }}>
			<View style={styles.container}>
				<Map />

				<View style={styles.formContainer}>
					<RideForm />
				</View>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	formContainer: {
		position: 'absolute',
		top: 80,
		left: 0,
		right: 0,
		backgroundColor: 'transparent',
		paddingVertical: 20,
		shadowColor: '#000',
		shadowOffset: {
			height: -2,
			width: 0,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 5,
	}
})
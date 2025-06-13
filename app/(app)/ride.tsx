import MapComponent from "@/components/feature/MapComponent";
import RideForm from "@/components/feature/RideForm";
import { DEFAULT_ERROR_MESSAGE } from "@/constants";
import { ErrorBoundaryProps } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
			<Text>{error.message || DEFAULT_ERROR_MESSAGE}</Text>
			<Text onPress={retry}>Try Again?</Text>
		</SafeAreaView>
	);
}

export default function Ride() {
	return (
		<View style={{ flex: 1 }}>
			<View style={styles.container}>
				<MapComponent />

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
		top: 50,
		left: 0,
		right: 0,
		backgroundColor: 'transparent',
		padding: 16,
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
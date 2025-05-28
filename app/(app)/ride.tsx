import { Button } from "@/components/atoms";
import { useAuthStore } from "@/stores/authStore";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Ride() {
	const { signOut } = useAuthStore()
	return (
		<SafeAreaView>
			<View>
				<Button style={{}} mode="contained" onPress={signOut} >Logout</Button>
				<Text style={{ fontSize: 20, color: 'gray' }}>Ride</Text>
			</View>
		</SafeAreaView>
	)
}
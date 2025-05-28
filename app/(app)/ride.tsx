import { Button } from "@/components/atoms";
import SignOutButton from "@/components/SignOutButton";
import { Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Ride() {
	return (
		<SafeAreaView>
			<View>
				<SignOutButton />
				<Text style={{ fontSize: 20, color: 'gray' }}>Ride</Text>
				<Button style={{ marginTop: 20 }} mode="contained" onPress={() => Alert.alert('Message', 'Hello World!')}>Show message</Button>
			</View>
		</SafeAreaView>
	)
}
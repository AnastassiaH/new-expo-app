import { View } from "react-native"
import { useTheme } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"

export default function ScreenWrapper({ children }: { children: React.ReactNode }) {
  const theme = useTheme()
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.secondaryContainer }}>
      <View style={{
        flex: 1,
        paddingTop: 80,
        paddingHorizontal: 20,
      }}>
        {children}
      </View>
    </SafeAreaView>
  )
}
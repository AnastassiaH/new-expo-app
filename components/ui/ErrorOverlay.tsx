import { Text, View } from "react-native";
import { Button, useTheme } from "react-native-paper";

export default function ErrorOverlay({ error, clearError }: { error: string | null, clearError: () => void }) {
  const theme = useTheme()

  if (!error) return null

  return (
    <View style={{ backgroundColor: theme.colors.error, padding: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
      <Text style={{ color: theme.colors.onSurface }}>{error}</Text>
      <Button onPress={clearError}>Close</Button>
    </View>
  )
}
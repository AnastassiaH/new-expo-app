import { Text, View } from "react-native";
import { Button, useTheme } from "react-native-paper";

export default function ErrorOverlay({ error, clearError }: { error: string | null, clearError: () => void }) {
  const theme = useTheme()

  if (!error) return null

  return (
    <View style={{ backgroundColor: theme.colors.error, padding: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
      <Text style={{ color: theme.colors.onSurface, fontSize: 16, fontWeight: 'bold', marginBottom: 40 }}>{error}</Text>
      <Button mode="contained" style={{ minWidth: 160 }} onPress={clearError}>Close</Button>
    </View>
  )
}
import { useLocationStore } from "@/stores/locationStore"
import { StyleSheet } from "react-native"
import { Button, Card, Switch, Text, useTheme } from "react-native-paper"

export default function CityToggle() {
  const { setSelectorVisible, customCity, useCustomCity, toggleUseCustomCity,
    locationData
  } = useLocationStore()
  const theme = useTheme()

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.primary }]} >
      <Card.Title
        title="Ваше місто"
        subtitle={useCustomCity ? customCity?.name : locationData?.city || 'Не встановлено'}
        titleStyle={styles.title}
        subtitleStyle={styles.subtitle}
        right={() => (
          <Button
            mode="contained-tonal"
            onPress={() => setSelectorVisible(true)}
            compact
            style={styles.editBtn}
          >
            Змінити
          </Button>
        )}
      />
      <Card.Actions style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text>Використати поточну локацію:</Text>
        <Switch
          value={!useCustomCity}
          onValueChange={toggleUseCustomCity}
        />
      </Card.Actions>
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#5C93B7',
    elevation: 2,
    marginBottom: 16,
  },
  title: { color: '#fff', fontSize: 18, fontWeight: '600' },
  subtitle: { color: '#F0F6FA' },
  editBtn: { marginRight: 8 },
});
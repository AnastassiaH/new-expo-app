import { useLocationStore } from "@/stores/locationStore";
import React from 'react';
import { StyleSheet } from "react-native";
import { Button, Card, Switch, Text, useTheme } from "react-native-paper";

export default function CityToggle() {
  const { setSelectorVisible, customCity, setUseCustomCity,
    locationData, useCustomCity
  } = useLocationStore()
  const theme = useTheme()


  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.primary }]} >
      <Card.Title
        title={useCustomCity ? 'Вибране місто' : 'Ваше місто'}
        subtitle={useCustomCity
          ? customCity?.name || 'Не встановлено'
          : locationData?.city || 'Не встановлено'}
        titleStyle={styles.title}
        subtitleStyle={styles.subtitle}
        right={() => (
          <>
            <Button
              mode="contained-tonal"
              onPress={() => setSelectorVisible(true)}
              compact
              style={styles.editBtn}
            >
              Змінити
            </Button>
          </>
        )}
      />
      {locationData?.city && customCity && customCity.name !== locationData.city && (
        <Card.Actions style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: '#fff' }}>Використати поточне місто</Text>
          <Switch value={!useCustomCity} onValueChange={() => setUseCustomCity(!useCustomCity)} />
        </Card.Actions>
      )}
    </Card>
  )
}

const styles = StyleSheet.create({
  switchContainer: {
    marginRight: 8,
  },
  toggleIcon: {
    opacity: 0.5,
  },
  switch: {
    marginRight: 8,
  },
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
import { CITIES } from '@/constants';
import { useLocationStore } from '@/stores/locationStore';
import { City } from '@/types';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Linking, ScrollView } from 'react-native';
import { Button, RadioButton, Text, useTheme } from 'react-native-paper';
import CustomModal from '../ui/CustomModal';

const CitySelector = () => {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const { setCustomCity, selectorVisible, setSelectorVisible, setUseCustomCity, locationData } = useLocationStore()
  const theme = useTheme()

  useEffect(() => {
    return () => {
      setSelectedCity(null)
    }
  }, [])

  const handleConfirmCity = () => {
    if (selectedCity) {
      setCustomCity(selectedCity)
      setUseCustomCity(true)
      setSelectorVisible(false);
      router.replace('/(app)/ride' as never)
    }
  }

  return (
    <CustomModal modalVisible={selectorVisible} setModalVisible={setSelectorVisible} testID="city-modal">
      <Text style={{ marginBottom: 16, textAlign: 'center', color: '#000' }}>
        Виберіть місто або скористайтесь поточною локацією:
      </Text>

      <RadioButton.Group
        onValueChange={(newValue) => setSelectedCity(CITIES.find(city => city.name === newValue) || null)}
        value={selectedCity?.name || ''}
      >
        <ScrollView style={{ maxHeight: 150 }}>
          {CITIES.map((city) => (
            <RadioButton.Item key={city.name} label={city.name} value={city.name} labelStyle={{
              fontSize: 16,
              fontWeight: '500',
              color: selectedCity?.name === city.name ? '#1e88e5' : '#333',
            }} />
          ))}
        </ScrollView>
      </RadioButton.Group>

      <Button
        mode="contained"
        onPress={handleConfirmCity}
        disabled={!selectedCity}
        style={[
          { marginTop: 16 },
          !selectedCity && { backgroundColor: theme.colors.primary, opacity: 0.5 }
        ]}
        labelStyle={!selectedCity && { color: theme.colors.onPrimary, opacity: 0.5 }}
      >
        Підтвердити вибір міста
      </Button>

      {locationData ?
        <Button mode="outlined"
          style={{ marginTop: 8 }}
          onPress={() => {
            setUseCustomCity(false)
            setSelectorVisible(false)
          }}
        >
          Використати поточну локацію
        </Button>
        :
        <Button
          mode="outlined"
          onPress={() => {
            Linking.openSettings()
            setSelectorVisible(false)
          }}
          style={{ marginTop: 8 }}
        >
          Надати доступ до локації
        </Button>}
    </CustomModal>
  );
};

export default CitySelector;

import { CITIES } from '@/constants';
import { useCitySelectorStore } from '@/stores/cityStore';
import { useLocationStore } from '@/stores/locationStore';
import { City } from '@/types';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Linking, ScrollView } from 'react-native';
import { Button, RadioButton, Text, useTheme } from 'react-native-paper';
import CustomModal from '../ui/CustomModal';

const CitySelector = ({ modalVisible, setModalVisible }: { modalVisible: boolean, setModalVisible: (visible: boolean) => void }) => {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const { setLocation } = useLocationStore()
  const { setCustomCity } = useCitySelectorStore()
  const theme = useTheme()

  const handleConfirmCity = () => {
    if (selectedCity) {

      setLocation({
        coords: { ...selectedCity },
        timestamp: Date.now(),
      })
      setCustomCity(selectedCity)
      setModalVisible(false);
      router.replace('/(app)/Ride' as never)
    }
  }

  return (
    <CustomModal modalVisible={modalVisible} setModalVisible={setModalVisible} testID="city-modal">
      <Text style={{ marginBottom: 16, textAlign: 'center', color: '#000' }}>
        Location not granted. Grant permission or select your city:
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
          !selectedCity && { backgroundColor: theme.colors.secondaryContainer, opacity: 1 }
        ]}
        labelStyle={!selectedCity && { color: theme.colors.onSecondaryContainer }}
      >
        Confirm City
      </Button>

      <Button
        mode="outlined"
        onPress={() => {
          Linking.openSettings()
          setModalVisible(false)
        }}
        style={{ marginTop: 8 }}
      >
        Try Granting Location Again
      </Button>
    </CustomModal>
  );
};

export default CitySelector;

import { CustomModal } from '@/components/ui';
import { CITIES } from '@/constants';
import { useLocationStore } from '@/stores/locationStore';
import { City } from '@/types';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, ScrollView } from 'react-native';
import { Button, RadioButton, Text, useTheme } from 'react-native-paper';

const CitySelector = () => {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const { setCustomCity, selectorVisible, setSelectorVisible, setUseCustomCity, locationData } = useLocationStore()
  const theme = useTheme()
  const { t } = useTranslation()

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
    <CustomModal visible={selectorVisible} onClose={() => setSelectorVisible(false)} testID="city-modal">
      <Text style={{ marginBottom: 16, textAlign: 'center', color: '#000' }}>
        {t('city.citySelectorModalTitle')}
      </Text>

      <RadioButton.Group
        onValueChange={(newValue) => setSelectedCity(CITIES.find(city => city.name === newValue) || null)}
        value={selectedCity?.name || ''}
      >
        <ScrollView style={{ maxHeight: 150 }}>
          {CITIES.map((city) => (
            <RadioButton.Item key={city.name} label={t(`city.cities.${city.engName.toLowerCase()}`)} value={city.name} labelStyle={{
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
        {t('city.confirmCity')}
      </Button>

      {locationData ?
        <Button mode="outlined"
          style={{ marginTop: 8 }}
          onPress={() => {
            setUseCustomCity(false)
            setSelectorVisible(false)
          }}
        >
          {t('city.useCurrentLocation')}
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
          {t('city.allowLocationButton')}
        </Button>}
    </CustomModal>
  );
};

export default CitySelector;

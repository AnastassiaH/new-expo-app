import { useLocationStore } from "@/stores/locationStore";
import React, { useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { Button, Card, Switch, Text, useTheme } from "react-native-paper";

export default function CityToggle() {
  const { setSelectorVisible, customCity, setUseCustomCity,
    locationData, useCustomCity
  } = useLocationStore()
  const theme = useTheme()
  const { t } = useTranslation()

  useEffect(() => {
    if (customCity && !locationData?.city) {
      setUseCustomCity(true)
    }
  }, [customCity, locationData?.city])

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.primary }]} >
      <Card.Title
        title={useCustomCity ? t('city.customCity') : t('city.yourCity')}
        subtitle={useCustomCity
          ? customCity?.name || t('city.noCity')
          : locationData?.city || t('city.noCity')}
        titleStyle={styles.title}
        subtitleStyle={styles.subtitle}
        right={() => (
          <>
            <Button
              mode="contained"
              onPress={() => setSelectorVisible(true)}
              compact
              style={styles.editBtn}
            >
              {t('city.editCity')}
            </Button>
          </>
        )}
      />
      {locationData?.city && customCity && customCity.name !== locationData.city && (
        <Card.Actions style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: '#fff' }}>{t('city.useCurrentCity')}</Text>
          <Switch
            value={!useCustomCity}
            onValueChange={() => setUseCustomCity(!useCustomCity)}
            color={theme.colors.primary}
            trackColor={{ true: theme.colors.surface }}
          />
        </Card.Actions>
      )}
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#5C93B7',
    elevation: 2,
  },
  title: { color: '#fff', fontSize: 18, fontWeight: '600' },
  subtitle: { color: '#F0F6FA' },
  editBtn: { marginRight: 8 },
});
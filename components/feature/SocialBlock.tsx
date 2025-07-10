import Ionicons from '@expo/vector-icons/Ionicons'
import React from 'react'
import { Alert, Linking, Text, TouchableOpacity, View } from 'react-native'
import { useTheme } from 'react-native-paper'
import TelegramIcon from '../icons/TelegramIcon'
import ViberIcon from '../icons/ViberIcon'

const iconSize = 24;

export const handlePressApp = async (url: string, appName?: string) => {
  if (__DEV__) {
    await Linking.openURL(url);
  } else {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(
        `${appName || 'Цей застосунок'} не встановлений`,
        `Будь ласка, встановіть ${appName || 'його'}, щоб продовжити.`
      );
    }
  }
};

export default function SocialBlock({ phone }: { phone: string }) {
  const theme = useTheme()

  const handlePressPhone = () => {
    Linking.openURL(`tel:${phone}`)
      .catch(err => {
        console.error(err);
        Alert.alert('Не вдалось відкрити номер.');
      });
  };

  if (!phone) return null;

  return (
    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
      <TouchableOpacity onPress={handlePressPhone}><Text style={{ color: theme.colors.onSurface }}>{phone}</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => handlePressApp(`whatsapp://send?phone=${phone}`)}><Ionicons name="logo-whatsapp" size={iconSize} color={theme.colors.onSurface} /></TouchableOpacity>
      <TouchableOpacity onPress={() => handlePressApp(`tg://resolve?phone=${phone}`)}><TelegramIcon color={theme.colors.onSurface} size={iconSize} /></TouchableOpacity>
      <TouchableOpacity onPress={() => handlePressApp(`viber://contact?number=%2B${phone}`)}><ViberIcon color={theme.colors.onSurface} size={iconSize} /></TouchableOpacity>
    </View>
  )
}
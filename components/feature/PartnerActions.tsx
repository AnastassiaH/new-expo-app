import { PartnerData } from '@/types'
import Ionicons from '@expo/vector-icons/Ionicons'
import React from 'react'
import { Alert, Linking, Text, TouchableOpacity, View } from 'react-native'
import TelegramIcon from '../icons/TelegramIcon'
import ViberIcon from '../icons/ViberIcon'

const iconSize = 24;

export const handlePressApp = async (url: string, appName?: string) => {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(
        `${appName || 'Цей застосунок'} не встановлений`,
        `Будь ласка, встановіть ${appName || 'його'}, щоб продовжити.`
      );
    }
  } catch (error) {
    console.error('Помилка відкриття URL:', error);
    Alert.alert('Помилка', 'Не вдалося відкрити застосунок.');
  }
};

export default function PartnerActions({ item }: { item: PartnerData }) {

  const handlePressPhone = () => {
    Linking.openURL(`tel:${item?.user?.phoneNumber}`)
      .catch(err => {
        console.error(err);
        Alert.alert('Не вдалося відкрити номер.');
      });
  };

  return (
    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
      <TouchableOpacity onPress={handlePressPhone}><Text>{item?.user?.phoneNumber}</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => handlePressApp(`whatsapp://send?phone=${item?.user?.phoneNumber}`)}><Ionicons name="logo-whatsapp" size={iconSize} color="black" /></TouchableOpacity>
      <TouchableOpacity onPress={() => handlePressApp(`tg://resolve?phone=${item?.user?.phoneNumber}`)}><TelegramIcon color="black" size={iconSize} /></TouchableOpacity>
      <TouchableOpacity onPress={() => handlePressApp(`viber://contact?number=%2B${item?.user?.phoneNumber}`)}><ViberIcon color="black" size={iconSize} /></TouchableOpacity>
    </View>
  )
}
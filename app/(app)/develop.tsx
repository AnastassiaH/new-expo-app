import PlacesAutocomplete from '@/components/feature/PlacesAutocomplete'
import React from 'react'
import { SafeAreaView, Text } from 'react-native'

export default function Page() {
  return (
    <SafeAreaView>
      <Text style={{ marginBottom: 20 }}>Test Page</Text>
      <PlacesAutocomplete onPlaceSelect={(place) => console.log('place', place)} />
    </SafeAreaView>
  )
}
import { Loader } from '@/components/ui'
import { cancelRide } from '@/services/api.service'
import useRideStore from '@/stores/rideStore'
import shared from '@/styles/shared'
import { PartnerData } from '@/types'
import { router } from 'expo-router'
import React from 'react'
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  Text,
  View,
} from 'react-native'
import { Button } from 'react-native-paper'
import PartnerItem from '../../components/PartnerItem'
import { usePartners } from '../../hooks/usePartners'

const mockPartners: PartnerData[] = [
  {
    id: '1',
    date: '2024-02-12T13:46:03.952Z',
    placeFrom: {
      point: { x: 0, y: 0 },
      name: 'Random Address 1, Lviv, Ukraine',
      distance: 125
    },
    placeTo: {
      point: { x: 0, y: 0 },
      name: 'Random Address 2, Lviv, Ukraine',
      distance: 450
    },
    isActive: true,
    user: {
      id: 'user2',
      phoneNumber: '123456789',
      email: 'user2@example.com',
      firstName: 'John',
      lastName: 'Doe',
    }
  },
  {
    id: '2',
    date: '2024-02-12T13:46:03.952Z',
    placeFrom: {
      point: { x: 0, y: 0 },
      name: 'Random Address 1, Lviv, Ukraine',
      distance: 125
    },
    placeTo: {
      point: { x: 0, y: 0 },
      name: 'Random Address 2, Lviv, Ukraine',
      distance: 500
    },
    isActive: true,
    user: {
      id: 'user1',
      phoneNumber: '123456789',
      email: 'user1@example.com',
      firstName: 'John',
      lastName: 'Doe',
    }
  }
]

const PartnersScreen: React.FC = () => {
  const { isLoading, error, refreshing, partners, handleRefresh } = usePartners()
  const { activeRide, setActiveRide } = useRideStore()
  const [expandedItem, setExpandedItem] = React.useState<string | null>(null)
  const [cancelRideError, setCancelRideError] = React.useState<string | null>(null)

  // to do notification service

  const handlePress = (itemId: string) => {
    setExpandedItem(itemId === expandedItem ? null : itemId)
  }

  const cancel = async () => {
    if (!activeRide?.id) return

    try {
      const response = await cancelRide(activeRide.id)
      if (response) {
        console.log('canceled', response.data)
      }
    } catch (e: any) {
      console.error('Error canceling ride:', e)
      setCancelRideError(e?.message)
    } finally {
      setActiveRide(null)
      router.replace('/(app)/Ride')
    }
  }

  if (isLoading) {
    return <Loader />
  }

  if (error) {
    return (
      <View style={shared.container}>
        <Text>Error loading partners: {error.message}</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={[shared.container, { width: '100%', paddingTop: 40 }]}>
        {partners?.length > 0 || mockPartners?.length > 0 && (
          <FlatList
            style={{ width: '100%' }}
            contentContainerStyle={{ flexGrow: 1 }}
            refreshing={refreshing}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
            data={partners.length > 0 ? partners : mockPartners}
            renderItem={({ item }) => (
              <PartnerItem
                item={item}
                isExpanded={expandedItem === item.id}
                onPress={() => handlePress(item.id!)}
              />
            )}
            keyExtractor={(item) => item.id!}
            showsVerticalScrollIndicator={false}
          // ListEmptyComponent={<SearchingLoader />}
          />
        )}
      </View>
      {activeRide?.isActive && (
        <View
          style={{
            alignSelf: 'flex-end',
            marginRight: 20,
            width: '100%',
            alignItems: 'flex-end',
            marginBottom: 20,
          }}
        >
          <Button style={{ width: '50%' }} mode="contained" onPress={cancel}>
            Cancel the ride
          </Button>
        </View>
      )}
    </SafeAreaView>
  )
}

export default PartnersScreen

import PartnerItem from '@/components/PartnerItem'
import { ErrorModal, Loader } from '@/components/ui'
import ScreenWrapper from '@/components/ui/ScreenWrapper'
import { useAutoRefreshPartners } from '@/hooks/useAutoRefreshPartners'
import { cancelRide } from '@/services/api.service'
import { usePartnersStore } from '@/stores/partnersStore'
import { PartnerData } from '@/types'
import { router } from 'expo-router'
import React from 'react'
import {
  View
} from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { Button } from 'react-native-paper'
import { useActiveRideStore } from '../../stores/activeRideStore'

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
  const { activeRide, setActiveRide } = useActiveRideStore()
  const [expandedItem, setExpandedItem] = React.useState<string | null>(null)
  const [cancelRideError, setCancelRideError] = React.useState<string | null>(null)
  const { partners, loading, error: partnersError, fetchPartners } = usePartnersStore()

  useAutoRefreshPartners(activeRide?.id)

  const handlePress = (itemId: string) => {
    setExpandedItem(itemId === expandedItem ? null : itemId)
  }

  const cancelActiveRide = async () => {
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
      router.replace('/(app)/Ride' as never)
    }
  }

  if (loading) {
    return <Loader />
  }

  if (cancelRideError) {
    return <ErrorModal
      visible={!!cancelRideError}
      message={cancelRideError}
      onDismiss={() => setCancelRideError(null)} />
  }

  if (partnersError) {
    return <ErrorModal
      visible={!!partnersError}
      message={partnersError}
      onDismiss={() => usePartnersStore.setState({ error: null })}
      tryAgain={() => fetchPartners(activeRide?.id!)} />
  }

  return (
    <ScreenWrapper>
      <View>
        {partners && partners?.length > 0 || mockPartners?.length > 0 && (
          <FlatList
            style={{ width: '100%' }}
            contentContainerStyle={{ flexGrow: 1 }}
            data={partners && partners?.length > 0 ? partners : mockPartners}
            renderItem={({ item }) => (
              <PartnerItem
                item={item}
                isExpanded={expandedItem === item.id}
                onPress={() => handlePress(item.id!)}
              />
            )}
            keyExtractor={(item) => item.id!}
            showsVerticalScrollIndicator={false}
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
          <Button style={{ width: '50%' }} mode="contained" onPress={cancelActiveRide}>
            Cancel the ride
          </Button>
        </View>
      )}
    </ScreenWrapper>
  )
}

export default PartnersScreen

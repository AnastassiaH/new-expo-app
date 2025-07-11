import { ErrorModal } from '@/components/ui'
import ConfirmationModal from '@/components/ui/ConfirmationModal'
import PartnerItem from '@/components/ui/PartnerItem'
import PartnerSearchLoading from '@/components/ui/PartnerSearchLoading'
import ScreenWrapper from '@/components/ui/ScreenWrapper'
import { REFRESH_PARTNERS_INTERVAL } from '@/constants'
import { cancelRide, getPartners } from '@/services/api.service'
import { useActiveRideStore } from '@/stores/activeRideStore'
import { usePartnersStore } from '@/stores/partnersStore'
import useRideFormStore from '@/stores/rideFormStore'
import { PartnerData } from '@/types'
import { router } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import {
  RefreshControl,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { Button, useTheme } from 'react-native-paper'

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
      phoneNumber: '+380956789',
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
      phoneNumber: '+123456789',
      email: 'user1@example.com',
      firstName: 'John',
      lastName: 'Doe',
    }
  }
]

function PartnersScreen() {
  const { partners, setPartners } = usePartnersStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const { activeRide, setActiveRide } = useActiveRideStore()
  const { clearForm } = useRideFormStore()
  const theme = useTheme()

  const fetchPartners = useCallback(async () => {
    if (!activeRide?.id) {
      setPartners(null)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const partnersData = await getPartners(activeRide.id)
      setPartners(partnersData)
    } catch (error: any) {
      setError(error?.message || 'Failed to fetch partners')
      setPartners(null)
    } finally {
      setLoading(false)
    }
  }, [activeRide, setPartners, setLoading, setError])

  useEffect(() => {
    // if (!activeRide) {
    //   router.replace('/(app)/ride' as never)
    //   return
    // }

    const interval = setInterval(fetchPartners, REFRESH_PARTNERS_INTERVAL)
    fetchPartners()

    return () => clearInterval(interval)
  }, [activeRide, fetchPartners])

  const handleCancelRide = async () => {
    setShowCancelModal(true)
  }

  const handleConfirmCancel = async () => {
    setLoading(true)
    setError(null)
    try {
      if (!activeRide?.id) return
      await cancelRide(activeRide.id)
      setActiveRide(null)
      clearForm()
      router.replace('/(app)/ride' as never)
    } catch (error: any) {
      setError(error?.message || 'Failed to cancel ride')
    } finally {
      setLoading(false)
      setShowCancelModal(false)
    }
  }

  if (error) return <ErrorModal visible={!!error} message={error} onClose={() => setError(null)} />

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {partners?.length ? (
          <FlatList
            data={partners}
            renderItem={({ item }) => <PartnerItem item={item} />}
            keyExtractor={(item) => item.id ?? ''}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={fetchPartners}
                tintColor={theme.colors.primary}
              />
            }
          />
        ) : activeRide?.isActive ? (
          <PartnerSearchLoading />
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyTitle}>Пошук ще не розпочато</Text>
            <Text style={styles.emptyDescription}>
              Створіть поїздку, щоб знайти попутника
            </Text>
            <Button
              mode="contained"
              onPress={() => router.replace('/(app)/ride')}
              style={styles.goToRideButton}
            >
              Створити поїздку
            </Button>
          </View>
        )}
        {activeRide?.isActive && !showCancelModal &&
          <Button
            mode="contained"
            onPress={handleCancelRide}
            style={styles.cancelButton}
          >
            Відмінити поїздку та пошук партнерів
          </Button>}
        <ConfirmationModal
          visible={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleConfirmCancel}
          title="Відмінити поїздку"
          message="Ви впевнені, що хочете відмінити поїздку?"
        />
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cancelButton: {
    marginVertical: 16,
  },
  emptyStateContainer: {
    flex: 1,
    paddingTop: '65%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  goToRideButton: {
    maxWidth: 200,
    alignSelf: 'center',
  },
})

export default PartnersScreen

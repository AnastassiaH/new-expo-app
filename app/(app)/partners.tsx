import { ErrorModal } from '@/components/ui'
import ConfirmationModal from '@/components/ui/ConfirmationModal'
import { NoActiveRideBlock } from '@/components/ui/NoActiveRideBlock'
import PartnerItem from '@/components/ui/PartnerItem'
import PartnerSearchLoading from '@/components/ui/PartnerSearchLoading'
import ScreenWrapper from '@/components/ui/ScreenWrapper'
import { REFRESH_PARTNERS_INTERVAL } from '@/constants'
import { useRideCancellation } from '@/hooks/useRideCancellation'
import { getPartners } from '@/services/api.service'
import { useActiveRideStore } from '@/stores/activeRideStore'
import { usePartnersStore } from '@/stores/partnersStore'
import { PartnerData } from '@/types'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View
} from 'react-native'
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
  },
  {
    id: '3',
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
  },
  {
    id: '4',
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
  const { handleConfirmCancel, loading: cancelRideLoading } = useRideCancellation()
  const activeRide = useActiveRideStore(s => s.activeRide)
  const theme = useTheme()
  const [availableHeight, setAvailableHeight] = useState(0)
  const [listHeight, setListHeight] = useState(0)
  const { t } = useTranslation()

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
      setError(error?.message || t("common.error.fetchingError"))
      setPartners(null)
    } finally {
      setLoading(false)
    }
  }, [activeRide, setPartners, setLoading, setError])

  useEffect(() => {
    const interval = setInterval(fetchPartners, REFRESH_PARTNERS_INTERVAL)
    fetchPartners()

    return () => clearInterval(interval)
  }, [activeRide, fetchPartners])

  const handleCancelRide = () => {
    setShowCancelModal(true)
  }

  const handleConfirmCancelRide = async () => {
    await handleConfirmCancel()
    setShowCancelModal(false)
  }

  if (error) return <ErrorModal visible={!!error} message={error} onClose={() => setError(null)} />

  return (
    <ScreenWrapper>
      <View style={styles.container} onLayout={(e) => {
        setAvailableHeight(e.nativeEvent.layout.height)
      }}>
        {activeRide?.isActive ? (
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={fetchPartners}
                tintColor={theme.colors.primary}
              />
            }
          >
            <View
              onLayout={(e) => {
                setListHeight(e.nativeEvent.layout.height)
              }}
            >
              {partners?.map((item) => (
                <PartnerItem key={item.id} item={item} />
              ))}
            </View>

            {!loading && <PartnerSearchLoading iconOnly={availableHeight - listHeight < 250} />}
          </ScrollView>
        ) : (
          <NoActiveRideBlock />
        )}
        {activeRide?.isActive && !showCancelModal &&
          <Button
            mode={partners?.length ? 'outlined' : 'contained'}
            onPress={handleCancelRide}
            style={styles.cancelButton}
          >
            {t("partners.cancelRideButton")}
          </Button>}
        <ConfirmationModal
          visible={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleConfirmCancelRide}
          title={t("partners.confirmCancelRideModalTitle")}
          message={t("partners.confirmCancelRideModalMessage")}
          loading={cancelRideLoading}
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

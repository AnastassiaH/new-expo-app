import SignOutButton from '@/components/SignOutButton'
import { Button, Loader } from '@/components/ui'
import SearchingLoader from '@/components/ui/SearchingLoader'
import { cancelRide, getPartners } from '@/services/api.service'
import usePartnersStore from '@/stores/partnersStore'
import useRideStore from '@/stores/rideStore'
import shared from '@/styles/shared'
import { PartnerData } from '@/types'
import { router } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View
} from 'react-native'

const testArray = [
  {
    id: '1',
    date: '2024-02-12T13:46:03.952Z',
    placeFrom: {
      point: {
        x: 0,
        y: 0
      },
      name: 'Random Address 1, Lviv, Ukraine',
      distance: 125
    },
    placeTo: {
      point: {
        x: 0,
        y: 0
      },
      name: 'Random Address 2, Lviv, Ukraine',
      distance: 450
    },
    isActive: true,
    userId: 'user1'
  },
  {
    id: '2',
    date: '2024-02-12T14:30:15.123Z',
    placeFrom: {
      point: {
        x: 0,
        y: 0
      },
      name: 'Random Address 3, Lviv, Ukraine',
      distance: 80
    },
    placeTo: {
      point: {
        x: 0,
        y: 0
      },
      name: 'Random Address 4, Lviv, Ukraine',
      distance: 235
    },
    isActive: true,
    userId: 'user2'
  },
  {
    id: '3',
    date: '2024-02-12T14:30:15.123Z',
    placeFrom: {
      point: {
        x: 0,
        y: 0
      },
      name: 'Random Address 3, Lviv, Ukraine',
      distance: 80
    },
    placeTo: {
      point: {
        x: 0,
        y: 0
      },
      name: 'Random Address 4, Lviv, Ukraine',
      distance: 235
    },
    isActive: true,
    userId: 'user2'
  },
  {
    id: '4',
    date: '2024-02-12T14:30:15.123Z',
    placeFrom: {
      point: {
        x: 0,
        y: 0
      },
      name: 'Random Address 3, Lviv, Ukraine',
      distance: 80
    },
    placeTo: {
      point: {
        x: 0,
        y: 0
      },
      name: 'Random Address 4, Lviv, Ukraine',
      distance: 235
    },
    isActive: true,
    userId: 'user2'
  },
  {
    id: '5',
    date: '2024-02-12T14:30:15.123Z',
    placeFrom: {
      point: {
        x: 0,
        y: 0
      },
      name: 'Random Address 3, Lviv, Ukraine',
      distance: 80
    },
    placeTo: {
      point: {
        x: 0,
        y: 0
      },
      name: 'Random Address 4, Lviv, Ukraine',
      distance: 235
    },
    isActive: true,
    userId: 'user2'
  },
  {
    id: '6',
    date: '2024-02-12T14:30:15.123Z',
    placeFrom: {
      point: {
        x: 0,
        y: 0
      },
      name: 'Random Address 3, Lviv, Ukraine',
      distance: 80
    },
    placeTo: {
      point: {
        x: 0,
        y: 0
      },
      name: 'Random Address 4, Lviv, Ukraine',
      distance: 235
    },
    isActive: true,
    userId: 'user2'
  },
  {
    id: '7',
    date: '2024-02-12T14:30:15.123Z',
    placeFrom: {
      point: {
        x: 0,
        y: 0
      },
      name: 'Random Address 3, Lviv, Ukraine',
      distance: 80
    },
    placeTo: {
      point: {
        x: 0,
        y: 0
      },
      name: 'Random Address 4, Lviv, Ukraine',
      distance: 235
    },
    isActive: true,
    userId: 'user2'
  }
]

const PartnersScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [expandedItem, setExpandedItem] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const { activeRide } = useRideStore()

  const { partners, setPartners } = usePartnersStore()

  const partnersTest = partners ? partners : testArray

  const cancel = async () => {
    if (!activeRide?.id) {
      return
    }
    setIsLoading(true)
    try {
      const response = await cancelRide(activeRide?.id)
      if (response) {
        console.log('canceled', response.data)
      }
    } catch (e: any) {
      setError(e as Error)
    } finally {
      setIsLoading(false)
    }
    router.replace('/(app)/ride')
  }

  useEffect(() => {
    ; (async () => {
      if (activeRide?.id) {
        const response = await getPartners(activeRide.id)
        setPartners(response as PartnerData[])
      }
    })()

    // const intervalId = setInterval(() => {
    //   // activeRide && getPartners(activeRide?.id)
    // }, 5000)
    // return () => clearInterval(intervalId)
  }, [activeRide])

  const handlePress = useCallback(
    (itemId: string | undefined) => {
      if (!itemId) {
        return
      }
      // setExpandedItem((prevItem) => (prevItem === itemId ? null : itemId))
    },
    [expandedItem]
  )

  // manual refreshing
  const fetchData = () => {
    setTimeout(() => {
      setRefreshing(false)
      // activeRide && getPartners(activeRide?.id)
    }, 1000)
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchData()
  }

  if (isLoading) {
    return <Loader />
  }

  const PartnerItem = ({ item }: { item: PartnerData }) => {
    const isExpanded = expandedItem === item.id

    return (
      <TouchableOpacity onPress={() => handlePress(item.id)}>
        <View
          style={{
            marginVertical: 10,
            width: '100%',
            borderWidth: 2,
            borderRadius: 5,
            borderColor: '#000',
            flex: 1,
            padding: 15
          }}
        >
          <Text>{item.placeFrom.name}</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 10
            }}
          >
            <Text>{item.placeFrom.distance}</Text>
            <Text>{item.placeTo.distance}</Text>
          </View>
          <View>
            {isExpanded && <Text style={{ marginTop: 10 }}>{item?.user?.phoneNumber}</Text>}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          marginBottom: 10
        }}
      >
        <SignOutButton />
      </View>
      <View style={[shared.container, { width: '100%' }]}>
        <FlatList
          style={{ width: '100%' }}
          contentContainerStyle={{ flexGrow: 1 }}
          refreshing={true}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          //data={partnersTest}
          //data={testArray}
          data={partners}
          //data={partners?.length ? partners : testArray}
          renderItem={({ item }) => <PartnerItem item={item} />}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<SearchingLoader />}
        />
      </View>
      <View
        style={{
          alignSelf: 'flex-end',
          marginRight: 20,
          width: '100%',
          alignItems: 'flex-end'
        }}
      >
        <Button style={{ width: '50%' }} mode="contained" onPress={cancel}>
          Cancel the ride
        </Button>
      </View>
    </SafeAreaView>
  )
}

export default PartnersScreen

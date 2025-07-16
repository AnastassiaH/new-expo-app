import { ErrorModal, Loader } from '@/components/ui';
import RideItem from '@/components/ui/RideItem';
import ScreenWrapper from '@/components/ui/ScreenWrapper';
import { getRide } from '@/services/api.service';
import { useActiveRideStore } from '@/stores/activeRideStore';
import { useUserStore } from '@/stores/userStore';
import { RideData } from '@/types';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

const HistoryScreen = () => {
  const user = useUserStore((state) => state.user);
  const [rides, setRides] = useState<RideData[]>([])
  const [loading, setLoading] = useState(false)
  const [getRidesError, setGetRidesError] = useState<string | null>(null)
  const activeRide = useActiveRideStore((state) => state.activeRide)
  const theme = useTheme();

  const fetchRides = async () => {
    setLoading(true);
    try {
      const response = await getRide(user?.id!);
      if (response) {
        setRides(response.filter((ride) => ride.placeFrom?.name));
      }
      setGetRidesError(null);
    } catch (error: any) {
      setGetRidesError(error?.message || 'Упс, щось пішло не так');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  const isInitialLoading = loading && rides.length === 0;
  if (isInitialLoading) {
    return <Loader />
  }

  if (getRidesError) {
    return <ErrorModal
      visible={!!getRidesError}
      message={getRidesError}
      onClose={() => setGetRidesError(null)}
      tryAgain={() => fetchRides()}
    />
  }

  const fullRides = activeRide ? [activeRide, ...rides] : rides

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {fullRides.length > 0 ?
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={fetchRides}
                colors={[theme.colors.primary]}
                tintColor={theme.colors.primary}
              />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
          >
            <View style={{ minWidth: '100%' }}>
              {fullRides.map((item) => (
                <RideItem key={item.id} ride={item as RideData} />
              ))}
            </View>
          </ScrollView>
          :
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: theme.colors.primary, fontSize: 16, fontWeight: 'bold', marginBottom: 20 }}>Поїздок ще поки немає</Text>
            <Button
              mode="contained"
              onPress={() => router.push('/(app)/ride' as never)}
              textColor={theme.colors.onPrimary}
              style={{ width: 250 }}
            >
              Створити поїздку
            </Button>
          </View>}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default HistoryScreen
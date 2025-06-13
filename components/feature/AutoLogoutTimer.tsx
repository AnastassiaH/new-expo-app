import { AUTO_SIGN_OUT_TIMEOUT } from '@/constants';
import { useAuthStore } from '@/stores/authStore';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

export const AutoLogoutTimer = () => {
  const lastActivityTime = useAuthStore(state => state.lastActivityTime);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (timeLeft === 0) {
      useAuthStore.getState().signOut();
    }
  }, [timeLeft])

  useEffect(() => {
    if (!lastActivityTime) return;

    const updateTime = () => {
      const now = Date.now();
      const diff = AUTO_SIGN_OUT_TIMEOUT - (now - lastActivityTime);
      setTimeLeft(diff > 0 ? diff : 0);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [lastActivityTime]);

  if (timeLeft === null) return null;

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return (
    <View style={styles.container}>
      <Text>{minutes}:{seconds}</Text>
    </View>
  )

};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 30,
    right: 30,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
});


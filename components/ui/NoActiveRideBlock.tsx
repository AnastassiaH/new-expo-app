import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";

export const NoActiveRideBlock = () => {
  return (
    <View style={styles.emptyStateContainer}>
      <Text style={styles.emptyTitle}>Пошук ще не розпочато</Text>
      <Text style={styles.emptyDescription}>
        Створіть поїздку, щоб знайти попутника
      </Text>
      {/* <Text style={styles.helpText}>
        Ми поєднаємо вас з людьми, які рухаються у тому ж напрямку
      </Text> */}

      <Button
        mode="text"
        icon={({ size, color }) => (
          <Ionicons name="time-outline" size={size} color={color} />
        )}
        onPress={() => router.push('/(app)/history')}
        rippleColor="transparent"
        style={styles.goToHistoryButton}
        labelStyle={{
          fontSize: 14,
        }}
      >
        Переглянути минулі поїздки
      </Button>

      <Button
        mode="contained"
        onPress={() => router.replace('/(app)/ride')}
        style={styles.goToRideButton}
        labelStyle={{ fontWeight: 'bold' }}
      >
        Створити поїздку
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
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
    textAlign: 'center',
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginVertical: 10,
  },
  goToRideButton: {
    width: '100%',
    alignSelf: 'center',
    marginTop: 10,
  },
  goToHistoryButton: {
    width: '100%',
    alignSelf: 'center',
    marginTop: 10,
  },
});

import { router } from "expo-router"
import { StyleSheet, Text, View } from "react-native"
import { Button } from "react-native-paper"

export const NoActiveRideBlock = () => {
  return (
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
      <Button
        mode="outlined"
        onPress={() => router.push('/(app)/history')}
        style={styles.goToHistoryButton}
        labelStyle={{
          fontWeight: 'bold',
          paddingRight: 15,
          fontSize: 14,
        }}
      >
        Переглянути минулі поїздки
      </Button>
    </View>
  )
}

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
    marginBottom: 20,
    textAlign: 'center',
  },
  goToRideButton: {
    width: '100%',
    alignSelf: 'center',
  },
  goToHistoryButton: {
    width: '100%',
    alignSelf: 'center',
    marginTop: 10,
  },
})
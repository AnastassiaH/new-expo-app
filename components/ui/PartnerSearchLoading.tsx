import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useRef, useState } from 'react'
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useTheme } from 'react-native-paper'

const messages = [
  'Шукаємо найкращих партнерів для вас...',
  'Аналізуємо ваші маршрути...',
  'Порівнюємо доступні варіанти...',
  'Знайшли кілька потенційних партнерів!',
  'Перевіряємо їхні маршрути...',
]

interface PartnerSearchLoadingProps {
  iconOnly?: boolean
}

const PartnerSearchLoading: React.FC<PartnerSearchLoadingProps> = ({ iconOnly = false }) => {
  const floatAnim = useRef(new Animated.Value(0)).current
  const progressAnim = useRef(new Animated.Value(0)).current
  const theme = useTheme()

  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -5,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(floatAnim, {
          toValue: 5,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start()

    const animate = () => {
      progressAnim.setValue(0)
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: false,
        easing: Easing.linear,
      }).start(() => {
        setTimeout(() => {
          setMessageIndex((prev) => (prev + 1) % messages.length)
        }, 0)
        animate()
      })
    }
    animate()

    return () => {
      progressAnim.stopAnimation()
      floatAnim.stopAnimation()
    }
  }, [])

  const translateY = floatAnim
  const width = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  })

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.iconWrapper,
          {
            transform: [{ translateY }],
            marginTop: iconOnly ? 20 : 0,
          },
        ]}
      >
        <Ionicons name="search" size={40} color={theme.colors.primary} />
      </Animated.View>

      {!iconOnly && (
        <>
          <Text style={[styles.message, { color: theme.colors.primary }]}>
            {messages[messageIndex]}
          </Text>

          <View style={styles.progressContainer}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width,
                  backgroundColor: theme.colors.primary,
                },
              ]}
            />
          </View>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 24,
    flex: 1,
  },
  iconWrapper: {
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    minHeight: 40,
  },
  progressContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
})

export default PartnerSearchLoading


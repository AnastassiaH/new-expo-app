import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useRef, useState } from 'react'
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native'

interface PartnerSearchLoadingProps {
  visible: boolean
  primaryColor: string
  onSurfaceColor: string
}

const messages = [
  'Шукаємо найкращих партнерів для вас...',
  'Аналізуємо ваші маршрути...',
  'Порівнюємо доступні варіанти...',
  'Знайшли кілька потенційних партнерів!',
  'Перевіряємо їхні маршрути...',
]

const PartnerSearchLoading: React.FC<PartnerSearchLoadingProps> = ({
  visible,
  primaryColor,
  onSurfaceColor,
}) => {
  const floatAnim = useRef(new Animated.Value(0)).current
  const progressAnim = useRef(new Animated.Value(0)).current
  const [currentMessage, setCurrentMessage] = useState(0)

  useEffect(() => {
    if (!visible) return

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

    const loopProgress = () => {
      progressAnim.setValue(0)
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: false,
        easing: Easing.linear,
      }).start(() => {
        setCurrentMessage((prev) => (prev + 1) % messages.length)
        loopProgress()
      })
    }

    loopProgress()

    return () => {
      progressAnim.stopAnimation()
      floatAnim.stopAnimation()
    }
  }, [visible])

  if (!visible) return null

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
          },
        ]}
      >
        <Ionicons name="search" size={40} color={primaryColor} />
      </Animated.View>

      <Text style={[styles.message, { color: primaryColor }]}>
        {messages[currentMessage]}
      </Text>

      <View style={styles.progressContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width,
              backgroundColor: primaryColor,
            },
          ]}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: '50%',
    alignItems: 'center',
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

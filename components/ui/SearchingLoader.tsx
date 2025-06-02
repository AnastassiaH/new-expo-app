import React, { useEffect, useRef } from 'react'
import { Text, View, Animated, Easing } from 'react-native'

const SearchingLoader = () => {
  const dotsOpacity = useRef([0, 0, 0].map(() => new Animated.Value(0))).current

  useEffect(() => {
    const animateDots = () => {
      const animations = dotsOpacity.map((dotOpacity, index) =>
        Animated.timing(dotOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true
        })
      )

      Animated.stagger(300, animations).start(() => {
        dotsOpacity.forEach((dotOpacity) => dotOpacity.setValue(0)) // Reset opacity
        animateDots() // Start the animation again
      })
    }

    animateDots()

    return () => dotsOpacity.forEach((dotOpacity) => dotOpacity.stopAnimation())
  }, [dotsOpacity])

  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignContent: 'flex-end'
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Text>Пошук</Text>
        {dotsOpacity.map((dotOpacity, index) => (
          <Animated.Text
            key={index}
            style={{ marginLeft: 2, opacity: dotOpacity }}
          >
            .
          </Animated.Text>
        ))}
      </View>
    </View>
  )
}

export default SearchingLoader

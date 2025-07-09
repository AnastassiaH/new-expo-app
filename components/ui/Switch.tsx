import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet, TouchableOpacity } from "react-native";

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  style?: any;
}

export default function Switch({ value, onValueChange, style }: SwitchProps) {
  const switchValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(switchValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [value]);

  const handlePress = () => {
    Animated.timing(switchValue, {
      toValue: value ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onValueChange(!value);
    });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.container, style]}
    >
      <Animated.View
        style={[
          styles.thumb,
          {
            transform: [
              {
                translateX: switchValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 24],
                }),
              },
            ],
          },
        ]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 48,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  thumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#5C93B7',
    position: 'absolute',
    left: 4,
    top: 4,
  },
});

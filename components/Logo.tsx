import React from 'react'
import { Text, StyleSheet } from 'react-native'

export default function Logo() {
  return <Text style={{ marginVertical: 10, fontSize: 44 }}>Taxi App</Text>
}

const styles = StyleSheet.create({
  image: {
    width: 110,
    height: 110,
    marginBottom: 8
  }
})

import React from 'react'
import { StyleSheet } from 'react-native'
import { Text, useTheme } from 'react-native-paper'

export default function Header(props) {
  const theme = useTheme()
  return <Text style={[styles.header, { color: theme.colors.primary }]} {...props} />
}

const styles = StyleSheet.create({
  header: {
    fontSize: 21,
    fontWeight: 'bold',
    paddingVertical: 12
  }
})

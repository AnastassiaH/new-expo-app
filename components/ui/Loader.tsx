import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import { useTheme } from 'react-native-paper'

const Loader: React.FC = () => {
  const theme = useTheme()
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
      <ActivityIndicator animating={true} color={theme.colors.primary} />
    </View>
  )
}

export default Loader

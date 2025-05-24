import React from 'react'
import { View, ActivityIndicator } from 'react-native'

const Loader: React.FC = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
      <ActivityIndicator animating={true} />
    </View>
  )
}

export default Loader

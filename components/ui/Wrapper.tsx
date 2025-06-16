import { SafeAreaView, StyleSheet, View } from 'react-native'

interface WrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  fullScreen?: boolean
}

const Wrapper: React.FC<WrapperProps> = ({ children, fullScreen = true }) => {
  return (
    <SafeAreaView style={{ flex: 1, marginTop: fullScreen ? 80 : -80 }}>
      <View style={[styles.wrapper, { justifyContent: fullScreen ? 'flex-start' : 'center' }]}>{children}</View>
    </SafeAreaView>
  )
}

export default Wrapper

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingInline: 24,
    alignItems: 'center'
  }
})

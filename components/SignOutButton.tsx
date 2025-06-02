import { AntDesign } from '@expo/vector-icons'
import React, { memo } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { useAuthStore } from '../stores/authStore'

const SignOutButton: React.FC = memo(() => {
  const { signOut } = useAuthStore()

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={signOut}
    >
      <AntDesign name="logout" size={24} color="white" />
    </TouchableOpacity>
  )
})

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#666666',
    padding: 15,
    borderRadius: 8,
    width: 'auto',
    alignSelf: 'flex-end',
    marginRight: 10,
    marginTop: 10
  }
})

SignOutButton.displayName = 'SignOutButton'

export default SignOutButton

import SignUpForm from '@/components/SignUpForm'
import { Header, Loader, Logo, Wrapper } from '@/components/ui'
import { registerUser } from '@/services/api.service'
import usePhoneStore from '@/stores/phoneStore'
import { UserData } from '@/types'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Text, useTheme } from 'react-native-paper'

export default function RegisterScreen() {
  const theme = useTheme()
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { setPhone } = usePhoneStore()

  async function signUpUser(data: UserData) {
    setError(null)
    setPhone(data.phoneNumber)
    console.log(data)

    try {
      const response = await registerUser(data)
      if (response) {
        router.replace('/(auth)/verification')
      }
    } catch (error) {
      setError(error as Error)
      router.replace('/(auth)')
    }
  }

  if (isLoading) return <Loader />

  return (
    <Wrapper fullScreen>
      <Logo />
      <Header>Create Account</Header>
      <SignUpForm onSubmit={signUpUser} />
      <View style={styles.row}>
        <Text style={{ color: theme.colors.primary }}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
          <Text style={[styles.link, { color: theme.colors.primary }]}>Login</Text>
        </TouchableOpacity>
      </View>
    </Wrapper>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 4,
    justifyContent: 'center'
  },
  link: {
    fontWeight: 'bold'
  }
})

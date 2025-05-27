import { forgotPassword } from '@/services/api.service'
import usePhoneStore from '@/stores/phoneStore'
import { router } from 'expo-router'
import React, { useState } from 'react'

import { StyleSheet, View } from 'react-native'
import { TextInput, useTheme } from 'react-native-paper'

import { Button } from '@/components/atoms'
import { Header, Loader, Logo, Wrapper } from '@/components/ui'


export default function ForgotPasswordScreen() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const theme = useTheme()
  const [phoneNumber, setPhoneNumber] = useState('')
  const { setPhone } = usePhoneStore()


  const onPhoneNumberFocus = () => {
    !phoneNumber && setPhoneNumber('+380')
  }

  const sendResetPasswordPhone = async (phoneNumber: string) => {
    setPhone(phoneNumber)

    try {
      const response = await forgotPassword(phoneNumber)
      if (response) {
        router.push('/(auth)/reset-password')
      }
    } catch (error) {
      setError(error as Error)
      router.push('/(auth)/login')
    }
  }

  if (isLoading) return <Loader />

  return (
    <Wrapper fullScreen>
      <Logo />
      <Header>Forgot Password</Header>
      <View style={styles.form}>
        <TextInput
          mode="outlined"
          label="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          onFocus={onPhoneNumberFocus}
          keyboardType="phone-pad"
          style={[styles.input, { backgroundColor: theme.colors.surface }]}
          selectionColor={theme.colors.primary}
        />
        <Button
          mode="contained"
          onPress={() => sendResetPasswordPhone(phoneNumber)}
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
        >
          Reset Password
        </Button>
      </View>
    </Wrapper>
  )
}

const styles = StyleSheet.create({
  form: {
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
    padding: 20,
    borderRadius: 10,
    marginTop: 20
  },
  input: {
    marginBottom: 12
  },
  button: {
    marginTop: 12
  }
})

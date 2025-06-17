import { forgotPassword } from '@/services/api.service'
import usePhoneStore from '@/stores/phoneStore'
import { router } from 'expo-router'
import React, { useState } from 'react'

import { Header, Loader, Logo, Wrapper } from '@/components/ui'
import { DEFAULT_ERROR_MESSAGE } from '@/constants'
import { useAuthError } from '@/stores/errorStore'
import { StyleSheet, View } from 'react-native'
import { Button, TextInput, useTheme } from 'react-native-paper'

export default function ForgotPasswordScreen() {
  const [isLoading, setIsLoading] = useState(false)
  const setError = useAuthError(s => s.setError)
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
    } catch (error: any) {
      setError(error?.message || DEFAULT_ERROR_MESSAGE)
      router.push('/(auth)/login')
      throw error
    }
  }

  if (isLoading) return <Loader />

  return (
    <Wrapper fullScreen={false}>
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
  },
  input: {
    marginBottom: 12
  },
  button: {
    marginTop: 12
  }
})

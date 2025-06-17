import { Header, Loader, Logo, Wrapper } from '@/components/ui'
import { DEFAULT_ERROR_MESSAGE } from '@/constants'
import { resetPassword } from '@/services/api.service'
import { useAuthError } from '@/stores/errorStore'
import usePhoneStore from '@/stores/phoneStore'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { StyleSheet, View } from 'react-native'
import { Button, TextInput, useTheme } from 'react-native-paper'


type FormData = {
  verificationCode: string
  password: string
  passwordRetry: string
}

const ResetPasswordScreen: React.FC = () => {
  const theme = useTheme()
  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    watch
  } = useForm<FormData>()
  const [isLoading, setIsLoading] = useState(false)
  const { phone } = usePhoneStore()
  const setError = useAuthError(s => s.setError)

  const sendResetPassword = async (data: FormData) => {
    try {
      setIsLoading(true)
      const response = await resetPassword({
        phoneNumber: phone,
        code: data.verificationCode,
        password: data.password,
        passwordRetry: data.passwordRetry
      })

      if (response) {
        router.replace('/(auth)/login')
      }
    } catch (error: any) {
      setError(error?.message || DEFAULT_ERROR_MESSAGE)
      router.replace('/(auth)')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <Loader />

  return (
    <Wrapper fullScreen>
      <Logo />
      <Header>Reset Password</Header>
      <View style={styles.form}>
        <Controller
          control={control}
          name="verificationCode"
          rules={{
            required: 'Verification code is required',
            pattern: {
              value: /^\d{4}$/,
              message: 'Please enter a valid 4-digit code'
            }
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextInput
              mode="outlined"
              label="Verification Code"
              value={value}
              onChangeText={onChange}
              keyboardType="number-pad"
              style={[styles.input, { backgroundColor: theme.colors.surface }]}
              selectionColor={theme.colors.primary}
              error={!!error}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          rules={{
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters'
            }
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextInput
              mode="outlined"
              label="New Password"
              value={value}
              onChangeText={onChange}
              secureTextEntry
              style={[styles.input, { backgroundColor: theme.colors.surface }]}
              selectionColor={theme.colors.primary}
              error={!!error}
            />
          )}
        />

        <Controller
          control={control}
          name="passwordRetry"
          rules={{
            required: 'Please confirm your password',
            validate: value => value === watch('password') || 'Passwords do not match'
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextInput
              mode="outlined"
              label="Confirm Password"
              value={value}
              onChangeText={onChange}
              secureTextEntry
              style={[styles.input, { backgroundColor: theme.colors.surface }]}
              selectionColor={theme.colors.primary}
              error={!!error}
            />
          )}
        />

        <Button
          mode="contained"
          onPress={handleSubmit(sendResetPassword)}
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

export default ResetPasswordScreen

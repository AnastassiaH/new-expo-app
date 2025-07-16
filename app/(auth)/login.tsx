import { AppTextInput } from '@/components/atoms'
import { Header, Loader, Logo, Wrapper } from '@/components/ui'
import { DEFAULT_ERROR_MESSAGE } from '@/constants'
import { logInUser } from '@/services/api.service'
import { useAuthStore } from '@/stores/authStore'
import { useAuthError } from '@/stores/errorStore'
import usePhoneStore from '@/stores/phoneStore'
import { useUserStore } from '@/stores/userStore'
import { LoginData } from '@/types'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Button, Text, useTheme } from 'react-native-paper'


export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false)
  const setError = useAuthError(s => s.setError)
  const theme = useTheme()
  const { control, handleSubmit, setValue, clearErrors, getValues } = useForm<LoginData>()
  const { signIn } = useAuthStore()
  const { setPhone } = usePhoneStore()
  const { setUser } = useUserStore()

  const onPhoneNumberFocus = () => {
    if (!getValues('phoneNumber')) {
      setValue('phoneNumber', '+380')
    }
  }

  const logInAppUser = async (data: LoginData) => {
    setPhone(data.phoneNumber)

    try {
      setIsLoading(true)
      const response = await logInUser(data)
      if (response) {
        setUser(response.user)
        signIn(response.token)
      }
    } catch (error: any) {
      setError(error?.message || DEFAULT_ERROR_MESSAGE)
      router.replace('/(auth)')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <Wrapper fullScreen={false}>
      <Logo />
      <Header>Login</Header>
      <View style={styles.form}>
        <Controller
          control={control}
          name="phoneNumber"
          rules={{
            required: 'Phone number is required',
            pattern: {
              value: /^\+380\d{9}$/,
              message: 'Please enter a valid Ukrainian phone number'
            }
          }}
          render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
            <AppTextInput
              mode="outlined"
              placeholder="Phone Number"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              onFocus={() => {
                onPhoneNumberFocus()
                clearErrors('phoneNumber')
              }}
              keyboardType="phone-pad"
              returnKeyType="done"
              error={!!error}
              outlineStyle={{ borderWidth: 1 }}
              style={{ marginBottom: 12 }}
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
          render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
            <AppTextInput
              mode="outlined"
              placeholder="Password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              onFocus={() => clearErrors('password')}
              secureTextEntry
              error={!!error}
              outlineStyle={{ borderWidth: 1 }}
            />
          )}
        />
        <Button
          mode="contained"
          onPress={handleSubmit(logInAppUser)}
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
        >
          Login
        </Button>
        <View style={styles.row}>
          <Text style={{ color: theme.colors.primary }}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text style={[styles.link, { color: theme.colors.primary }]}>Sign up</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
            <Text style={[styles.link, { color: theme.colors.primary }]}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
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
  button: {
    marginTop: 12
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
    justifyContent: 'center'
  },
  link: {
    fontWeight: 'bold'
  }
})
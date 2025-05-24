import GoBackButton from '@/components/GoBackButton'
import Logo from '@/components/Logo'
import Button from '@/components/ui/Button'
import Header from '@/components/ui/Header'
import Loader from '@/components/ui/Loader'
import Wrapper from '@/components/ui/Wrapper'
import { useAuthStore } from '@/stores/authStore'
import { useUserStore } from '@/stores/userStore'
import { LoginData } from '@/types'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Text, TextInput, useTheme } from 'react-native-paper'

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const theme = useTheme()
  const { control, handleSubmit, setValue, clearErrors, getValues } = useForm<LoginData>()
  const { setUser } = useUserStore()
  const { signIn } = useAuthStore()


  const onPhoneNumberFocus = () => {
    if (!getValues('phoneNumber')) {
      setValue('phoneNumber', '+380')
    }
  }

  // const sendLoginPhone = async (data: LoginData) => {
  //   //setPhone(data.phoneNumber)

  //   try {
  //     setIsLoading(true)
  //     const response = await logInUser(data)
  //     if (response) {
  //       setUser(response.user)
  //       console.log(response)
  //       saveToken(response.token)
  //     }
  //   } catch (error) {
  //     setError(error as Error)
  //     router.replace('/(auth)')
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  if (isLoading) {
    return <Loader />
  }

  return (
    <Wrapper fullScreen>
      <GoBackButton />
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
            <TextInput
              mode="outlined"
              label="Phone Number"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              onFocus={() => {
                onPhoneNumberFocus()
                clearErrors('phoneNumber')
              }}
              keyboardType="phone-pad"
              style={[styles.input, { backgroundColor: theme.colors.surface }]}
              selectionColor={theme.colors.primary}
              error={!!error}
              outlineStyle={{ borderWidth: 1 }}
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
            <TextInput
              mode="outlined"
              label="Password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              onFocus={() => clearErrors('password')}
              secureTextEntry
              style={[styles.input, { backgroundColor: theme.colors.surface }]}
              selectionColor={theme.colors.primary}
              error={!!error}
              outlineStyle={{ borderWidth: 1 }}
            />
          )}
        />
        <Button
          mode="contained"
          onPress={handleSubmit(signIn)}
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
        >
          Login
        </Button>
        <View style={styles.row}>
          <Text>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.replace('/(auth)/register')}>
            <Text style={[styles.link, { color: theme.colors.primary }]}>Sign up</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => router.replace('/(auth)/forgot-password')}>
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
    marginTop: 20
  },
  input: {
    marginBottom: 12
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
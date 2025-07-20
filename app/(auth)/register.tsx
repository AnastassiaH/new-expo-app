import SignUpForm from '@/components/feature/SignUpForm'
import { Header, Loader, Logo, Wrapper } from '@/components/ui'
import { DEFAULT_ERROR_MESSAGE } from '@/constants'
import { registerUser } from '@/services/api.service'
import { useAuthError } from '@/stores/errorStore'
import usePhoneStore from '@/stores/phoneStore'
import { UserData } from '@/types'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Text, useTheme } from 'react-native-paper'

export default function RegisterScreen() {
  const theme = useTheme()
  const setError = useAuthError(s => s.setError);
  const [isLoading, setIsLoading] = useState(false)
  const { setPhone } = usePhoneStore()
  const { t } = useTranslation()

  async function signUpUser(data: UserData) {
    setError('')
    setPhone(data.phoneNumber)
    console.log(data)

    try {
      setIsLoading(true)
      const response = await registerUser(data)
      if (response) {
        router.replace('/(auth)/verification')
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
      <Header>{t('register.title')}</Header>
      <SignUpForm onSubmit={signUpUser} />
      <View style={styles.row}>
        <Text style={{ color: theme.colors.primary }}>{t('register.alreadyHaveAccount')} </Text>
        <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
          <Text style={[styles.link, { color: theme.colors.primary }]}>{t('register.login')}</Text>
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

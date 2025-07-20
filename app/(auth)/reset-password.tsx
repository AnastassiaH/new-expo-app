import { AppTextInput } from '@/components/atoms'
import { Header, Loader, Logo, Wrapper } from '@/components/ui'
import { DEFAULT_ERROR_MESSAGE } from '@/constants'
import { resetPassword } from '@/services/api.service'
import { useAuthError } from '@/stores/errorStore'
import usePhoneStore from '@/stores/phoneStore'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { Button, useTheme } from 'react-native-paper'


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
  const { t } = useTranslation()

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
      <Header>{t('resetPassword.title')}</Header>
      <View style={styles.form}>
        <Controller
          control={control}
          name="verificationCode"
          rules={{
            required: t('verification.requiredCode'),
            pattern: {
              value: /^\d{6}$/,
              message: t('verification.patternCode')
            }
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <AppTextInput
              mode="outlined"
              label={t('verification.label')}
              placeholder={t('verification.placeholder')}
              value={value}
              onChangeText={onChange}
              keyboardType="number-pad"
              style={styles.input}
              error={!!error}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          rules={{
            required: t('common.fields.password.required'),
            minLength: {
              value: 6,
              message: t('common.fields.password.invalid')
            }
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <AppTextInput
              mode="outlined"
              label={t('common.fields.password.newPassword')}
              value={value}
              onChangeText={onChange}
              secureTextEntry
              style={styles.input}
              error={!!error}
            />
          )}
        />

        <Controller
          control={control}
          name="passwordRetry"
          rules={{
            required: t('common.fields.password.requiredConfirmPassword'),
            validate: value => value === watch('password') || t('common.fields.password.mismatch')
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <AppTextInput
              mode="outlined"
              label={t('common.fileds.password.confirmPassword')}
              value={value}
              onChangeText={onChange}
              secureTextEntry
              style={styles.input}
              error={!!error}
            />
          )}
        />

        <Button
          mode="contained"
          onPress={handleSubmit(sendResetPassword)}
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
        >
          {t('resetPassword.submitButton')}
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

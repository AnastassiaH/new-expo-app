import { Button } from '@/components/atoms'
import { Header, Loader, Logo, Wrapper } from '@/components/ui'
import { verifyPhone } from '@/services/api.service'
import usePhoneStore from '@/stores/phoneStore'
import { useUserStore } from '@/stores/userStore'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { StyleSheet, View } from 'react-native'
import { Text, TextInput, useTheme } from 'react-native-paper'

type VerificationFormData = {
  verificationCode: string
}

const VerificationScreen: React.FC = () => {
  const theme = useTheme()
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { phone } = usePhoneStore()
  const { setUser } = useUserStore()

  const handleVerification = async (verificationFormData: VerificationFormData) => {
    const data = {
      phoneNumber: phone,
      code: verificationFormData.verificationCode
    }

    try {
      setIsLoading(true)
      const response = await verifyPhone(data)

      if (response) {
        setUser(response)
        router.replace('/(app)/ride')
      }
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }

  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors }
  } = useForm<VerificationFormData>()

  const onSubmit = handleSubmit(handleVerification)

  useEffect(() => {
    if (error !== null) {
      // showMessage({
      //   message: error.message,
      //   type: 'danger'
      // })
    }
    router.replace('/(auth)/verification')
    setError(null)
  }, [error])

  if (isLoading) return <Loader />

  return (
    <Wrapper fullScreen>
      <Logo />
      <Header title="Verification" />
      <View style={styles.container}>
        <View style={styles.formWrapper}>
          <Controller
            control={control}
            name="verificationCode"
            rules={{
              required: 'Verification code is required',
              minLength: {
                value: 4,
                message: 'Code must be 4 digits'
              },
              maxLength: {
                value: 4,
                message: 'Code must be 4 digits'
              }
            }}
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                mode="outlined"
                label="Verification Code"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="numeric"
                maxLength={4}
                style={[styles.input, { backgroundColor: theme.colors.surface }]}
                selectionColor={theme.colors.primary}
                error={!!errors.verificationCode}
              />
            )}
          />
          {errors.verificationCode && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                {errors.verificationCode.message}
              </Text>
            </View>
          )}
          <Button
            mode="contained"
            onPress={onSubmit}
            loading={isLoading}
            disabled={isLoading}
            style={styles.button}
          >
            Verify
          </Button>
        </View>
      </View>
    </Wrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  formWrapper: {
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
    padding: 20,
    borderRadius: 10,
    marginTop: 20
  },
  input: {
    marginBottom: 16
  },
  errorContainer: {
    marginTop: 4
  },
  errorText: {
    color: 'red'
  },
  button: {
    marginTop: 16
  }
})

export default VerificationScreen

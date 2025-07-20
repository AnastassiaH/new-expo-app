import { AppTextInput } from '@/components/atoms'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { Button, useTheme } from 'react-native-paper'

interface UserSignInData {
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  password: string
  confirmPassword: string
}

type SignUpFormProps = {
  onSubmit: (data: UserSignInData) => void
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSubmit }) => {
  const theme = useTheme()
  const { t } = useTranslation()
  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    getValues
  } = useForm<UserSignInData>()

  const onPhoneNumberFocus = () => {
    if (!getValues('phoneNumber')) {
      setValue('phoneNumber', '+380')
    }
  }

  return (
    <View style={styles.form}>
      <Controller
        control={control}
        name="email"
        rules={{
          required: t('common.fields.email.required'),
          pattern: {
            value: /^\S+@\S+$/i,
            message: t('common.fields.email.invalid')
          }
        }}
        render={({ field: { value, onChange, onBlur } }) => (
          <AppTextInput
            mode="outlined"
            label={t('common.fields.email.label')}
            placeholder={t('common.fields.email.placeholder')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            keyboardType="email-address"
            style={styles.input}
          />
        )}
      />
      <Controller
        control={control}
        name="firstName"
        rules={{
          required: t('register.firstName.required')
        }}
        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
          <AppTextInput
            mode="outlined"
            label={t('register.firstName.label')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            onFocus={() => clearErrors('firstName')}
            style={styles.input}
            error={!!error}
          />
        )}
      />
      <Controller
        control={control}
        name="lastName"
        rules={{
          required: t('register.lastName.required')
        }}
        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
          <AppTextInput
            mode="outlined"
            label={t('register.lastName.label')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            onFocus={() => clearErrors('lastName')}
            style={styles.input}
            error={!!error}
          />
        )}
      />
      <Controller
        control={control}
        name="phoneNumber"
        rules={{
          required: t('common.fields.phoneNumber.required'),
          pattern: {
            value: /^\+380\d{9}$/,
            message: t('common.fields.phoneNumber.invalid')
          }
        }}
        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
          <AppTextInput
            mode="outlined"
            label={t('common.fields.phoneNumber.label')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            onFocus={onPhoneNumberFocus}
            keyboardType="phone-pad"
            returnKeyType="done"
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
        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
          <AppTextInput
            mode="outlined"
            label={t('common.fields.password.label')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
            style={styles.input}
            error={!!error}
          />
        )}
      />
      <Controller
        control={control}
        name="confirmPassword"
        rules={{
          required: t('common.fields.password.requiredConfirmPassword'),
          validate: value => value === watch('password') || 'Passwords do not match'
        }}
        render={({ field: { value, onChange, onBlur } }) => (
          <AppTextInput
            mode="outlined"
            label={t('common.fields.password.confirmPassword')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
            style={styles.input}
          />
        )}
      />
      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
      >
        {t('register.submitButton')}
      </Button>
    </View>
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

export default SignUpForm

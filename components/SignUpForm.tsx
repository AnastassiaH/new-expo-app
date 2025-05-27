import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { StyleSheet, View } from 'react-native'
import { TextInput, useTheme } from 'react-native-paper'
import Button from './atoms/Button'

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
  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    getValues
  } = useForm<UserSignInData>()

  console.log(getValues())

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
          required: 'You must enter your email',
          pattern: {
            value: /^\S+@\S+$/i,
            message: 'Enter a valid email address'
          }
        }}
        render={({ field: { value, onChange, onBlur } }) => (
          <TextInput
            mode="outlined"
            label="Email"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            keyboardType="email-address"
            style={[styles.input, { backgroundColor: theme.colors.surface }]}
            selectionColor={theme.colors.primary}
          />
        )}
      />
      <Controller
        control={control}
        name="firstName"
        rules={{
          required: 'First name is required'
        }}
        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
          <TextInput
            mode="outlined"
            label="First Name"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            onFocus={() => clearErrors('firstName')}
            style={[styles.input, { backgroundColor: theme.colors.surface }]}
            selectionColor={theme.colors.primary}
            error={!!error}
          />
        )}
      />
      <Controller
        control={control}
        name="lastName"
        rules={{
          required: 'Last name is required'
        }}
        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
          <TextInput
            mode="outlined"
            label="Last Name"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            onFocus={() => clearErrors('lastName')}
            style={[styles.input, { backgroundColor: theme.colors.surface }]}
            selectionColor={theme.colors.primary}
            error={!!error}
          />
        )}
      />
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
            onFocus={onPhoneNumberFocus}
            keyboardType="phone-pad"
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
        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
          <TextInput
            mode="outlined"
            label="Password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
            style={[styles.input, { backgroundColor: theme.colors.surface }]}
            selectionColor={theme.colors.primary}
            error={!!error}
          />
        )}
      />
      <Controller
        control={control}
        name="confirmPassword"
        rules={{
          required: 'You must confirm your password',
          validate: value => value === watch('password') || 'Passwords do not match'
        }}
        render={({ field: { value, onChange, onBlur } }) => (
          <TextInput
            mode="outlined"
            label="Confirm Password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
            style={[styles.input, { backgroundColor: theme.colors.surface }]}
            selectionColor={theme.colors.primary}
          />
        )}
      />
      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
      >
        Sign Up
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
    marginTop: 20
  },
  input: {
    marginBottom: 12
  },
  button: {
    marginTop: 12
  }
})

export default SignUpForm

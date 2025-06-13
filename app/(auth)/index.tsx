
import { Header, Logo, Wrapper } from '@/components/ui'
import { router } from 'expo-router'
import React from 'react'
import { Button } from 'react-native-paper'

export default function StartScreen() {
	return (
		<Wrapper fullScreen>
			<Logo />
			<Header>Ride the city</Header>
			<Button
				style={{ marginVertical: 20, width: '80%' }}
				mode="contained"
				onPress={() => router.push('/(auth)/login')}
			>
				Login
			</Button>
			<Button
				style={{ width: '80%' }}
				mode="outlined"
				onPress={() => router.push('/(auth)/register')}
			>
				Sign Up
			</Button>
		</Wrapper>
	)
}

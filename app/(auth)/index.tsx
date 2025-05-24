import Logo from '@/components/Logo'
import Button from '@/components/ui/Button'
import Header from '@/components/ui/Header'
import Wrapper from '@/components/ui/Wrapper'
import { router } from 'expo-router'
import React from 'react'

export default function StartScreen() {
	return (
		<Wrapper fullScreen>
			<Logo />
			<Header>Ride the city</Header>
			<Button
				style={{}}
				mode="contained"
				onPress={() => router.push('/(auth)/login')}
			>
				Login
			</Button>
			<Button
				style={{}}
				mode="outlined"
				onPress={() => router.push('/(auth)/register')}
			>
				Sign Up
			</Button>
		</Wrapper>
	)
}

import Logo from '@/components/Logo'
import Button from '@/components/ui/Button'
import Header from '@/components/ui/Header'
import Wrapper from '@/components/ui/Wrapper'
import React from 'react'

export default function StartScreen() {
	return (
		<Wrapper fullScreen>
			<Logo />
			<Header>Ride the city</Header>
			<Button
				style={{}}
				mode="contained"
			// onPress={() => navigation.navigate(Screens.LoginScreen)}
			>
				Login
			</Button>
			<Button
				style={{}}
				mode="outlined"
			// onPress={() => navigation.navigate(Screens.RegisterScreen)}
			>
				Sign Up
			</Button>
		</Wrapper>
	)
}

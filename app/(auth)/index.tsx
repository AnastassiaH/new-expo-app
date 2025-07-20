
import { Header, Logo, Wrapper } from '@/components/ui'
import { router } from 'expo-router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'react-native-paper'

export default function StartScreen() {
	const { t } = useTranslation()
	return (
		<Wrapper fullScreen={false}>
			<Logo />
			<Header>{t('common.welcome')}</Header>
			<Button
				style={{ marginVertical: 20, width: '80%' }}
				mode="contained"
				onPress={() => router.push('/(auth)/login')}
			>
				{t('login.title')}
			</Button>
			<Button
				style={{ width: '80%' }}
				mode="outlined"
				onPress={() => router.push('/(auth)/register')}
			>
				{t('register.title')}
			</Button>
		</Wrapper>
	)
}

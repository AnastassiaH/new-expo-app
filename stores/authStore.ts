import { AUTO_SIGN_OUT_TIMEOUT } from '@/constants';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

type AuthState = {
	session: string | null;
	isReady: boolean;
	isLoggedIn: boolean;
	error: Error | null;
	signIn: (token: string) => Promise<void>;
	signOut: () => Promise<void>;
	hydrateSession: () => Promise<void>;
	lastActivityTime: null | number,
	setLastActivityTime: (timestamp: number) => void,
};

export const useAuthStore = create<AuthState>((set) => ({
	session: null,
	isLoggedIn: false,
	isReady: false,
	error: null,
	lastActivityTime: null as number | null,

	signIn: async (token: string) => {
		try {
			if (!token) {
				throw new Error('No token provided');
			}
			const session = token;
			await SecureStore.setItemAsync('session', session);
			await SecureStore.setItemAsync('lastActivityTime', Date.now().toString());
			set({ session, isLoggedIn: true, lastActivityTime: Date.now() });
			router.replace('/(app)/ride');
		} catch (error) {
			console.error('Sign-in error:', error);
			set({ error: error as Error });
		}
	},

	signOut: async () => {
		try {
			await SecureStore.deleteItemAsync('session');
			await SecureStore.deleteItemAsync('lastActivityTime');
			set({ session: null, isLoggedIn: false });
			router.replace('/');
		} catch (error) {
			console.error('Sign-out error:', error);
			set({ error: error as Error });
		}
	},

	hydrateSession: async () => {
		try {
			const session = await SecureStore.getItemAsync('session');
			const lastActivityTime = await SecureStore.getItemAsync('lastActivityTime');
			const lastActivityTimeNumber = Number(lastActivityTime);
			if (session && lastActivityTimeNumber + AUTO_SIGN_OUT_TIMEOUT > Date.now()) {
				set({ session, isLoggedIn: true, isReady: true, lastActivityTime: lastActivityTimeNumber });
			} else {
				set({ session: null, isLoggedIn: false, isReady: true, lastActivityTime: null });
			}
		} catch (error) {
			console.error('Hydration error:', error);
			set({ error: error as Error, session: null, isLoggedIn: false, isReady: true });
		}
	},

	setLastActivityTime: (timestamp: number) => set({ lastActivityTime: timestamp }),
}));

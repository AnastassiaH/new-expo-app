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
};

export const useAuthStore = create<AuthState>((set) => ({
	session: null,
	isLoggedIn: false,
	isReady: false,
	error: null,

	signIn: async (token: string) => {
		try {
			if (!token) {
				throw new Error('No token provided');
			}
			const session = token;
			await SecureStore.setItemAsync('session', session);
			set({ session, isLoggedIn: true });
			router.replace('/(app)/ride');
		} catch (error) {
			console.error('Sign-in error:', error);
			set({ error: error as Error });
		}
	},

	signOut: async () => {
		try {
			await SecureStore.deleteItemAsync('session');
			set({ session: null, isLoggedIn: false });
			router.replace('/(auth)/login');
		} catch (error) {
			console.error('Sign-out error:', error);
			set({ error: error as Error });
		}
	},

	hydrateSession: async () => {
		try {
			const session = await SecureStore.getItemAsync('session');
			if (session) {
				set({ session, isLoggedIn: true, isReady: true });
			} else {
				set({ session: null, isLoggedIn: false, isReady: true });
			}
		} catch (error) {
			console.error('Hydration error:', error);
			set({ error: error as Error, session: null, isLoggedIn: false, isReady: true });
		}
	},
}));

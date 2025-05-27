
import * as SecureStore from 'expo-secure-store';

export const TOKEN_KEY = 'auth_token'
export const TOKEN_SAVED_AT_KEY = 'token_saved_at'

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY)
}

export async function getTokenSavedAt(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_SAVED_AT_KEY)
}

export async function clearToken(): Promise<boolean> {
  const result = await SecureStore.deleteItemAsync(TOKEN_KEY)
  const result2 = await SecureStore.deleteItemAsync(TOKEN_SAVED_AT_KEY)
  return result !== undefined && result2 !== undefined
}

export async function saveToken(token: string) {
  const timestamp = Date.now();
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  await SecureStore.setItemAsync(TOKEN_SAVED_AT_KEY, timestamp.toString());
}
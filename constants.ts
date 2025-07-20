import { ApiEndpoints, City } from "@/types";

export const BASE_URL = process.env.BASE_URL;
export const API_ENDPOINTS: ApiEndpoints = {
	ride: '/rides',
	createUser: '/auth/signup',
	getUser: '/users',
	loginUser: '/auth/login',
	verifyPhoneNumber: '/auth/verify/phone',
	confirmPhoneNumber: '/auth/verify',
	forgotPassword: '/auth/forgot/password',
	resetPassword: '/auth/recovery/password',
}

export const AUTO_SIGN_OUT_TIMEOUT = 3600_000;
export const DEFAULT_ERROR_MESSAGE = 'Oh, woe to me, My Lord!';
export const DEFAULT_MAPS_ERROR_MESSAGE = 'Google Maps is not available';
export const REFRESH_PARTNERS_INTERVAL = 60 * 1000 * 5;
export const CITIES: City[] = [
	{
		name: 'Львів',
		engName: 'Lviv',
		latitude: 49.8397,
		longitude: 24.0297,
	},
	{
		name: 'Київ',
		engName: 'Kyiv',
		latitude: 50.4501,
		longitude: 30.5234,
	},
	{
		name: 'Дніпро',
		engName: 'Dnipro',
		latitude: 48.4647,
		longitude: 35.0462,
	},
	{
		name: 'Одеса',
		engName: 'Odesa',
		latitude: 46.4825,
		longitude: 30.7233,
	},
	{
		name: 'Харків',
		engName: 'Kharkiv',
		latitude: 49.9935,
		longitude: 36.2304,
	},
];

export const INITIAL_MAP_REGION = {
	latitude: 50.4501,
	longitude: 30.5234,
	latitudeDelta: 5.5,
	longitudeDelta: 7.5,
}

export const LOCATION_FETCHING_DISTANCE_FILTER = 100;
export const WALK_DISTANCE_MAX = 500;
export const UNAUTHORIZED_ERROR_MESSAGE = 'Упс, потрібно перезайти в систему';
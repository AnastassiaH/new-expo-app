import { ApiEndpoints } from "@/types";

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

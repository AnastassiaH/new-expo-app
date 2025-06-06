export type RootStackParamList = {
	RideScreen: undefined
	VerificationScreen: { phoneNumber: string }
	PartnersScreen: undefined

	StartScreen: undefined
	LoginScreen: undefined
	RegisterScreen: undefined
	ResetPasswordScreen: { phone: string }
	ForgotPasswordScreen: undefined
	AppDrawer: undefined
}

// export enum Screens {
// 	RideScreen = 'RideScreen',
// 	VerificationScreen = 'VerificationScreen',
// 	PartnersScreen = 'PartnersScreen',
// 	StartScreen = 'StartScreen',
// 	LoginScreen = 'LoginScreen',
// 	RegisterScreen = 'RegisterScreen',
// 	ResetPasswordScreen = 'ResetPasswordScreen',
// 	ForgotPasswordScreen = 'ForgotPasswordScreen',
// 	AppDrawer = 'AppDrawer',
// 	Settings = 'Settings',
// 	Account = 'Account',
// 	History = 'History'
// }

export interface AutocompleteInputData {
	formatted_address: string
	lat: number
	lng: number
}

export interface Point {
	x: number
	y: number
}

export interface PlacePoint {
	latitude: number
	longitude: number
}

export type LocationPoint = {
	latitude: number
	longitude: number
	formatted_address?: string
}

export type RideData = {
	userId: number
	placeFrom: {
		distance: number
		name: string
		point: Point
	}
	placeTo: {
		distance: number
		name: string
		point: Point
	}
	id?: string
	date?: string
	isActive?: boolean
}

export type UserData = {
	id?: string
	email: string
	firstName: string
	lastName: string
	phoneNumber: string
	registrationCompleted?: boolean
	createdDate?: string
	verificationCompleted?: boolean
}

export interface PartnerData extends Omit<RideData, 'userId'> {
	user?: UserData
}

export type VerifyPhoneData = {
	phoneNumber: string
}

export type LoginData = {
	phoneNumber: string
	password: string
}

export type ApiEndpoints = {
	ride: string
	createUser: string
	getUser: string
	loginUser: string
	verifyPhoneNumber: string
	confirmPhoneNumber: string
	forgotPassword: string
	resetPassword: string
}

export interface RegionData {
	city: string;
	region: string;
	country: string;
}

export interface PlacePrediction {
	description: string;
	place_id: string;
	formatted_address: string;
	structured_formatting?: {
		main_text: string;
		secondary_text: string;
	}
}

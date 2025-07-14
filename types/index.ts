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

export interface AutocompleteInputData {
	formatted_address: string
	lat: number
	lng: number
}

export interface Point {
	x: number
	y: number
}

export interface PlaceCoords {
	latitude: number
	longitude: number
}

export type LocationPoint = PlaceCoords & {
	description: string
}

export interface City extends PlaceCoords {
	name: string;
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

// expo location
export interface LocationData {
	coords: {
		latitude: number;
		longitude: number;
		altitude?: number | null;
		accuracy?: number | null;
		heading?: number | null;
		speed?: number | null;
	};
	timestamp: number;
}

// additional user location data
export interface UserLocationData {
	city: string;
	region: string;
	country: string;
	addresses?: PlacePrediction[]
}

export interface PlacePrediction {
	description: string;
	place_id: string;
	formatted_address: string;
	structured_formatting?: {
		main_text: string;
		secondary_text: string;
	},
	geometry?: {
		location: {
			lat: number;
			lng: number;
		}
	}
}

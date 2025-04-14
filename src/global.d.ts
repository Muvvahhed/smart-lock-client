export type TUser = {
	_id: string
	email: string
	deviceId: string
	fullName: string
	role: 'admin' | 'user'
	biometricEnrolled: boolean
	biometricId: number
	isActive: boolean
	lastLogin?: Date
	createdAt: Date
}

export type TDevice = {
	_id: string
	deviceId: string
	lockState: 'locked' | 'unlocked'
	batteryLevel: number
	wifiStatus?: boolean
	createdAt: Date
	updatedAt: Date
}

export type TNotification = {
	_id: string
	user: string | TUser
	type: 'security' | 'system' | 'info'
	message: string
	read: boolean
	createdAt: Date
	updatedAt: Date
}

export type TAccessLog = {
	_id: string
	user: string | TUser
	accessMethod: 'pin' | 'biometric' | 'mobile'
	success: boolean
	notes?: string
	createdAt: Date
	updatedAt: Date
}

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TUser } from '@/global'

// Define device interface
interface Device {
	_id: string
	deviceId: string
	lockState: 'locked' | 'unlocked'
	batteryLevel: number
	wifiStrength?: number
	lastUpdated?: string
	lastCheckIn?: string
	status?: 'online' | 'offline'
}

// Define access log interface
interface AccessLog {
	_id: string
	user: {
		_id: string
		fullName: string
		email: string
	}
	accessMethod: 'pin' | 'biometric' | 'mobile' | 'web'
	action: string
	success: boolean
	notes?: string
	createdAt: string
	updatedAt: string
}

// Define dashboard summary interface
interface DashboardSummary {
	device: Device
	recentLogs: AccessLog[]
	userCount: number
	totalAccesses: number
	successRate: number
}

const baseUrl = import.meta.env.VITE_BASE_URL
console.log('baseUrl:', baseUrl)

export const basApi = createApi({
	reducerPath: 'basApi',
	baseQuery: fetchBaseQuery({
		baseUrl: `${baseUrl}`,
		prepareHeaders: (headers) => {
			const token = localStorage.getItem('token')
			if (token) {
				headers.set('authorization', `Bearer ${token}`)
			}
			return headers
		},
		credentials: 'include',
	}),
	tagTypes: ['User', 'Device', 'Log', 'Dashboard'],
	endpoints: (builder) => ({
		login: builder.mutation({
			query: (credentials: {
				email: string
				password: string
				deviceId: string
			}) => ({
				url: '/user/login',
				method: 'POST',
				body: credentials,
			}),
			invalidatesTags: ['User'],
			transformResponse: (response: {
				data: { token: string; user: TUser }
			}) => {
				return response.data
			},
		}),

		// Get all users
		getUsers: builder.query({
			query: () => ({
				url: '/user',
				method: 'GET',
			}),
			providesTags: ['User'],
			transformResponse: (response: { data: TUser[] }) => {
				return response.data
			},
		}),

		// Create a new user
		createUser: builder.mutation({
			query: (userData: {
				email: string
				fullName: string
				pincode: string
			}) => ({
				url: '/user/register',
				method: 'POST',
				body: userData,
			}),
			invalidatesTags: ['User'],
			transformResponse: (response: { data: { user: TUser } }) => {
				return response.data
			},
		}),

		// Delete a user
		deleteUser: builder.mutation({
			query: (userId: string) => ({
				url: `/user/${userId}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['User'],
		}),

		// Enroll biometric for a user
		enrollBiometric: builder.mutation({
			query: (userId: string) => ({
				url: `/enroll`,
				method: 'PUT',
				body: { userId },
			}),
			invalidatesTags: ['User'],
		}),

		// Get device status
		getDeviceStatus: builder.query<Device, void>({
			query: () => ({
				url: '/device',
				method: 'GET',
			}),
			providesTags: ['Device'],
			transformResponse: (response: { data: Device }) => {
				return response.data
			},
		}),

		// Control door lock/unlock
		controlDoor: builder.mutation<
			{ success: boolean; message: string },
			{ action: 'lock' | 'unlock' }
		>({
			query: ({ action }) => ({
				url: '/door-control',
				method: 'PUT',
				body: { action },
			}),
			invalidatesTags: ['Device', 'Log', 'Dashboard'],
		}),

		// Get access logs
		getAccessLogs: builder.query<AccessLog[], void>({
			query: () => ({
				url: '/access-logs/fetch',
				method: 'GET',
			}),
			providesTags: ['Log'],
			transformResponse: (response: { data: AccessLog[] }) => {
				return response.data
			},
		}),

		// Get dashboard summary data
		getDashboardSummary: builder.query<DashboardSummary, void>({
			query: () => ({
				url: '/dashboard/summary',
				method: 'GET',
			}),
			providesTags: ['Dashboard', 'Device', 'Log'],
			transformResponse: (response: { data: DashboardSummary }) => {
				return response.data
			},
		}),

		// Run device diagnostics
		runDiagnostics: builder.mutation<
			{ success: boolean; message: string },
			void
		>({
			query: () => ({
				url: '/device/diagnostics',
				method: 'POST',
			}),
			invalidatesTags: ['Device', 'Dashboard'],
		}),
	}),
})

export const {
	useLoginMutation,
	useGetUsersQuery,
	useCreateUserMutation,
	useDeleteUserMutation,
	useEnrollBiometricMutation,
	useGetDeviceStatusQuery,
	useControlDoorMutation,
	useGetAccessLogsQuery,
	useGetDashboardSummaryQuery,
	useRunDiagnosticsMutation,
} = basApi

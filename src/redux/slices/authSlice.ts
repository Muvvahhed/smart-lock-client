import { TUser } from '@/global'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
	user: TUser | null
	token: string | null
	isAuthenticated: boolean
}

// Initialize state from localStorage if available
const initialState: AuthState = {
	user: localStorage.getItem('user')
		? JSON.parse(localStorage.getItem('user')!)
		: null,
	token: localStorage.getItem('token') || null,
	isAuthenticated: Boolean(localStorage.getItem('token')),
}

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setCredentials: (
			state,
			action: PayloadAction<{ user: TUser; token: string }>
		) => {
			const { user, token } = action.payload
			state.user = user
			state.token = token
			state.isAuthenticated = true

			// Persist to localStorage
			localStorage.setItem('token', token)
			localStorage.setItem('user', JSON.stringify(user))
		},
		logout: (state) => {
			state.user = null
			state.token = null
			state.isAuthenticated = false

			// Clear localStorage
			localStorage.removeItem('token')
			localStorage.removeItem('user')
		},
	},
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer

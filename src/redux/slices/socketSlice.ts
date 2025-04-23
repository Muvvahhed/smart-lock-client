import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export interface SocketState {
	isConnected: boolean
}

const initialState: SocketState = {
	isConnected: false,
}

const socketSlice = createSlice({
	name: 'socket',
	initialState,
	reducers: {
		setConnectionStatus: (state, action: PayloadAction<boolean>) => {
			state.isConnected = action.payload
		},
	},
})

export const { setConnectionStatus } = socketSlice.actions

export default socketSlice.reducer

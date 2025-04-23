import { configureStore } from '@reduxjs/toolkit'
import { basApi } from './api'
import authReducer from './slices/authSlice'
import socketReducer from './slices/socketSlice'

const store = configureStore({
	reducer: {
		[basApi.reducerPath]: basApi.reducer,
		auth: authReducer,
		socket: socketReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(basApi.middleware),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export default store

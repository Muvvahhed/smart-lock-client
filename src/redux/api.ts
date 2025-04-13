import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
const baseUrl = import.meta.env.VITE_BASE_URL
console.log('baseUrl:', baseUrl)
export const basApi = createApi({
	reducerPath: 'basApi',
	baseQuery: fetchBaseQuery({
		baseUrl: `${baseUrl}/api`,
		prepareHeaders: (headers) => {
			const token = localStorage.getItem('token')
			if (token) {
				headers.set('authorization', `Bearer ${token}`)
			}
			return headers
		},
		credentials: 'include',
	}),
	tagTypes: ['Student', 'Course', 'User', 'Attendance'],
	endpoints: (_builder) => ({}),
})

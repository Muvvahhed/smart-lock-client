import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TUser } from '@/global'

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
	tagTypes: ['User', 'Device', 'Log'],
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
	}),
})

export const { useLoginMutation } = basApi

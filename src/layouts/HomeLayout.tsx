import { AppSidebar } from '@/components/AppSidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { basApi } from '@/redux/api'
import { useAppDispatch, useAppSelector } from '@/redux/hook'
import { setConnectionStatus } from '@/redux/slices/socketSlice'
// Import the API hook for device status and potentially update actions
import { useEffect, useRef } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { toast } from 'sonner'

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080' // Provide a default fallback

function HomeLayout() {
	const user = useAppSelector((state) => state.auth.user)
	const dispatch = useAppDispatch()
	const wsRef = useRef<WebSocket | null>(null)

	useEffect(() => {
		// if (!user) return // Don't establish connection if not logged in

		// Fetch initial device status when component mounts
		// refetchDevice()

		if (wsRef.current) {
			wsRef.current.close() // Close any existing connection
		}

		const ws = new WebSocket(`${WS_URL}?clientType=hardware-web`)
		wsRef.current = ws // Store the WebSocket instance in the ref

		ws.onopen = () => {
			console.log('WebSocket connected')
			ws.send(JSON.stringify({ action: 'checkHardwareStatus' }))
			// // Optionally fetch status again on connect if needed
			// refetchDevice()
		}

		ws.onmessage = (event) => {
			try {
				const message = JSON.parse(event.data as string)
				console.log('WebSocket message received:', message)

				// Handle different event types from the server
				switch (message.action) {
					case 'hardwareStatus':
						dispatch(setConnectionStatus(message.hardwareActive))
						if (message.hardwareActive) {
							toast.success('Hardware is online', {
								closeButton: true,
							})
						} else {
							toast.error('Hardware is offline', {
								closeButton: true,
							})
						}

						break

					case 'update':
						// Invalidate the device cache to trigger a refetch
						// This assumes your API slice is set up to handle this tag
						dispatch(basApi.util.invalidateTags(['Log']))
						break
					case 'doorLocked': {
						// Invalidate the device cache to trigger a refetch
						// This assumes your API slice is set up to handle this tag
						dispatch(basApi.util.invalidateTags(['Device']))
						toast.success('Door Locked', {
							description: 'The door has been successfully locked.',
							closeButton: true,
						})
						break
					}
					case 'HARDWARE_DISCONNECTION':
						// Invalidate device cache and show notification
						dispatch(basApi.util.invalidateTags(['Device', 'Log']))
						dispatch(setConnectionStatus(false)) // Reflect hardware disconnect potentially
						toast.error('Hardware Disconnected', {
							description: 'The smart lock hardware appears to be offline.',
							closeButton: true,
						})
						break
					// Add more cases as needed for other events
					default:
						console.log(
							'Received unhandled WebSocket event type:',
							message.type
						)
				}
			} catch (error) {
				console.error(
					'Failed to parse WebSocket message or handle event:',
					error
				)
			}
		}

		ws.onerror = (error) => {
			console.error('WebSocket error:', error)
			dispatch(setConnectionStatus(false))
		}

		ws.onclose = (event) => {
			console.log('WebSocket disconnected:', event.reason)
			dispatch(setConnectionStatus(false))
		}

		// Cleanup function to close WebSocket connection on component unmount
		return () => {
			if (
				ws.readyState === WebSocket.OPEN ||
				ws.readyState === WebSocket.CONNECTING
			) {
				ws.close()
				console.log('WebSocket connection closed on cleanup.')
			}
		}
	}, [dispatch, user])

	if (!user) return <Navigate to="/login" />

	return (
		<SidebarProvider>
			{/* Pass user data if AppSidebar needs it */}
			<AppSidebar user={user} />
			<SidebarInset>
				<Outlet />
			</SidebarInset>
		</SidebarProvider>
	)
}

export default HomeLayout

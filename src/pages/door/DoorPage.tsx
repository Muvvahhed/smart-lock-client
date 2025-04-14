import Header from '@/components/Header'
import React, { useEffect, useState } from 'react'
import {
	Calendar,
	Clock,
	LockKeyhole,
	MoreHorizontal,
	UnlockKeyhole,
	AlertCircle,
	History,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import {
	useGetDeviceStatusQuery,
	useControlDoorMutation,
	useGetAccessLogsQuery,
} from '@/redux/api'
import { formatDate } from '@/lib/utils'

function DoorPage() {
	const [currentDateTime, setCurrentDateTime] = useState(new Date())

	// Use Redux hooks for device status and control
	const {
		data: device,
		isLoading: isLoadingDevice,
		refetch: refetchDevice,
	} = useGetDeviceStatusQuery()

	const [controlDoor, { isLoading: isControlling }] = useControlDoorMutation()

	// Use Redux hook for access logs
	const {
		data: accessLogs = [],
		isLoading: isLoadingLogs,
		isError: isErrorLogs,
		refetch: refetchLogs,
	} = useGetAccessLogsQuery()

	// Update the date and time every minute
	useEffect(() => {
		const intervalId = setInterval(() => {
			setCurrentDateTime(new Date())
		}, 60000) // Update every minute (60000 ms)

		return () => clearInterval(intervalId) // Cleanup on unmount
	}, [])

	// Format the date and time
	const formattedDate = new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	}).format(currentDateTime)

	const formattedTime = new Intl.DateTimeFormat('en-US', {
		hour: 'numeric',
		minute: 'numeric',
		hour12: true,
	}).format(currentDateTime)

	// Determine if door is locked based on API data
	const doorLocked = device?.lockState === 'locked'

	const toggleDoor = async () => {
		// Determine the action based on current state
		const action = doorLocked ? 'unlock' : 'lock'

		try {
			// Use the RTK Query mutation
			const result = await controlDoor({ action }).unwrap()

			// Show success notification
			toast.success(action === 'unlock' ? 'Door Unlocked' : 'Door Locked', {
				description: `The door has been successfully ${
					action === 'unlock' ? 'unlocked' : 'locked'
				}.`,
			})

			// Refetch to ensure UI is in sync with backend
			refetchDevice()
			// Also refresh logs as a new log entry may be created
			refetchLogs()
		} catch (error) {
			// Show error notification
			toast.error('Failed to control door', {
				description:
					error instanceof Error ? error.message : 'An error occurred',
			})
		}
	}

	return (
		<>
			<Header page="Door Control" />
			<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
				{' '}
				<div className="space-y-6">
					<div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
						<div>
							<p className="text-muted-foreground">
								Manage door access and view access logs
							</p>
						</div>
						<div className="flex items-center gap-2">
							<Button variant="outline" size="sm">
								<Calendar className="mr-2 h-4 w-4" />
								<span>{formattedDate}</span>
							</Button>
							<Button variant="outline" size="sm">
								<Clock className="mr-2 h-4 w-4" />
								<span>{formattedTime}</span>
							</Button>
						</div>
					</div>

					<Card>
						<CardHeader>
							<CardTitle>Door Status</CardTitle>
							<CardDescription>Current status and control</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col items-center justify-center py-6">
							{isLoadingDevice ? (
								<div className="flex flex-col items-center justify-center">
									<div className="h-32 w-32 rounded-full border-8 border-primary/20 bg-primary/10 animate-pulse"></div>
									<h3 className="mb-2 mt-6 text-3xl font-bold">Loading...</h3>
								</div>
							) : (
								<>
									<div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full border-8 border-primary/20 bg-primary/10">
										{doorLocked ? (
											<LockKeyhole className="h-16 w-16 text-primary" />
										) : (
											<UnlockKeyhole className="h-16 w-16 text-amber-500" />
										)}
									</div>
									<h3 className="mb-2 text-3xl font-bold">
										{doorLocked ? 'Locked' : 'Unlocked'}
									</h3>
									{device?.lastUpdated && (
										<p className="text-sm text-muted-foreground">
											Last changed: {formatDate(device.lastUpdated)}
										</p>
									)}
								</>
							)}
						</CardContent>
						<CardFooter>
							<Button
								className="w-full"
								size="lg"
								variant={doorLocked ? 'default' : 'destructive'}
								onClick={toggleDoor}
								disabled={isLoadingDevice || isControlling}
							>
								{isControlling
									? 'Processing...'
									: doorLocked
									? 'Unlock Door'
									: 'Lock Door'}
							</Button>
						</CardFooter>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between">
							<div>
								<CardTitle>Access Logs</CardTitle>
								<CardDescription>History of door access events</CardDescription>
							</div>
							{isErrorLogs && (
								<Button
									variant="outline"
									size="sm"
									onClick={() => refetchLogs()}
									className="flex items-center gap-1"
								>
									<History className="h-4 w-4" />
									<span>Retry</span>
								</Button>
							)}
						</CardHeader>
						<CardContent>
							{isLoadingLogs ? (
								// Loading state
								<div className="flex flex-col items-center justify-center py-8 text-center">
									<div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
									<p className="text-lg font-medium">Loading access logs...</p>
								</div>
							) : isErrorLogs ? (
								// Error state
								<div className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 py-8 text-center">
									<AlertCircle className="mb-2 h-10 w-10 text-red-500" />
									<p className="mb-2 text-lg font-medium text-red-600">
										Failed to load access logs
									</p>
									<p className="mb-4 text-sm text-red-500">
										There was an error retrieving the access log data.
									</p>
								</div>
							) : accessLogs.length === 0 ? (
								// Empty state
								<div className="flex flex-col items-center justify-center py-8 text-center">
									<History className="mb-2 h-12 w-12 text-muted-foreground" />
									<p className="mb-2 text-lg font-medium">
										No access logs found
									</p>
									<p className="text-sm text-muted-foreground">
										Access events will appear here when someone uses the door.
									</p>
								</div>
							) : (
								// Data state
								<div className="rounded-lg border">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>User</TableHead>
												<TableHead>Method</TableHead>
												<TableHead>Timestamp</TableHead>
												<TableHead>Status</TableHead>
												<TableHead className="w-[50px]"></TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{accessLogs.map((log) => (
												<TableRow key={log._id}>
													<TableCell className="font-medium">
														{log.user.fullName}
													</TableCell>
													<TableCell>
														{log.accessMethod === 'pin'
															? 'PIN'
															: log.accessMethod === 'biometric'
															? 'Fingerprint'
															: log.accessMethod === 'mobile'
															? 'Mobile App'
															: 'Unknown'}
													</TableCell>
													<TableCell>{formatDate(log.createdAt)}</TableCell>
													<TableCell>
														<Badge
															variant={log.success ? 'outline' : 'destructive'}
															className={
																log.success ? 'bg-green-50 text-green-700' : ''
															}
														>
															{log.success ? 'Success' : 'Failed'}
														</Badge>
													</TableCell>
													<TableCell>
														<Button variant="ghost" size="icon">
															<MoreHorizontal className="h-4 w-4" />
															<span className="sr-only">More</span>
														</Button>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</>
	)
}

export default DoorPage

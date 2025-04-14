import Header from '@/components/Header'
import React, { useEffect, useState } from 'react'
import {
	Battery,
	Calendar,
	Clock,
	LockKeyhole,
	Signal,
	UnlockKeyhole,
	Wifi,
	AlertCircle,
	RefreshCw,
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
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import {
	useGetDashboardSummaryQuery,
	useControlDoorMutation,
	useRunDiagnosticsMutation,
} from '@/redux/api'
import { formatDate } from '@/lib/utils'

function DashboardPage() {
	const [currentDateTime, setCurrentDateTime] = useState(new Date())

	// Get dashboard data using RTK Query hook
	const {
		data: dashboardData,
		isLoading,
		isError,
		refetch,
	} = useGetDashboardSummaryQuery()

	// Door control mutation
	const [controlDoor, { isLoading: isControlling }] = useControlDoorMutation()

	// Diagnostics mutation
	const [runDiagnostics, { isLoading: isDiagnosticsRunning }] =
		useRunDiagnosticsMutation()

	// Extract data from the dashboard summary
	const doorLocked = dashboardData?.device?.lockState === 'locked'
	const batteryLevel = dashboardData?.device?.batteryLevel || 0
	const wifiStrength = dashboardData?.device?.wifiStrength || 0
	const deviceStatus = dashboardData?.device?.status || 'offline'
	const lastCheckIn = dashboardData?.device?.lastCheckIn
	const recentActivity = dashboardData?.recentLogs || []

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

	const toggleDoor = async () => {
		try {
			const action = doorLocked ? 'unlock' : 'lock'
			await controlDoor({ action }).unwrap()

			// Show success notification
			toast.success(action === 'unlock' ? 'Door Unlocked' : 'Door Locked', {
				description: `The door has been successfully ${
					action === 'unlock' ? 'unlocked' : 'locked'
				}.`,
			})

			// Refetch dashboard data
			refetch()
		} catch (error) {
			toast.error('Failed to control door', {
				description:
					error instanceof Error ? error.message : 'An error occurred',
			})
		}
	}

	const handleDiagnostics = async () => {
		try {
			await runDiagnostics().unwrap()

			toast.success('Diagnostics Completed', {
				description: 'System diagnostics completed successfully.',
			})

			// Refetch dashboard data to show updated values
			refetch()
		} catch (error) {
			toast.error('Diagnostics Failed', {
				description:
					error instanceof Error ? error.message : 'Failed to run diagnostics',
			})
		}
	}

	return (
		<>
			<Header page="Dashboard" />
			<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
				{' '}
				<div className="space-y-6">
					<div className="flex flex-col justify-between gap-4 md:flex-row">
						<div>
							<p className="text-muted-foreground">
								Welcome back, Admin. Here&apos;s an overview of your smart lock
								system.
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

					<div className="grid gap-6 md:grid-cols-2">
						<Card className="col-span-1">
							<CardHeader className="pb-2">
								<CardTitle className="flex items-center justify-between">
									<span>Door Status</span>
									{isLoading && (
										<RefreshCw
											size={18}
											className="animate-spin text-muted-foreground"
										/>
									)}
								</CardTitle>
								<CardDescription>
									Current status of your main door
								</CardDescription>
							</CardHeader>
							<CardContent className="flex flex-col items-center justify-center py-6">
								<div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full border-4 border-primary/20 bg-primary/10">
									{isLoading ? (
										<RefreshCw className="h-12 w-12 animate-spin text-muted-foreground" />
									) : doorLocked ? (
										<LockKeyhole className="h-12 w-12 text-primary" />
									) : (
										<UnlockKeyhole className="h-12 w-12 text-amber-500" />
									)}
								</div>
								<h3 className="text-2xl font-bold">
									{isLoading
										? 'Loading...'
										: doorLocked
										? 'Locked'
										: 'Unlocked'}
								</h3>
								{/* <p className="text-sm text-muted-foreground">
									{dashboardData?.device?.lastUpdated
										? `Last changed: ${formatDate(
												dashboardData.device.lastUpdated
										  )}`
										: 'Status unavailable'}
								</p> */}
							</CardContent>
							<CardFooter>
								<Button
									className="w-full"
									variant={doorLocked ? 'default' : 'destructive'}
									onClick={toggleDoor}
									disabled={isLoading || isControlling}
								>
									{isControlling
										? 'Processing...'
										: doorLocked
										? 'Unlock Door'
										: 'Lock Door'}
								</Button>
							</CardFooter>
						</Card>

						<Card className="col-span-1">
							<CardHeader className="pb-2">
								<CardTitle className="flex items-center justify-between">
									<span>System Status</span>
									{isLoading && (
										<RefreshCw
											size={18}
											className="animate-spin text-muted-foreground"
										/>
									)}
								</CardTitle>
								<CardDescription>Health and connectivity</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<Battery className="h-4 w-4 text-muted-foreground" />
											<span className="text-sm font-medium">Battery</span>
										</div>
										<span className="text-sm">{batteryLevel}%</span>
									</div>
									<Progress value={batteryLevel} className="h-2" />
								</div>

								<div className="rounded-lg border p-3">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<Signal
												className={
													deviceStatus === 'online'
														? 'h-4 w-4 text-green-500'
														: 'h-4 w-4 text-red-500'
												}
											/>
											<span className="text-sm font-medium">Device Status</span>
										</div>
										<Badge
											variant="outline"
											className={
												deviceStatus === 'online'
													? 'bg-green-50 text-green-700'
													: 'bg-red-50 text-red-700'
											}
										>
											{deviceStatus === 'online' ? 'Online' : 'Offline'}
										</Badge>
									</div>
									<div className="mt-2 text-xs text-muted-foreground">
										{lastCheckIn
											? `Last check-in: ${formatDate(lastCheckIn)}`
											: 'No recent check-in'}
									</div>
								</div>
							</CardContent>
							<CardFooter>
								<Button
									variant="outline"
									className="w-full"
									onClick={handleDiagnostics}
									// disabled={isLoading || isDiagnosticsRunning}
									disabled
								>
									{isDiagnosticsRunning ? (
										<>
											<RefreshCw className="mr-2 h-4 w-4 animate-spin" />
											Running...
										</>
									) : (
										'Run Diagnostics'
									)}
								</Button>
							</CardFooter>
						</Card>
					</div>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center justify-between">
								<span>Recent Activity</span>
								{isLoading && (
									<RefreshCw
										size={18}
										className="animate-spin text-muted-foreground"
									/>
								)}
							</CardTitle>
							<CardDescription>
								Latest events from your smart lock
							</CardDescription>
						</CardHeader>
						<CardContent>
							{isLoading ? (
								<div className="flex flex-col items-center justify-center py-8 text-center">
									<div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
									<p className="mt-4 text-lg font-medium">
										Loading activity data...
									</p>
								</div>
							) : isError ? (
								<div className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 py-8 text-center">
									<AlertCircle className="h-12 w-12 text-red-500" />
									<p className="mt-4 mb-2 text-lg font-medium text-red-600">
										Failed to load activity data
									</p>
									<Button
										variant="outline"
										size="sm"
										onClick={() => refetch()}
										className="mt-2"
									>
										<RefreshCw className="mr-2 h-4 w-4" />
										Retry
									</Button>
								</div>
							) : recentActivity.length === 0 ? (
								<div className="flex flex-col items-center justify-center py-8 text-center">
									<p className="text-lg font-medium">
										No recent activity found
									</p>
									<p className="mt-2 text-sm text-muted-foreground">
										Activity will appear here when someone uses the door.
									</p>
								</div>
							) : (
								<div className="rounded-lg border">
									<div className="flex flex-col divide-y">
										{recentActivity.map((activity) => (
											<div
												key={activity._id}
												className="flex items-center justify-between p-4"
											>
												<div className="flex items-center gap-4">
													<div
														className={`rounded-full p-2 ${
															activity.success ? 'bg-green-100' : 'bg-red-100'
														}`}
													>
														{activity.success ? (
															<UnlockKeyhole className="h-5 w-5 text-green-600" />
														) : (
															<LockKeyhole className="h-5 w-5 text-red-600" />
														)}
													</div>
													<div>
														<p className="font-medium">
															{activity.user?.fullName || 'Unknown User'}
														</p>
														<p className="text-sm text-muted-foreground">
															{activity.action || 'Access attempt'} via{' '}
															{activity.accessMethod === 'pin'
																? 'PIN'
																: activity.accessMethod === 'biometric'
																? 'Fingerprint'
																: activity.accessMethod === 'mobile'
																? 'Mobile App'
																: activity.accessMethod === 'web'
																? 'Web Dashboard'
																: 'Unknown'}
														</p>
													</div>
												</div>
												<div className="text-right">
													<p className="text-sm">
														{formatDate(activity.createdAt)}
													</p>
													<Badge
														variant={
															activity.success ? 'outline' : 'destructive'
														}
														className={
															activity.success
																? 'mt-1 bg-green-50 text-green-700'
																: 'mt-1'
														}
													>
														{activity.success ? 'Successful' : 'Failed'}
													</Badge>
												</div>
											</div>
										))}
									</div>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</>
	)
}

export default DashboardPage

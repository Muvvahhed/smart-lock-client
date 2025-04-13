import React from 'react'
import {
	useRouteError,
	isRouteErrorResponse,
	useNavigate,
} from 'react-router-dom'
import { Button } from './ui/button'
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react'

export function ErrorBoundary() {
	const error = useRouteError()
	const navigate = useNavigate()

	let errorMessage = 'Something went wrong'
	let statusCode = 500

	if (isRouteErrorResponse(error)) {
		errorMessage = error.data?.message || error.statusText
		statusCode = error.status
	} else if (error instanceof Error) {
		errorMessage = error.message
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
			<div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg border shadow-lg">
				<div className="flex flex-col items-center space-y-4 text-center">
					<div className="p-3 bg-destructive/10 rounded-full">
						<AlertTriangle size={32} className="text-destructive" />
					</div>
					<h2 className="text-3xl font-bold tracking-tight">
						Error {statusCode}
					</h2>
					<p className="text-muted-foreground">{errorMessage}</p>
				</div>
				<div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0 justify-center">
					<Button
						onClick={() => window.location.reload()}
						variant="outline"
						className="flex items-center gap-2"
					>
						<RefreshCcw size={16} /> Retry
					</Button>
					<Button
						onClick={() => navigate('/')}
						className="flex items-center gap-2"
					>
						<Home size={16} /> Go Home
					</Button>
				</div>
			</div>
		</div>
	)
}

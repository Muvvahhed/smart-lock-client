import { Button } from '@/components/ui/button'
import { Home, ArrowLeft, Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function NotFoundPage() {
	const navigate = useNavigate()

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
			<div className="w-full max-w-md space-y-8 text-center">
				<div className="flex flex-col items-center">
					<div className="flex justify-center">
						<Lock className="h-12 w-12 text-primary" />
					</div>
					<h1 className="text-9xl font-extrabold tracking-tighter text-primary">
						404
					</h1>
				</div>

				<div className="space-y-6">
					<div className="space-y-2">
						<h2 className="text-3xl font-bold tracking-tight">
							Page not found
						</h2>
						<p className="text-muted-foreground">
							We couldn't find the page you're looking for.
						</p>
					</div>

					<div className="bg-card p-4 rounded-lg border shadow-sm">
						<div className="flex flex-col sm:flex-row gap-2 justify-center">
							<Button
								onClick={() => navigate(-1)}
								variant="outline"
								className="flex items-center gap-2"
							>
								<ArrowLeft size={16} /> Go Back
							</Button>
							<Button
								onClick={() => navigate('/')}
								className="flex items-center gap-2"
							>
								<Home size={16} /> Return Home
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default NotFoundPage

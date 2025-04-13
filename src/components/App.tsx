import { router } from '@/routes'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from './ui/sonner'

function App() {
	return (
		<>
			<RouterProvider router={router} />
			<Toaster
				toastOptions={{
					classNames: {
						error: '!bg-red-500 !border-red-500',
						info: '!bg-blue-400',
						success: '!bg-green-500 !border-green-500',
						warning: '!bg-orange-400 !border-orange-400 !text-white',
						toast: 'bg-blue-400',
						title: 'text-lg',
						description: 'text-red-400',
						actionButton: 'bg-zinc-400',
						cancelButton: 'bg-orange-400',
						closeButton: 'bg-lime-400',
					},
				}}
			/>
		</>
	)
}

export default App

import { createBrowserRouter } from 'react-router-dom'
import NotFoundPage from './pages/NotFound'
import { ErrorBoundary } from './components/ErrorBoundary'
export const router = createBrowserRouter([
	{
		path: '/',
		element: <div>Home Page</div>,
		errorElement: <ErrorBoundary />,
	},

	{
		path: '*',
		element: <NotFoundPage />,
	},
])

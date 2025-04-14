import { createBrowserRouter } from 'react-router-dom'
import NotFoundPage from './pages/NotFound'
import { ErrorBoundary } from './components/ErrorBoundary'
import LoginPage from './pages/auth/LoginPage'
import HomeLayout from './layouts/HomeLayout'
import DashboardPage from './pages/dashboard/DashboardPage'
export const router = createBrowserRouter([
	{
		path: '/',
		element: <HomeLayout />,
		children: [
			{
				path: '',
				element: <DashboardPage />,
			},
		],
		errorElement: <ErrorBoundary />,
	},
	{
		path: '/login',
		element: <LoginPage />,
		errorElement: <ErrorBoundary />,
	},

	{
		path: '*',
		element: <NotFoundPage />,
		errorElement: <ErrorBoundary />,
	},
])

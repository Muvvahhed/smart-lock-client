import { createBrowserRouter } from 'react-router-dom'
import NotFoundPage from './pages/NotFound'
import { ErrorBoundary } from './components/ErrorBoundary'
import LoginPage from './pages/auth/LoginPage'
import HomeLayout from './layouts/HomeLayout'
import DashboardPage from './pages/dashboard/DashboardPage'
import UsersPage from './pages/users/UsersPage'
import DoorPage from './pages/door/DoorPage'
import SettingsPage from './pages/Settings'
export const router = createBrowserRouter([
	{
		path: '/',
		element: <HomeLayout />,
		children: [
			{
				path: '',
				element: <DashboardPage />,
			},
			{
				path: '/users',
				element: <UsersPage />,
			},
			{
				path: '/door',
				element: <DoorPage />,
			},
			{
				path: '/settings',
				element: <SettingsPage />,
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

import { AppSidebar } from '@/components/AppSidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { useAppSelector } from '@/redux/hook'
import { Navigate, Outlet } from 'react-router-dom'

function HomeLayout() {
	const user = useAppSelector((state) => state.auth.user)
	if (!user) return <Navigate to="/login" />
	return (
		<SidebarProvider>
			<AppSidebar user={user} />
			<SidebarInset>
				<Outlet />
			</SidebarInset>
		</SidebarProvider>
	)
}

export default HomeLayout

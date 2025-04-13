import { AppSidebar } from '@/components/AppSidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { TUser } from '@/global'
import { useAppSelector } from '@/redux/hook'
import { Navigate, Outlet } from 'react-router-dom'

function HomeLayout({ role }: { role: TUser['role'] }) {
	const user = useAppSelector((state) => state.auth.user)
	if (!user) return <Navigate to="/login" />
	if (user.role !== role) return <Navigate to="/unauthorized" />
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

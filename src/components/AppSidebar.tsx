import * as React from 'react'
import {
	BarChart4,
	DoorClosed,
	LayoutDashboard,
	Lock,
	Settings,
	Users,
} from 'lucide-react'

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar'
import { NavMain } from './nav/NavMain'
import { NavUser } from './nav/NavUser'
import { Link } from 'react-router-dom'

import { TUser } from '@/global'

const navMain = [
	{ icon: LayoutDashboard, title: 'Dashboard', url: '/' },
	{ icon: Users, title: 'Manage Users', url: '/users' },
	{ icon: DoorClosed, title: 'Door Control', url: '/door' },
	// { icon: BarChart4, title: 'Analytics', url: '/analytics' },
	{ icon: Settings, title: 'Settings', url: '/settings' },
]

export function AppSidebar({
	user,
	...props
}: React.ComponentProps<typeof Sidebar> & { user: TUser }) {
	return (
		<Sidebar variant="inset" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link to="/">
								<Lock className="text-xl text-primary" />
								<div className="grid flex-1 text-left text-xl leading-tight">
									<span className="truncate font-semibold text-primary">
										Smart Lock
									</span>
								</div>
								<div>
									<span className="bg-blue-700/10 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
										ADMIN
									</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={navMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={user} />
			</SidebarFooter>
		</Sidebar>
	)
}

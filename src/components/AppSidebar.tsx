import * as React from 'react'
import {
	BookOpen,
	Calendar,
	LayoutDashboard,
	MessageSquare,
	Settings,
	UserCog,
	UserPlus,
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
import logo from '../assets/logo.webp'

import { TUser } from '@/global'

const navMain = {
	admin: [
		{ icon: LayoutDashboard, title: 'Dashboard', url: '/admin' },
		{ icon: Users, title: 'Manage Students', url: '/admin/students' },
		{ icon: UserCog, title: 'Manage Lecturers', url: '/admin/lecturers' },
		{ icon: Settings, title: 'Settings', url: '/admin/settings' },
	],
	lecturer: [
		{
			title: 'Dashboard',
			icon: LayoutDashboard,
			url: '/lecturer',
		},
		{
			title: 'Manage Courses',
			icon: BookOpen,
			url: '/lecturer/courses',
		},
		{
			title: 'Enroll Students',
			icon: UserPlus,
			url: '/lecturer/enroll',
		},
		{
			title: 'Take Attendance',
			icon: Calendar,
			url: '/lecturer/attendance/take',
		},
		{
			title: 'Student Records',
			icon: Users,
			url: '/lecturer/students',
		},
		{
			title: 'Chat',
			icon: MessageSquare,
			url: '/lecturer/chat',
		},
		{
			title: 'Settings',
			icon: Settings,
			url: '/lecturer/settings',
		},
	],
	student: [
		{
			title: 'Dashboard',
			icon: LayoutDashboard,
			url: '/student',
		},
		{
			title: 'Courses',
			icon: BookOpen,
			url: '/student/courses',
		},
		{
			title: 'Attendance Records',
			icon: Calendar,
			url: '/student/attendance',
		},
		{
			title: 'Chat',
			icon: MessageSquare,
			url: '/student/chat',
		},
		{
			title: 'Settings',
			icon: Settings,
			url: '/student/settings',
		},
	],
}

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
								<img src={logo} alt="AttendX Logo" className="h-7 w-7" />
								<div className="grid flex-1 text-left text-xl leading-tight">
									<span className="truncate font-semibold text-primary">
										AttendX
									</span>
								</div>
								<div>
									{user.role === 'student' ? (
										<span className="bg-purple-500/10 text-purple-500 text-xs font-semibold px-2 py-1 rounded">
											STUDENT
										</span>
									) : user.role === 'lecturer' ? (
										<span className="bg-cyan-500/10 text-cyan-500 text-xs font-semibold px-2 py-1 rounded">
											LECTURER
										</span>
									) : (
										<span className="bg-blue-700/10 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
											ADMIN
										</span>
									)}
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={navMain[user.role]} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={user} />
			</SidebarFooter>
		</Sidebar>
	)
}

import { Bell, ChevronsUpDown, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Avatar from 'react-avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar'
import { TUser } from '@/global'
import { useAppDispatch } from '@/redux/hook'
import { logout } from '@/redux/slices/authSlice'
import { toast } from 'sonner'

export function NavUser({ user }: { user: TUser }) {
	const { isMobile } = useSidebar()
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const fullName = user.fullName

	const handleLogout = () => {
		dispatch(logout())
		toast.success('You have been logged out successfully')
		navigate('/login')
	}

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar name={fullName} size="36" round="8px" />
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold lowercase">
									{user.email}
								</span>
								<span className="truncate text-xs capitalize">{fullName}</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						side={isMobile ? 'bottom' : 'right'}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar name={fullName} size="36" round="8px" />
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold lowercase">
										{user.email}
									</span>
									<span className="truncate text-xs capitalize">
										{fullName}
									</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />

						<DropdownMenuGroup>
							<DropdownMenuItem>
								<Bell />
								Notifications
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
							<LogOut />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}

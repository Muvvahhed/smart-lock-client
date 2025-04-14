import Header from '@/components/Header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import {
	Check,
	Fingerprint,
	MoreHorizontal,
	Plus,
	Search,
	Trash,
	UserCog,
	X,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ClipLoader } from 'react-spinners'
import {
	useGetUsersQuery,
	useCreateUserMutation,
	useDeleteUserMutation,
	useEnrollBiometricMutation,
} from '@/redux/api'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { formatDate } from '@/lib/utils'

// Define schema for creating a new user
const addUserSchema = z.object({
	fullName: z.string().min(2, 'Name must be at least 2 characters'),
	email: z.string().email('Invalid email address'),
	pincode: z
		.string()
		.min(4, 'PIN must be at least 4 digits')
		.max(6, 'PIN cannot exceed 6 digits'),
})

interface ApiError {
	status?: number
	data?: {
		message?: string
		[key: string]: unknown
	}
	message?: string
}

type AddUserFormValues = z.infer<typeof addUserSchema>

function UsersPage() {
	const [searchQuery, setSearchQuery] = useState('')
	const [showAddUserDialog, setShowAddUserDialog] = useState(false)
	const [showEnrollDialog, setShowEnrollDialog] = useState(false)
	const [selectedUser, setSelectedUser] = useState<string | null>(null)
	const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
	const [showDeleteDialog, setShowDeleteDialog] = useState(false)

	// API Queries and Mutations
	const { data: users = [], isLoading, refetch } = useGetUsersQuery({})
	const [createUser, { isLoading: isCreating }] = useCreateUserMutation()
	const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation()
	const [enrollBiometric, { isLoading: isEnrolling }] =
		useEnrollBiometricMutation()

	// Form setup for adding new users
	const form = useForm<AddUserFormValues>({
		resolver: zodResolver(addUserSchema),
		defaultValues: {
			fullName: '',
			email: '',
			pincode: '',
		},
	})

	const filteredUsers = users.filter(
		(user) =>
			user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			user.role?.toLowerCase().includes(searchQuery.toLowerCase())
	)

	const handleEnrollBiometric = (userId: string) => {
		setSelectedUser(userId)
		setShowEnrollDialog(true)
	}

	const startEnrollment = async () => {
		if (!selectedUser) return

		try {
			await enrollBiometric(selectedUser).unwrap()
			toast.success('Biometric enrollment started')
			refetch()
			setShowEnrollDialog(false)
		} catch (error: unknown) {
			const apiError = error as ApiError
			toast.error('Enrollment failed', {
				description:
					apiError.data?.message || 'An error occurred during enrollment',
			})
		}
	}

	const confirmDeleteUser = (userId: string) => {
		setConfirmDelete(userId)
		setShowDeleteDialog(true)
	}

	const handleDeleteUser = async () => {
		if (!confirmDelete) return

		try {
			await deleteUser(confirmDelete).unwrap()
			toast.success('User deleted successfully')
			setShowDeleteDialog(false)
			setConfirmDelete(null)
			refetch()
		} catch (error: unknown) {
			const apiError = error as ApiError
			toast.error('Failed to delete user', {
				description:
					apiError.data?.message || 'An error occurred while deleting the user',
			})
		}
	}

	const onSubmit = async (data: AddUserFormValues) => {
		try {
			await createUser(data).unwrap()
			toast.success('User created successfully')
			form.reset()
			setShowAddUserDialog(false)
			refetch()
		} catch (error: unknown) {
			const apiError = error as ApiError
			toast.error('Failed to create user', {
				description:
					apiError.data?.message || 'An error occurred while creating the user',
			})
		}
	}

	return (
		<>
			<Header page="Manage Users" />
			<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
				{' '}
				<div className="space-y-6">
					<div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
						<div>
							<p className="text-muted-foreground">
								Manage users, roles, and biometric access
							</p>
						</div>
						<Button onClick={() => setShowAddUserDialog(true)}>
							<Plus className="mr-2 h-4 w-4" />
							Add New User
						</Button>
					</div>

					<Card>
						<CardHeader className="pb-3">
							<div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
								<div>
									<CardTitle>Users</CardTitle>
									<CardDescription>
										Manage user accounts and access permissions
									</CardDescription>
								</div>
								<div className="relative w-full md:w-64">
									<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
									<Input
										type="search"
										placeholder="Search users..."
										className="pl-8"
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
									/>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<div className="rounded-md border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Name</TableHead>
											<TableHead>Email</TableHead>
											<TableHead>Role</TableHead>
											<TableHead>PIN</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>Last Login</TableHead>
											<TableHead>Biometric</TableHead>
											<TableHead className="w-[100px]">Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{isLoading ? (
											<TableRow>
												<TableCell colSpan={8} className="h-24 text-center">
													<ClipLoader size={30} />
												</TableCell>
											</TableRow>
										) : filteredUsers.length === 0 ? (
											<TableRow>
												<TableCell colSpan={8} className="h-24 text-center">
													No users found.
												</TableCell>
											</TableRow>
										) : (
											filteredUsers.map((user) => (
												<TableRow key={user._id}>
													<TableCell className="font-medium">
														{user.fullName}
													</TableCell>
													<TableCell>{user.email}</TableCell>
													<TableCell>
														<Badge
															variant={
																user.role === 'admin' ? 'default' : 'secondary'
															}
														>
															{user.role}
														</Badge>
													</TableCell>
													<TableCell>{user.pin || 'N/A'}</TableCell>
													<TableCell>
														<Badge
															variant={
																user.isActive ? 'outline' : 'destructive'
															}
															className={
																user.isActive
																	? 'bg-green-50 text-green-700'
																	: ''
															}
														>
															{user.isActive ? 'Active' : 'Inactive'}
														</Badge>
													</TableCell>
													<TableCell>
														{user.lastLogin
															? formatDate(user.lastLogin)
															: 'Never'}
													</TableCell>
													<TableCell>
														{user.biometricEnrolled ? (
															<Badge
																variant="outline"
																className="bg-blue-50 text-blue-700"
															>
																<Check className="mr-1 h-3 w-3" /> Enrolled
															</Badge>
														) : (
															<Badge
																variant="outline"
																className="bg-amber-50 text-amber-700"
															>
																<X className="mr-1 h-3 w-3" /> Not Enrolled
															</Badge>
														)}
													</TableCell>
													<TableCell>
														<DropdownMenu>
															<DropdownMenuTrigger asChild>
																<Button variant="ghost" size="icon">
																	<MoreHorizontal className="h-4 w-4" />
																	<span className="sr-only">Open menu</span>
																</Button>
															</DropdownMenuTrigger>
															<DropdownMenuContent align="end">
																<DropdownMenuLabel>Actions</DropdownMenuLabel>
																<DropdownMenuSeparator />
																<DropdownMenuItem>
																	<UserCog className="mr-2 h-4 w-4" />
																	Edit User
																</DropdownMenuItem>
																<DropdownMenuItem
																	onClick={() =>
																		handleEnrollBiometric(user._id)
																	}
																>
																	<Fingerprint className="mr-2 h-4 w-4" />
																	{user.biometricEnrolled
																		? 'Update Biometric'
																		: 'Enroll Biometric'}
																</DropdownMenuItem>
																{user.role !== 'admin' && (
																	<>
																		<DropdownMenuSeparator />

																		<DropdownMenuItem
																			className="text-red-600"
																			onClick={() =>
																				confirmDeleteUser(user._id)
																			}
																		>
																			<Trash className="mr-2 h-4 w-4" />
																			Delete User
																		</DropdownMenuItem>
																	</>
																)}
															</DropdownMenuContent>
														</DropdownMenu>
													</TableCell>
												</TableRow>
											))
										)}
									</TableBody>
								</Table>
							</div>
						</CardContent>
					</Card>

					{/* Add User Dialog */}
					<Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
						<DialogContent className="sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>Add New User</DialogTitle>
								<DialogDescription>
									Create a new user account with access to the smart lock
									system.
								</DialogDescription>
							</DialogHeader>
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-4"
								>
									<FormField
										control={form.control}
										name="fullName"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Name</FormLabel>
												<FormControl>
													<Input placeholder="Full Name" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input
														type="email"
														placeholder="Email Address"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="pincode"
										render={({ field }) => (
											<FormItem>
												<FormLabel>PIN Code</FormLabel>
												<FormControl>
													<Input
														type="password"
														placeholder="4-6 digit PIN"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<DialogFooter>
										<Button
											variant="outline"
											type="button"
											onClick={() => setShowAddUserDialog(false)}
										>
											Cancel
										</Button>
										<Button type="submit" disabled={isCreating}>
											{isCreating ? (
												<ClipLoader size={20} color="#fff" />
											) : (
												'Create User'
											)}
										</Button>
									</DialogFooter>
								</form>
							</Form>
						</DialogContent>
					</Dialog>

					{/* Biometric Enrollment Dialog */}
					<Dialog open={showEnrollDialog} onOpenChange={setShowEnrollDialog}>
						<DialogContent className="sm:max-w-[500px]">
							<DialogHeader>
								<DialogTitle>Biometric Enrollment</DialogTitle>
								<DialogDescription>
									Follow the steps to enroll or update biometric data for this
									user.
								</DialogDescription>
							</DialogHeader>
							<div className="space-y-6 py-4">
								<div className="flex items-center justify-center">
									<div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
										<Fingerprint className="h-12 w-12 text-primary" />
									</div>
								</div>

								<div className="space-y-2 rounded-lg border p-4">
									<div className="flex items-center justify-between">
										<h3 className="font-medium">Fingerprint Scanner</h3>
										<Badge
											variant="outline"
											className="bg-green-50 text-green-700"
										>
											Connected
										</Badge>
									</div>
									<p className="text-sm text-muted-foreground">
										Place the user's finger on the scanner when prompted
									</p>
								</div>

								<div className="space-y-4">
									<h3 className="font-medium">Enrollment Steps:</h3>
									<div className="space-y-2">
										<div className="flex items-center gap-2">
											<div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
												1
											</div>
											<span className="text-sm">
												Connect fingerprint scanner
											</span>
										</div>
										<div className="flex items-center gap-2">
											<div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
												2
											</div>
											<span className="text-sm">
												Place finger on scanner (2 scans required)
											</span>
										</div>
										<div className="flex items-center gap-2">
											<div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
												3
											</div>
											<span className="text-sm">Verify enrollment</span>
										</div>
										<div className="flex items-center gap-2">
											<div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
												4
											</div>
											<span className="text-sm">Save to system</span>
										</div>
									</div>
								</div>
							</div>
							<DialogFooter>
								<Button
									variant="outline"
									onClick={() => setShowEnrollDialog(false)}
								>
									Cancel
								</Button>
								<Button onClick={startEnrollment} disabled={isEnrolling}>
									{isEnrolling ? (
										<ClipLoader size={20} color="#fff" />
									) : (
										'Start Enrollment'
									)}
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>

					{/* Delete User Confirmation Dialog */}
					<Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
						<DialogContent className="sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>Confirm Deletion</DialogTitle>
								<DialogDescription>
									Are you sure you want to delete this user? This action cannot
									be undone.
								</DialogDescription>
							</DialogHeader>
							<DialogFooter>
								<Button
									variant="outline"
									onClick={() => setShowDeleteDialog(false)}
								>
									Cancel
								</Button>
								<Button
									variant="destructive"
									onClick={handleDeleteUser}
									disabled={isDeleting}
								>
									{isDeleting ? (
										<ClipLoader size={20} color="#fff" />
									) : (
										'Delete User'
									)}
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			</div>
		</>
	)
}

export default UsersPage

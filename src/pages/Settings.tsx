import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { ClipLoader } from 'react-spinners'
import { useChangePasswordMutation } from '@/redux/api'

// Define form schema with Zod
const passwordFormSchema = z
	.object({
		currentPassword: z.string().min(4, {
			message: 'Password must be at least 4 characters.',
		}),
		newPassword: z.string().min(4, {
			message: 'Password must be at least 4 characters.',
		}),
		confirmPassword: z.string().min(4, {
			message: 'Password must be at least 4 characters.',
		}),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	})

function SettingsPage() {
	const [changePassword, { isLoading }] = useChangePasswordMutation()

	// Initialize form with React Hook Form
	const form = useForm<z.infer<typeof passwordFormSchema>>({
		resolver: zodResolver(passwordFormSchema),
		defaultValues: {
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
		},
	})

	// Handle form submission
	function onSubmit(values: z.infer<typeof passwordFormSchema>) {
		changePassword({
			currentPassword: values.currentPassword,
			newPassword: values.newPassword,
		})
			.unwrap()
			.then(() => {
				toast.success('Password updated successfully!', {
					closeButton: true,
				})
				form.reset()
			})
			.catch((error) => {
				if (error?.status === 400) {
					toast.error('Current password is incorrect', {
						closeButton: true,
					})
					return
				}
				toast.error('Something went wrong. Please try again later.', {
					closeButton: true,
				})
			})
	}

	return (
		<>
			<Header page="Settings" />
			<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
				<div className="space-y-6 lg:w-1/2">
					<Card>
						<CardHeader>
							<CardTitle>Change Password</CardTitle>
							<CardDescription>
								Update your account password here.
							</CardDescription>
						</CardHeader>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)}>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="currentPassword"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Current Password</FormLabel>
												<FormControl>
													<Input type="password" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="newPassword"
										render={({ field }) => (
											<FormItem>
												<FormLabel>New Password</FormLabel>
												<FormControl>
													<Input type="password" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="confirmPassword"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Confirm New Password</FormLabel>
												<FormControl>
													<Input type="password" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
								<CardFooter>
									<Button type="submit" disabled={isLoading}>
										{isLoading ? <ClipLoader size={20} /> : 'Update Password'}
									</Button>
								</CardFooter>
							</form>
						</Form>
					</Card>
				</div>
			</div>
		</>
	)
}

export default SettingsPage

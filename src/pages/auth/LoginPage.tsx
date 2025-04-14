import { Eye, EyeOff, Lock } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ClipLoader } from 'react-spinners'

import { Button } from '@/components/ui/button'
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
import { Input } from '@/components/ui/input'
import { useLoginMutation } from '@/redux/api'
import { useAppDispatch } from '@/redux/hook'
import { setCredentials } from '@/redux/slices/authSlice'
import { toast } from 'sonner'

const loginSchema = z.object({
	email: z.string().email('Invalid email address'),
	deviceId: z.string().min(1, 'Device ID is required'),
	password: z.string().min(4, 'Password must be at least 4 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const [showPassword, setShowPassword] = useState(false)
	const [login, { isLoading }] = useLoginMutation()

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			deviceId: '',
			password: '',
		},
	})

	const onSubmit = async (data: LoginFormValues) => {
		await login(data)
			.unwrap()
			.then((result) => {
				dispatch(setCredentials(result))
				toast.success('Login successful')
				navigate('/')
			})
			.catch((error) => {
				toast.error('Login failed', {
					description:
						error.data?.message ||
						'Please check your credentials and try again.',
					closeButton: true,
				})
			})
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
			<Card className="mx-auto w-full max-w-md">
				<CardHeader className="space-y-1 text-center">
					<div className="flex justify-center">
						<Lock className="h-12 w-12 text-primary" />
					</div>
					<CardTitle className="text-2xl font-bold">Smart Lock Admin</CardTitle>
					<CardDescription>
						Enter your credentials to access the dashboard
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input placeholder="admin@smartlock.com" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="deviceId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Device ID</FormLabel>
										<FormControl>
											<Input placeholder="SL-PRO-X1-12345" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													type={showPassword ? 'text' : 'password'}
													placeholder="••••••••"
													{...field}
												/>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
													onClick={() => setShowPassword(!showPassword)}
												>
													{showPassword ? (
														<EyeOff className="h-4 w-4" />
													) : (
														<Eye className="h-4 w-4" />
													)}
													<span className="sr-only">
														{showPassword ? 'Hide password' : 'Show password'}
													</span>
												</Button>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit" className="w-full">
								{isLoading ? <ClipLoader size={20} color="#fff" /> : 'Login'}
							</Button>
						</form>
					</Form>
				</CardContent>
				<CardFooter className="text-center text-sm text-muted-foreground">
					<p className="w-full">
						Secure access to your Smart Lock administration panel
					</p>
				</CardFooter>
			</Card>
		</div>
	)
}

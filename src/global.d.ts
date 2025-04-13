export type TUser = {
	_id: string
	firstName: string
	lastName: string
	username: string
	role: 'admin' | 'lecturer' | 'student'
	chatHistory: TChat[]
}

export type TStudent = {
	_id: string
	regNo: string
	fingerprintId: string
	isFingerprintRegistered: boolean
	enrolledCourses: TCourse[]
	user: TUser
}

export type Attendance = {
	_id: string
	course: TCourse
	recordedDate: string
	student: TStudent
	attendanceSheet: string
	checkInTime?: string
	recordMethod: 'manual' | 'biometric'
}

export type AttendanceSheet = {
	_id: string
	course: TCourse
	sessionDate: string
	isCompleted: boolean
	attendanceRecords: Attendance[]
}

export type Course = {
	_id: string
	code: string
	name: string
	attendance: { student: TStudent; daysPresent: number }[]
	examAttendance: { student: TStudent; signIn: boolean; signOut: boolean }[]
	signIn: boolean
	signout: boolean
}
export type TCourse = {
	_id: string
	courseCode: string
	courseTitle: string
	students: TStudent[]
	attendanceMode: boolean
}

export type TAttendance = {
	_id: string
	students: TStudent[]
	course: TCourse
	completed: boolean
	createdAt: string
}

export type TChat = {
	_id: string
	sender: TUser
	receiver: TUser
	message: string
	read: boolean
	timestamp: string
	createdAt: string
}

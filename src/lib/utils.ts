import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

/**
 * Formats a date as DD-MM-YYYY HH:MM AM/PM
 * If the date is today or yesterday, it shows "Today" or "Yesterday" instead of the date
 *
 * @param date - Date to format (Date object or timestamp string/number)
 * @returns Formatted date string
 */
export function formatDate(date: Date | string | number): string {
	const dateObj = date instanceof Date ? date : new Date(date)

	if (isNaN(dateObj.getTime())) {
		return 'Invalid date'
	}

	// Get today and yesterday dates for comparison
	const today = new Date()
	today.setHours(0, 0, 0, 0)

	const yesterday = new Date(today)
	yesterday.setDate(yesterday.getDate() - 1)

	// Format time part (HH:MM AM/PM)
	const hours = dateObj.getHours()
	const minutes = dateObj.getMinutes()
	const ampm = hours >= 12 ? 'PM' : 'AM'
	const formattedHours = hours % 12 || 12 // Convert to 12-hour format (0 -> 12)
	const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes
	const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`

	// Check if date is today or yesterday
	const dateWithoutTime = new Date(dateObj)
	dateWithoutTime.setHours(0, 0, 0, 0)

	if (dateWithoutTime.getTime() === today.getTime()) {
		return `Today, ${timeString}`
	}

	if (dateWithoutTime.getTime() === yesterday.getTime()) {
		return `Yesterday, ${timeString}`
	}

	// Format date part (DD-MM-YYYY)
	const day = dateObj.getDate().toString().padStart(2, '0')
	const month = (dateObj.getMonth() + 1).toString().padStart(2, '0') // Month is 0-based
	const year = dateObj.getFullYear()

	return `${day}-${month}-${year}, ${timeString}`
}

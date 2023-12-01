import { type Day, type Month } from '../stores/models/calendar.model';

export const Months = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
];

export const Days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const weekdays: Day[] = Days.map((d, id) => ({
	id,
	prefix: d.slice(0, 1),
	name: d,
	type: 'Day'
}));

export const months: Month[] = Months.map((month, index) => ({
	id: index,
	prefix: month.slice(0, 3),
	name: month,
	type: 'Month'
}));

export const getDaysInMonth = (year: number, month: number): Date[][] => {
	const date = new Date(year, month, 1);
	const days: Date[][] = [];
	let tempList: Date[] = Array.from({ length: date.getDay() });

	while (date.getMonth() === month) {
		tempList.push(new Date(date));

		if (tempList.length === 7) {
			days.push(tempList);
			tempList = [];
		}

		date.setDate(date.getDate() + 1);
	}

	if (tempList.length > 0) {
		days.push(tempList);
	}

	return days;
};

export const getWeekDates = (year: number, month: number, weekNumber: number): Date[] => {
	const firstDayOfMonth: Date = new Date(year, month, 1);
	const firstDayOfWeek: Date = new Date(year, month, 1 - firstDayOfMonth.getDay());

	if (firstDayOfWeek.getMonth() !== month) {
		firstDayOfWeek.setDate(firstDayOfWeek.getDate() + 7); // Move to the next week
	}

	const targetDate: Date = new Date(firstDayOfWeek.getTime());
	const startDate: Date = new Date(year, 0, 1);
	const days: number = Math.floor((targetDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
	const weekNum: number = Math.ceil(days / 7);
	targetDate.setDate(firstDayOfWeek.getDate() + 7 * (weekNumber - weekNum - 1));

	const weekDates: Date[] = [];
	for (let i = 0; i < 7; i++) {
		const date: Date = new Date(targetDate);
		date.setDate(targetDate.getDate() + i);
		weekDates.push(date);
	}

	return weekDates;
};

export const getWeekNumber = (date: Date): number => {
	const startDate = new Date(date.getFullYear(), 0, 1);
	const days = Math.floor((date.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
	return Math.ceil(days / 7);
};

// unused
const getDateDetails = (date: Date): { year: number; month: number; date: number } => {
	const year = date.getFullYear();
	const monthId = date.getMonth();
	const dateObj = date.getDate();
	const month = Months[monthId];

	return {
		year: date.getFullYear(),
		month: date.getMonth(),
		date: date.getDate()
	};
};

import { Day, Month } from "../stores/models/calendar.model";

export const Months = ['January', 'February', 'March', 'April', 'May', 'June',
	'July', 'August', 'September', 'October', 'November', 'December']

export const weekdays: Day[] = [
	{
		id: 0,
		prefix: "Sun",
		name: "Sunday",
		type: "Day"
	},
	{
		id: 1,
		prefix: "Mon",
		name: "Monday",
		type: "Day"
	},
	{
		id: 2,
		prefix: "Tue",
		name: "Tuesday",
		type: "Day"
	},
	{
		id: 3,
		prefix: "Wed",
		name: "Wednesday",
		type: "Day"
	},
	{
		id: 4,
		prefix: "Thu",
		name: "Thursday",
		type: "Day"
	},
	{
		id: 5,
		prefix: "Fri",
		name: "Friday",
		type: "Day"
	},
	{
		id: 6,
		prefix: "Sat",
		name: "Saturday",
		type: "Day"
	},
];

export const months: Month[] = Months.map((month, index) => {
	return ({
		id: index,
		prefix: month.slice(0, 3),
		name: month,
		type: "Month"
	})
}
);

export const getDaysInMonth = (year: number, month: number): Date[][] => {
	const date = new Date(year, month, 1);
	console.log(date)
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

	// Add the last week, even if it's incomplete
	if (tempList.length > 0) {
		days.push(tempList);
	}

	return days;
};

export const getWeekDates = (year: number, month: number, weekNumber: number): Date[] => {
  const firstDayOfMonth: Date = new Date(year, month, 1);
  const firstDayOfWeek: Date = new Date(year, month, 1 - firstDayOfMonth.getDay());

  // Check if the first day of the week falls in the previous month
  if (firstDayOfWeek.getMonth() !== month) {
    firstDayOfWeek.setDate(firstDayOfWeek.getDate() + 7); // Move to the next week
  }

  // Create a new Date object for the target week's start
	const targetDate: Date = new Date(firstDayOfWeek.getTime());
	const startDate: Date = new Date(year, 0, 1);
	const days: number = Math.floor((targetDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
	const weekNum: number = Math.ceil(days / 7);
  targetDate.setDate(firstDayOfWeek.getDate() + (7 * (weekNumber - weekNum - 1)));

  const weekDates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date: Date = new Date(targetDate);
    date.setDate(targetDate.getDate() + i);
    weekDates.push(date);
  }

  return weekDates;
};
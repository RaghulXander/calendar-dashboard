interface Defaults {
	id: number;
	prefix: string;
	name: string;
}

interface User {
	email: string;
	displayName: string;
	self: boolean;
}

export interface Event {
	id?: number;
	name: string;
	created: string;
	updated: string;
	summary: string;
	description: string;
	status: string;
	creator?: User;
	organizer?: User;
	attendees?: User[];
	startTime: Date | string;
	endTime: Date | string;
	date: string;
}

export interface Day extends Defaults {
	type: 'Day';
	events?: Event[];
	date?: Date;
}

export interface Month extends Defaults {
	type: 'Month';
}

export interface Year {
	type: 'Year';
	id: number;
	name: string;
}

export interface Week {
	type: 'Week';
	id: number;
	month: number;
	year: number;
}

export type Actions = 'Next' | 'Previous' | 'Link';

export type CalendarType = 'Day' | 'Week' | 'Year' | 'Month';

export interface Calendar {
	calendarType: CalendarType;
	currentDate: Date;
	currentYear: Year;
	currentMonth: Month;
	currentDay: Day;
	currentWeek: Week;
}

export interface StateContext<T> {
	state: T;
}

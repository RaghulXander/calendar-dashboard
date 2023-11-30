type Defaults = {
	id: number,
	prefix: string,
	name: string,
}

export interface Day extends Defaults {
	type: "Day"
};

export interface Month extends Defaults {
	type: "Month"
};

export interface Year {
	type: "Year",
	id: number,
	name: string,
};

export interface Week {
	type: "Week",
	id: number,
	month: number,
	year: number
};

export type Actions = "Next" | "Previous";

export type CalendarType = "Day" | "Week" | "Year" | "Month" 

export interface Calendar {
	calendarType: CalendarType;
	currentDate: Date;
	currentYear: Year;
	currentMonth: Month;
	currentDay: Day;
	currentWeek: Week;
}

export type StateContext<T> = {
	state: T;
};

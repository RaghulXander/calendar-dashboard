import { createHook, type StoreActionApi, createStore } from 'react-sweet-state';
import { type Actions, type Calendar, type CalendarType, type StateContext } from './models/calendar.model';
import { LayoutTypes, Navigation_Actions } from '../constants/constants';
import { Months, weekdays, getWeekNumber } from '../helpers/calendar';
import { db } from '../db';
type StateType = StateContext<Calendar>;

const initialState = (): StateType => {
	const date = new Date();
	const weekNumber = getWeekNumber(date);
	return {
		state: {
			calendarType: 'Month',
			currentDate: date,
			currentYear: {
				type: 'Year',
				id: date.getFullYear(),
				name: date.getFullYear().toString()
			},
			currentMonth: {
				type: 'Month',
				id: date.getMonth(),
				name: Months[date.getMonth()],
				prefix: Months[date.getMonth()].slice(0, 1)
			},
			currentDay: {
				type: 'Day',
				id: date.getDate(),
				prefix: '',
				name: weekdays.find((day) => day.id === date.getDay())?.name ?? ''
			},
			currentWeek: {
				type: 'Week',
				id: weekNumber,
				month: date.getMonth(),
				year: date.getFullYear()
			}
		}
	};
};

const updateLayoutState = (action: Actions, data: Calendar): Calendar => {
	const updatedData = { ...data };
	const { calendarType, currentDate } = updatedData;
	const value = action === Navigation_Actions.NEXT ? 1 : -1;
	const newDate = new Date(currentDate);

	switch (calendarType) {
		case LayoutTypes.DAY:
			newDate.setDate(newDate.getDate() + value);
			const dayWeekNumber = getWeekNumber(newDate);
			return {
				...data,
				currentDay: {
					type: 'Day',
					id: newDate.getDate(),
					name: weekdays.find((day) => day.id === newDate.getDay())?.name ?? '',
					prefix: ''
				},
				currentWeek: {
					type: 'Week',
					id: dayWeekNumber,
					month: newDate.getMonth(),
					year: newDate.getFullYear()
				},
				currentMonth: {
					type: 'Month',
					id: newDate.getMonth(),
					name: Months[newDate.getMonth()],
					prefix: Months[newDate.getMonth()].slice(0, 1)
				},
				currentYear: {
					type: 'Year',
					id: newDate.getFullYear(),
					name: newDate.getFullYear().toString()
				},
				currentDate: newDate
			};

		case LayoutTypes.WEEK:
			newDate.setDate(newDate.getDate() + 7 * value);
			const weekNumber = getWeekNumber(newDate);
			return {
				...data,
				currentWeek: {
					type: 'Week',
					id: weekNumber,
					month: newDate.getMonth(),
					year: newDate.getFullYear()
				},
				currentMonth: {
					type: 'Month',
					id: newDate.getMonth(),
					name: Months[newDate.getMonth()],
					prefix: Months[newDate.getMonth()].slice(0, 1)
				},
				currentYear: {
					type: 'Year',
					id: newDate.getFullYear(),
					name: newDate.getFullYear().toString()
				},
				currentDate: newDate
			};
		case LayoutTypes.MONTH:
			newDate.setMonth(newDate.getMonth() + value);
			const monthName = Months[newDate.getMonth()];
			return {
				...data,
				currentMonth: {
					type: 'Month',
					id: newDate.getMonth(),
					name: monthName,
					prefix: monthName.slice(0, 1)
				},
				currentYear: {
					type: 'Year',
					id: newDate.getFullYear(),
					name: newDate.getFullYear().toString()
				},
				currentDate: newDate
			};

		case LayoutTypes.YEAR:
			newDate.setFullYear(newDate.getFullYear() + value);
			return {
				...data,
				currentYear: {
					type: 'Year',
					id: newDate.getFullYear(),
					name: newDate.getFullYear().toString()
				},
				currentDate: newDate
			};

		default:
			return data;
	}
};

const actions = {
	updateCalendarType:
		(calendarType: CalendarType) =>
		({ setState, getState }: StoreActionApi<StateType>) => {
			setState({
				state: {
					...getState().state,
					calendarType
				}
			});
		},
	updateNext:
		() =>
		({ setState, getState }: StoreActionApi<StateType>) => {
			const { state } = getState();
			const data = updateLayoutState(Navigation_Actions.NEXT as Actions, state);
			setState({
				state: {
					...data
				}
			});
		},
	updatePrevious:
		() =>
		({ setState, getState }: StoreActionApi<StateType>) => {
			const { state } = getState();
			const data = updateLayoutState(Navigation_Actions.PREVIOUS as Actions, state);
			setState({
				state: {
					...data
				}
			});
		},
	reset:
		() =>
		({ setState }: StoreActionApi<StateType>) => {
			setState(initialState());
		}
};

export const CalendarStore = createStore<StateType, typeof actions>({
	name: 'calendar-store',
	initialState: initialState(),
	actions
});

export const useCalendarStore = createHook(CalendarStore);

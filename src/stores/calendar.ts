import { createHook, type StoreActionApi, createStore } from 'react-sweet-state';
import { type Actions, type Calendar, type CalendarType, type StateContext } from './models/calendar.model';
import { LayoutTypes, Navigation_Actions } from '../constants/constants';
import { Months, weekdays, getWeekNumber } from '../helpers/calendar';

type StateType = StateContext<Calendar> & {
	loading: boolean;
};

const initialState = (): StateType => {
	const date = new Date();
	const weekNumber = getWeekNumber(date);
	return {
		state: {
			calendarType: (localStorage.getItem('calendarType') as CalendarType) ?? 'Week',
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
				prefix: Months[date.getMonth()].slice(0, 3)
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
		},
		loading: false
	};
};

const updateLayoutState = (data: Calendar, action: Actions, type?: CalendarType, date?: Date): Calendar => {
	const updatedData = { ...data, calendarType: type ?? data.calendarType };
	const { currentDate } = updatedData;
	let value = 0;
	let calendarType = type ? type : updatedData.calendarType;
	if (action !== Navigation_Actions.LINK) {
		value = action === Navigation_Actions.NEXT ? 1 : -1;
	}
	const newDate = new Date(date ? date : currentDate);

	switch (calendarType) {
		case LayoutTypes.DAY:
			newDate.setDate(newDate.getDate() + value);
			const dayWeekNumber = getWeekNumber(newDate);
			return {
				...updatedData,
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
					prefix: Months[newDate.getMonth()].slice(0, 3)
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
				...updatedData,
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
					prefix: Months[newDate.getMonth()].slice(0, 3)
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
				...updatedData,
				currentMonth: {
					type: 'Month',
					id: newDate.getMonth(),
					name: monthName,
					prefix: monthName.slice(0, 3)
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
				...updatedData,
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
		(calendarType: CalendarType, date?: Date) =>
		({ setState, getState }: StoreActionApi<StateType>) => {
			setState({
				loading: true
			});
			const data = updateLayoutState(getState().state, Navigation_Actions.LINK as Actions, calendarType, date);
			setState({
				state: {
					...data
				},
				loading: false
			});
			localStorage.setItem('calendarType', calendarType);
		},
	updateNext:
		() =>
		({ setState, getState }: StoreActionApi<StateType>) => {
			const { state } = getState();
			setState({
				loading: true
			});
			const data = updateLayoutState(state, Navigation_Actions.NEXT as Actions);
			setState({
				state: {
					...data
				},
				loading: false
			});
		},
	updatePrevious:
		() =>
		({ setState, getState }: StoreActionApi<StateType>) => {
			const { state } = getState();
			setState({
				loading: true
			});
			const data = updateLayoutState(state, Navigation_Actions.PREVIOUS as Actions);
			setState({
				state: {
					...data
				},
				loading: false
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

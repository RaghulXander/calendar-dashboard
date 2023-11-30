import { createHook, StoreActionApi, createStore } from "react-sweet-state";
import { Actions, Calendar, CalendarType, StateContext } from "./models/calendar.model";
import { LayoutTypes, Navigation_Actions } from "../constants/constants";
import { Months, weekdays } from "../helpers/calendar";

type StateType = StateContext<Calendar>;

const initialState = (): StateType => {
	const date = new Date();
	const startDate: Date = new Date(date.getFullYear(), 0, 1);
	const days: number = Math.floor((date.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
	const weekNumber: number = Math.ceil(days / 7);
	return {
		state: {
			calendarType: "Month",
			currentDate: date,
			currentYear: {
				type: "Year",
				id: date.getFullYear(),
				name: date.getFullYear().toString(),
			},
			currentMonth: {
				type: "Month",
				id: date.getMonth(),
				name: Months[date.getMonth()],
				prefix: Months[date.getMonth()].slice(0, 3)
			},
			currentDay: {
				type: "Day",
				id: date.getDate(),
				prefix: "",
				name: weekdays.find(day => day.id === date.getDay())?.name ?? ""
			},
			currentWeek: {
				type: "Week",
				id: weekNumber,
				month: date.getMonth(),
				year: date.getFullYear()
			}
		}
	}
}

const updateLayoutState = (action: Actions, data: Calendar): Calendar => {
	const updatedData = {...data}
	const { calendarType, currentDate } = updatedData;
	const value = action === Navigation_Actions.NEXT ? 1 : -1;
	const newDate = new Date(currentDate);
	switch (calendarType) {
		case LayoutTypes.DAY: {
			action === Navigation_Actions.NEXT ?
				newDate.setDate(newDate.getDate() + 1) : newDate.setDate(newDate.getDate() - 1);
			const startDate: Date = new Date(newDate.getFullYear(), 0, 1);
			const days: number = Math.floor((newDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
			const weekNumber: number = Math.ceil(days / 7);
			//console.log("🚀 ~ file: calendar.ts:54 ~ updateLayoutState ~ weekNumber:", weekNumber)
			return {
				...data,
				currentDay: {
					type: "Day",
					id: newDate.getDate(),
					name: weekdays.find(day => day.id === newDate.getDay())?.name ?? "",
					prefix: ""
				},
				currentWeek: {
					type: "Week",
					id: weekNumber,
					month: newDate.getMonth(),
					year: newDate.getFullYear()
				},
				currentMonth: {
					type: "Month",
					id: newDate.getMonth(),
					name: Months[newDate.getMonth()],
					prefix: Months[newDate.getMonth()].slice(0, 3)
				},
				currentYear: {
					type: "Year",
					id: newDate.getFullYear(),
					name: newDate.getFullYear().toString(),
				},
				currentDate: newDate
			};
		}
		case LayoutTypes.WEEK: {
			action === Navigation_Actions.NEXT ?
				newDate.setDate(newDate.getDate() + 7) : newDate.setDate(newDate.getDate() - 7);
			const startDate: Date = new Date(newDate.getFullYear(), 0, 1);
			const days: number = Math.floor((newDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
			const weekNumber: number = Math.ceil(days / 7);
			console.log("🚀 ~ file: calendar.ts:54 ~ updateLayoutState ~ weekNumber:", weekNumber)
			return {
				...data,
				currentWeek: {
					type: "Week",
					id: weekNumber,
					month: newDate.getMonth(),
					year: newDate.getFullYear()
				},
				currentMonth: {
					type: "Month",
					id: newDate.getMonth(),
					name: Months[newDate.getMonth()],
					prefix: Months[newDate.getMonth()].slice(0, 3)
				},
				currentYear: {
					type: "Year",
					id: newDate.getFullYear(),
					name: newDate.getFullYear().toString(),
				},
				currentDate: newDate
			};
		}
		case LayoutTypes.MONTH: {
			newDate.setMonth(newDate.getMonth() + value);
			const name = Months[newDate.getMonth()]
			return {
				...data,
				currentMonth: {
					type: "Month",
					id: newDate.getMonth(),
					name,
					prefix: name.slice(0, 3)
				},
				currentYear: {
					type: "Year",
					id: newDate.getFullYear(),
					name: newDate.getFullYear().toString(),
				},
				currentDate: newDate
			};
		}
		case LayoutTypes.YEAR: {
			newDate.setFullYear(newDate.getFullYear() + value);
			return {
				...data,
				currentYear: {
					type: "Year",
					id: newDate.getFullYear(),
					name: newDate.getFullYear().toString(),
				},
				currentDate: newDate
			};
		}
		default:
			return data
	}
	
};

const actions = {
	updateCalendarType: (calendarType: CalendarType) => ({ setState, getState }: StoreActionApi<StateType>) => {
		setState({
			state: {
			...getState().state,
				calendarType
			}
		});
	},
	updateNext: () => ({ setState, getState }: StoreActionApi<StateType>) => {
		const { state } = getState();
		const data = updateLayoutState(Navigation_Actions.NEXT as Actions, state)
		setState({
			state: {
			...data
			}
		});
	},
	updatePrevious: () => ({ setState, getState }: StoreActionApi<StateType>) => {
		const { state } = getState();
		const data = updateLayoutState(Navigation_Actions.PREVIOUS as Actions, state)
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
		},
}

export const CalendarStore = createStore<StateType, typeof actions>({
	name: "calendar-store",
	initialState: initialState(),
	actions,
})

export const useCalendarStore = createHook(CalendarStore);
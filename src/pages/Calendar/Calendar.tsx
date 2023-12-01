import { getWeekDates, weekdays, months as MonthList } from 'helpers/calendar';
import { useEffect, useMemo } from 'react';
import { Header, MonthGrid, DayGrid } from '../../components';
import { LayoutTypes } from '../../constants/constants';
import styles from './Calendar.module.scss';
import { useEventStore } from '../../stores/events';
import { useCalendarStore } from '../../stores/calendar';

function CalendarPage() {
	const [{ state }] = useCalendarStore();
	const [{ state: eventState }, eventActions] = useEventStore();
	console.log('eventState', eventState);

	useEffect(() => {
		eventActions.getEvents();

		() => eventActions.reset;
	}, [eventActions]);

	const isTodayEvent =
			(currentDate: Date, eventDate: Date) =>
				new Date(currentDate).getDate() === new Date(eventDate).getDate() &&
				new Date(currentDate).getMonth() === new Date(eventDate).getMonth() &&
				new Date(currentDate).getFullYear() === new Date(eventDate).getFullYear();

	const generateWeekDays = useMemo(() => {
		const { year, month, id } = state.currentWeek;
		const weekDates = getWeekDates(year, month, id);
		return weekDates.map((date) => {
			const currentDay = weekdays.find((day) => day.id === date.getDay());
			const events = eventState.events.filter(event => isTodayEvent(date, new Date(event.date)));
			console.log("events", events)
			
			if (!currentDay) return weekdays[0];
			return {
				...currentDay,
				id: date.getDate(),
				date,
				events
			};
		});
	}, [state.currentWeek]);

	const getCurrentDay = useMemo(() => {
		const updatedEvents = eventState.events.filter(event => isTodayEvent(state.currentDate, new Date(event.date)));
		console.log("updatedEvents", updatedEvents)
		return [{
			...state.currentDay,
			date: state.currentDate,
			events: updatedEvents ?? []
		}];
	}, [state.currentDate, state.currentDay, eventState.events]);

	const renderCurrentPageLayout = () => {
		switch (state.calendarType) {
			case LayoutTypes.DAY:
				return <DayGrid
					days={getCurrentDay}
					currentDate={state.currentDate} />;
			case LayoutTypes.MONTH:
				return <MonthGrid selectedMonth={state.currentMonth} selectedYear={state.currentYear} />;
			case LayoutTypes.WEEK:
				return <DayGrid days={generateWeekDays} currentDate={state.currentDate} isWeekly />;

			case LayoutTypes.YEAR:
			default:
				return (
					<div className={styles['months-container']}>
						{MonthList.map((monthDate) => (
							<MonthGrid minimal key={monthDate.id} selectedMonth={monthDate} selectedYear={state.currentYear} />
						))}
					</div>
				);
		}
	};
	return (
		<div className={styles['calendar-page']}>
			<Header />
			<div className={styles.container}>{renderCurrentPageLayout()}</div>
		</div>
	);
}

export default CalendarPage;

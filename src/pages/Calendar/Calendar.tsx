import { getWeekDates, weekdays, months as MonthList } from 'helpers/calendar';
import { useEffect, useMemo, useCallback } from 'react';
import { Header, MonthGrid, DayGrid, LoadingIndicator } from '../../components';
import { LayoutTypes } from '../../constants/constants';
import styles from './Calendar.module.scss';
import { useEventStore } from '../../stores/events';
import { useCalendarStore } from '../../stores/calendar';

function CalendarPage() {
	const [{ state, loading }, calendarActions] = useCalendarStore();
	const [{ state: eventState, loading: eventLoading }, eventActions] = useEventStore();

	useEffect(() => {
		eventActions.getEvents();
	}, [eventActions]);

	const isTodayEvent = useCallback((currentDate: Date, eventDate: Date) => {
		return (
			new Date(currentDate).getDate() === new Date(eventDate).getDate() &&
			new Date(currentDate).getMonth() === new Date(eventDate).getMonth() &&
			new Date(currentDate).getFullYear() === new Date(eventDate).getFullYear()
		);
	}, []);

	const getEvent = useCallback(
		(date: Date) => {
			return eventState.events.filter((event) => isTodayEvent(date, new Date(event.date)));
		},
		[eventState.events, isTodayEvent]
	);

	const generateWeekDays = useMemo(() => {
		const { year, month, id } = state.currentWeek;
		const weekDates = getWeekDates(year, month, id);
		return weekDates.map((date) => {
			const currentDay = weekdays.find((day) => day.id === date.getDay());
			const events = getEvent(date);

			if (!currentDay) return weekdays[0];
			return {
				...currentDay,
				id: date.getDate(),
				date,
				events
			};
		});
	}, [state.currentWeek, getEvent]);

	const getCurrentDay = useMemo(() => {
		const updatedEvents = getEvent(state.currentDate);

		return [
			{
				...state.currentDay,
				date: state.currentDate,
				events: updatedEvents ?? []
			}
		];
	}, [state.currentDay, state.currentDate, getEvent]);

	const currentPageLayout = useMemo(() => {
		switch (state.calendarType) {
			case LayoutTypes.DAY:
				return <DayGrid days={getCurrentDay} currentDate={state.currentDate} />;
			case LayoutTypes.MONTH:
				return <MonthGrid selectedMonth={state.currentMonth} selectedYear={state.currentYear} />;
			case LayoutTypes.WEEK:
				return (
					<DayGrid
						days={generateWeekDays}
						currentDate={state.currentDate}
						isWeekly
						onHeaderClick={calendarActions.updateCalendarType}
					/>
				);

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
	}, [
		state.calendarType,
		state.currentDate,
		state.currentWeek,
		state.currentMonth,
		state.currentYear,
		eventState.events,
		eventLoading,
		loading
	]);

	if (eventLoading || loading) return <LoadingIndicator />;

	return (
		<div className={styles['calendar-page']}>
			<Header />
			<div className={styles.container}>{currentPageLayout}</div>
		</div>
	);
}

export default CalendarPage;

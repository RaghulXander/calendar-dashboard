import { getWeekDates, weekdays, months as MonthList } from 'helpers/calendar';
import { useMemo } from 'react';
import { Header, MonthGrid, DayGrid } from '../../components';
import { LayoutTypes } from '../../constants/constants';
import { useCalendarStore } from '../../stores/calendar';
import styles from './Calendar.module.scss';

function CalendarPage() {
	const [{ state }] = useCalendarStore();
	console.log(state.currentDay);

	const generateWeekDays = useMemo(() => {
		const { year, month, id } = state.currentWeek;
		const weekDates = getWeekDates(year, month, id);
		return weekDates.map((date) => {
			const currentDay = weekdays.find((day) => day.id === date.getDay());
			if (!currentDay) return weekdays[0];
			return {
				...currentDay,
				id: date.getDate()
			};
		});
	}, [state.currentWeek]);

	const renderCurrentPageLayout = () => {
		switch (state.calendarType) {
			case LayoutTypes.DAY:
				return <DayGrid days={[state.currentDay]} currentDate={state.currentDate} />;
			case LayoutTypes.MONTH:
				return <MonthGrid selectedMonth={state.currentMonth} selectedYear={state.currentYear} />;
			case LayoutTypes.WEEK:
				return <DayGrid days={generateWeekDays} />;

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

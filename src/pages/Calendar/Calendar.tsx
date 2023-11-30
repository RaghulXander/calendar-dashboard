import { WeekGrid, Header, MonthGrid, YearGrid, DayGrid } from "../../components"
import { LayoutTypes } from "../../constants/constants"
import { useCalendarStore } from "../../stores/calendar"
import { Calendar, CalendarType } from "../../stores/models/calendar.model";

const CalendarPage = () => {
	const [{ state }] = useCalendarStore();
	console.log(state.currentDay);

	const renderCurrentPageLayout = () => {
		switch (state.calendarType) {
			case LayoutTypes.DAY:
				return <DayGrid
					days={[state.currentDay]}
				/>
			case LayoutTypes.MONTH:
				return <MonthGrid
					selectedMonth={state.currentMonth}
					selectedYear={state.currentYear}
				/>
			case LayoutTypes.WEEK:
				return <WeekGrid />
			case LayoutTypes.YEAR:
			default:
				return <YearGrid />

		}
	}
	return (
		<div className="calendarPage">
			<Header />
			<div className="container">
				{renderCurrentPageLayout()}
			</div>
		</div>
	)
}

export default CalendarPage;
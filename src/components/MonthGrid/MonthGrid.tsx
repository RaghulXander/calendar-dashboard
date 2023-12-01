import React, { useMemo, useCallback } from 'react';
import classNames from 'classnames';
import { getDaysInMonth, weekdays, Days } from '../../helpers/calendar';
import { useCalendarStore } from '../../stores/calendar';
import { type Month, type Year, Event } from '../../stores/models/calendar.model';
import styles from './MonthGrid.module.scss';
import { useEventStore } from 'stores/events';
interface MonthGridProps {
	minimal?: boolean;
	selectedYear: Year;
	selectedMonth: Month;
}

export const MonthGrid: React.FC<MonthGridProps> = (props) => {
	const [{ state }, calendarActions] = useCalendarStore();
	const [{ state: eventState }] = useEventStore();
	const { selectedYear, selectedMonth } = props;

	const daysInMonth = useMemo(
		() => getDaysInMonth(selectedYear.id, selectedMonth.id),
		[selectedMonth.id, selectedYear.id]
	);

	const isToday = useCallback(
		(currentDate: number | string) =>
			new Date().getDate() === currentDate &&
			new Date().getMonth() === selectedMonth.id &&
			new Date().getFullYear() === selectedYear.id,
		[selectedMonth.id, selectedYear.id]
	);

	const isTodayEvent = useCallback(
		(currentDate: string, date: Date) =>
			new Date(currentDate).getDate() === new Date(date).getDate() &&
			new Date(currentDate).getMonth() === selectedMonth.id &&
			new Date(currentDate).getFullYear() === selectedYear.id,
		[selectedMonth.id, selectedYear.id, eventState]
	);

	const getFilteredEvents = useCallback(
		(day: Date) => {
			return day ? eventState.events.filter((event) => isTodayEvent(event.date, day)) : [];
		},
		[eventState.events, selectedMonth, isTodayEvent]
	);

	const renderEvents = useCallback(
		(day: Date) => {
			const filteredEvents = getFilteredEvents(day);

			const renderEvent = (event: Event) => (
				<div title={event.name} key={`${event.id}-${event.name.slice(0, 3)}`} className={styles['event']}>
					{event.name}
				</div>
			);

			return <div className={styles['event-container']}>{filteredEvents.map(renderEvent)}</div>;
		},
		[eventState.events, selectedMonth]
	);

	return (
		<div
			className={classNames(styles['month-grid'], {
				[`${styles['small-grid']}`]: props.minimal
			})}
		>
			{props.minimal && (
				<h3
					className={styles['month-title']}
					onClick={() => {
						calendarActions.updateCalendarType('Month', new Date(state.currentYear.id, selectedMonth.id, 1));
					}}
				>
					<span>
						{selectedMonth.name} &nbsp;{state.currentYear.name}
					</span>
				</h3>
			)}
			<div className={styles['days-grid']}>
				<div className={styles.weekdays}>
					{weekdays.map((weekday) => (
						<div
							key={`${selectedMonth.prefix}-day-${weekday.name}`}
							className={classNames(styles.weekday, {
								[`${styles.sunday}`]: weekday.name === 'Sunday'
							})}
						>
							{props.minimal ? weekday.prefix : weekday.name}
						</div>
					))}
				</div>
				{daysInMonth.map((weekRow, index) => (
					<div className={styles['week-row']} key={`${selectedMonth.prefix}-${index}`}>
						{weekRow.map((day, dayIndex) => {
							const currentDate = typeof day === 'object' ? day.getDate() : '';
							return (
								<div
									key={`${selectedMonth.prefix}-${currentDate}-${dayIndex}`}
									className={classNames(styles.day, {
										[`${styles.active}`]: isToday(currentDate),
										[`${styles.sunday}`]: dayIndex === 0
									})}
								>
									<span className={classNames(styles.currentDate)}>{currentDate}</span>
									{getFilteredEvents(day).length > 0 ? <span className={classNames(styles.eventMarker)} /> : null}
									{day && !props.minimal ? renderEvents(day) : null}
								</div>
							);
						})}
					</div>
				))}
			</div>
		</div>
	);
};

export default MonthGrid;

import React, { useCallback } from 'react';
import { CalendarType, type Day } from 'stores/models/calendar.model';
import styles from './DayGrid.module.scss';
import { Months } from '../../helpers/calendar';
import { HourGrid } from '..';

export const DayGrid: React.FC<{
	days: Day[];
	currentDate: Date;
	isWeekly?: boolean;
	onHeaderClick?: (type: CalendarType, date: Date) => void;
}> = ({ days, currentDate, isWeekly, onHeaderClick }) => {
	const hours: number[] = Array.from({ length: 6 }, (_, index) => index + 9);

	const isCurrentHourEvent = useCallback((currentDate: Date, eventDate: Date) => {
		return (
			new Date(currentDate).getDate() === new Date(eventDate).getDate() &&
			new Date(currentDate).getMonth() === new Date(eventDate).getMonth() &&
			new Date(currentDate).getFullYear() === new Date(eventDate).getFullYear()
		);
	}, []);

	const getEventsForDay = useCallback(
		(day: Day) => {
			if (!day?.events) return [];
			const filteredEvents = day?.events?.filter((event) =>
				isCurrentHourEvent(day?.date ?? new Date(day.id), new Date(event.date))
			);
			return filteredEvents;
		},
		[isCurrentHourEvent]
	);

	return (
		<div className={styles['day-grid']}>
			<div className={styles.weekdays}>
				{days.length > 1 && <div className={styles['week-day']} />}
				{days.length === 1 && !isWeekly ? (
					<div className={styles['single-day']}>
						{days[0].name}, {days[0].id} {Months[currentDate?.getMonth()]} {currentDate?.getFullYear()}
					</div>
				) : (
					days.map((day) => (
						<div
							key={day.name}
							className={styles['week-day']}
							onClick={() => {
								if (onHeaderClick && day.date) onHeaderClick('Day', day.date);
							}}
						>
							<span className={styles['week-date']}>{day.id}</span>
							{day.name}
						</div>
					))
				)}
			</div>
			<div className={styles['hours-grid']}>
				{hours.map((hour, index) => (
					<div key={index} className={styles.hour}>
						<div className={styles['hour-slot-time']}>{`${hour}:00`}</div>
						{days.map((day, dayIndex) => (
							<HourGrid key={`${hour}-${day.id}`} day={day} hour={hour} events={getEventsForDay(day)} />
						))}
					</div>
				))}
			</div>
		</div>
	);
};

export default DayGrid;

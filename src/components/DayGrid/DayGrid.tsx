import React from 'react';
import { type Day } from 'stores/models/calendar.model';
import styles from './DayGrid.module.scss';
import { Months } from '../../helpers/calendar';
import { HourGrid } from '..';

export const DayGrid: React.FC<{ days: Day[]; currentDate?: Date }> = ({ days, currentDate }) => {
	const hours: number[] = Array.from({ length: 6 }, (_, index) => index + 9);

	return (
		<div className={styles['day-grid']}>
			<div className={styles.weekdays}>
				{days.length > 1 && <div className={styles['week-day']} />}
				{days.length === 1 && currentDate ? (
					<div className={styles['single-day']}>
						{days[0].name}, {days[0].id} {Months[currentDate?.getMonth()]} {currentDate?.getFullYear()}
					</div>
				) : (
					days.map((day) => (
						<div key={day.name} className={styles['week-day']}>
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
							<HourGrid day={day} hour={hour} />
						))}
					</div>
				))}
			</div>
		</div>
	);
};

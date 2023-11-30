import React, { useState, useMemo, useCallback } from 'react';
import classNames from 'classnames';
import { getDaysInMonth, weekdays } from '../../helpers/calendar';
import { useCalendarStore } from '../../stores/calendar';
import { type Month, type Year } from '../../stores/models/calendar.model';
import styles from './MonthGrid.module.scss';

interface MonthGridProps {
	minimal?: boolean;
	selectedYear: Year;
	selectedMonth: Month;
}

export const MonthGrid: React.FC<MonthGridProps> = (props) => {
	const [{ state }, calendarActions] = useCalendarStore();
	console.log('Month', props);
	const { selectedYear, selectedMonth } = props;

	// const selectedDate = props.selectedDate ? props.selectedDate : state.currentDate;
	// const selectedMonth = props.selectedMonth ? props.selectedMonth : state.currentMonth;

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
						calendarActions.updateCalendarType('Month');
					}}
				>
					<span>{selectedMonth.name}</span>
					<span>{state.currentYear.name}</span>
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
									<span>{currentDate}</span>
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

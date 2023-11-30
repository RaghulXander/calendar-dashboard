import React, { useState, useMemo } from 'react';
import classNames from 'classnames';
import { getDaysInMonth, weekdays } from '../../helpers/calendar';
import { useCalendarStore } from '../../stores/calendar';
import { Month, Year } from "../../stores/models/calendar.model";
import styles from "./MonthGrid.module.scss"

interface MonthGridProps {
	minimal?: boolean,
	selectedYear: Year,
	selectedMonth: Month
}

export const MonthGrid: React.FC<MonthGridProps> = (props) => {
	const [{ state },] = useCalendarStore();
	console.log("Month", props);
	const { selectedYear, selectedMonth } = props;

	//const selectedDate = props.selectedDate ? props.selectedDate : state.currentDate;
	//const selectedMonth = props.selectedMonth ? props.selectedMonth : state.currentMonth;
	
	const daysInMonth = useMemo(() => {
		return getDaysInMonth(selectedYear.id, selectedMonth.id)
	}, [selectedMonth.id, selectedYear.id])

	return (
		<div className={classNames(styles["month-grid"], {
			[`${styles["small-grid"]}`]: props.minimal
		})}>
			{props.minimal && <h3 className={styles["month-title"]}>
				<span>{selectedMonth.name}</span>
				<span>{state.currentYear.name}</span>
			</h3>}
			<div className={styles["days-grid"]}>
				<div className={styles["weekdays"]}>
					{weekdays.map((weekday, index) => (
						<div key={`${selectedMonth.prefix}day-${weekday.prefix}`} className={styles["weekday"]}>
							{weekday.prefix}
						</div>
					))}
				</div>
				{daysInMonth.map((weekRow, index) => {
					return (
						<div className={styles["week-row"]} key={`${selectedMonth.prefix}-${index}`}>
							{
								weekRow.map((day, dayIndex) => {
									const currentDate = typeof day === "object" ? day.getDate() : "-"
									return (
										<div key={`${selectedMonth.prefix}-${currentDate}-${dayIndex}`} className={styles["day"]}>
											{currentDate}
										</div>
									)
								})
						}
						</div>
					)

				})}
			</div>
		</div>
	);
};

export default MonthGrid;

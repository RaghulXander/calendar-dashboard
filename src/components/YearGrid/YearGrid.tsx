import React from 'react';
import { months as MonthList } from '../../helpers/calendar';
import MonthGrid from '../MonthGrid/MonthGrid';
import styles from "./YearGrid.module.scss"
import { useCalendarStore } from 'stores/calendar';

export const YearGrid: React.FC = () => {
	const [{ state },] = useCalendarStore();
	return (
		<div className={styles["year-grid"]}>
			<div className={styles["months-container"]}>
				{MonthList.map((monthDate) => <MonthGrid
					minimal
					key={monthDate.id}
					selectedMonth={monthDate}
					selectedYear={state.currentYear}
				/>)}
			</div>
		</div>
	);
};

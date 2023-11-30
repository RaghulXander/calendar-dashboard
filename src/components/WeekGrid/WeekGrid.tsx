import React from 'react';
import { weekdays, getWeekDates } from "../../helpers/calendar";
import { useCalendarStore } from 'stores/calendar';
import styles from "./WeekGrid.module.scss"

export const WeekGrid: React.FC = () => {
	const [{ state },] = useCalendarStore();
	const { year, month, id } = state.currentWeek;
	const hours: number[] = Array.from({ length: 6 }, (_, index) => index + 9);
	const weekDates = getWeekDates(year, month, id);
	console.log("weekDates", weekDates)

  return (
    <div className={styles["calendar"]}>
		<div className={styles["weekdays"]}>
			  <div className={styles["weekday"]}>IST
04:00</div>
        {weekdays.map((weekday, index) => (
			<div key={index} className={styles["weekday"]}>
				<span className={styles["weekDate"]}>{weekDates[index].getDate()}</span>
            	{weekday.name}
          </div>
        ))}
      </div>
      <div className={styles["hours-grid"]}>
        {hours.map((hour, index) => (
          <div key={index} className={styles["hour"]}>
            <div className={styles["hour-slot-time"]}>{`${hour}:00`}</div>
            {/* Render each hour slot for each day */}
            {weekdays.map((_, dayIndex) => (
              <div key={dayIndex} className={styles["hour-slot"]}>
				{Array.from({length: 4}).map((_, index) => {
					return (
						<div>{hour}: {(15* index)}</div>
					)
				})}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekGrid;

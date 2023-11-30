import React from 'react';
import styles from "./DayGrid.module.scss"
import { Day } from 'stores/models/calendar.model';

export const DayGrid: React.FC<{days: Day[], currentDay?: Day}> = ({ days, currentDay }) => {
	const hours: number[] = Array.from({ length: 6 }, (_, index) => index + 9);

  return (
    <div className={styles["calendar"]}>
		<div className={styles["weekdays"]}>
			<div className={styles["weekday"]}>IST 04:00</div>
			{days.map((day, index) => (
				<div key={index} className={styles["weekday"]}>
					<span className={styles["weekDate"]}>{day.id}</span>
					{day.name}
			</div>
			))}
      </div>
      <div className={styles["hours-grid"]}>
        {hours.map((hour, index) => (
          <div key={index} className={styles["hour"]}>
            <div className={styles["hour-slot-time"]}>{`${hour}:00`}</div>
            {days.map((_, dayIndex) => (
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

export default DayGrid;

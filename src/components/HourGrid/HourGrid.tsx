import { weekdays } from "../../helpers/calendar";

const hours: number[] = Array.from({ length: 6 }, (_, index) => index + 9); // Hours from 9:00 to 14:00

export const HourGrid = () => {
	return (
		 <div className="calendar">
      {/*<div className="weekdays">
        {weekdays.map((weekday, index) => (
          <div key={index}>{weekday}</div>
        ))}
      </div>*/}
      <div className="hours">
        {hours.map((hour, index) => (
          <div key={index}>{`${hour}:00`}</div>
        ))}
      </div>
      <div className="week-grid">
        {weekdays.map((_, dayIndex) => (
          <div key={dayIndex} className="day-column">
            {hours.map((_, hourIndex) => (
              <div key={hourIndex} className="hour-slot">
                {/* Content for each hour slot */}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
	)
}
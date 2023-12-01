import React, { useMemo } from 'react';
import Dropdown from '../Dropdown/Dropdown';
import { LayoutTypes } from '../../constants/constants';
import { useCalendarStore } from '../../stores/calendar';
import { type CalendarType } from '../../stores/models/calendar.model';
import SvgIconLftArrow from '../../icons/Icons/my-calender/IconLftArrow';
import SvgIconRgtArrow from '../../icons/Icons/my-calender/IconRgtArrow';
import { IconCountdown, IconPrint } from '../../icons/Icons/my-calender';
import styles from './Header.module.scss';

export function Header(): React.ReactElement {
	const [{ state }, calendarActions] = useCalendarStore();
	const { calendarType, currentDay, currentMonth, currentYear } = state;
	const displayDate = useMemo(() => {
		switch (calendarType) {
			case LayoutTypes.DAY: {
				return (
					<span>
						{currentDay.id} {currentDay.name} {currentMonth.name} {currentYear.name}
					</span>
				);
			}
			case LayoutTypes.WEEK: {
				return (
					<span>
						{currentMonth.name} {currentYear.name}
					</span>
				);
			}
			case LayoutTypes.MONTH: {
				return (
					<span>
						{currentMonth.name} {currentYear.name}
					</span>
				);
			}
			case LayoutTypes.YEAR: {
				return <span>{currentYear.name}</span>;
			}
			default:
		}
	}, [calendarType, currentDay.name, currentMonth.name, currentYear.name]);

	return (
		<div className={styles.header}>
			<div className={styles['left-sec']}>
				<h2 className={styles['type-display']}>{calendarType}</h2>
				<div className={styles['nav-actions']}>
					<button title="previous" onClick={calendarActions.updatePrevious}>
						<SvgIconLftArrow />
					</button>
					<button title="next" onClick={calendarActions.updateNext}>
						<SvgIconRgtArrow />
					</button>
				</div>
				<h2 className={styles['date-display']}>{displayDate}</h2>
			</div>
			<div className={styles['right-sec']}>
				<div className={styles.filter_by}>
					<Dropdown
						options={Object.values(LayoutTypes)}
						value={calendarType}
						handleSelect={(value) => {
							calendarActions.updateCalendarType(value as CalendarType);
						}}
					/>
				</div>
			</div>
			<div className={styles.tools}>
				<div className={styles.time}>
					<IconCountdown />
					<span>Yet to Respond</span>
				</div>
				<span className={styles.print}>
					<IconPrint />
				</span>
			</div>
		</div>
	);
}

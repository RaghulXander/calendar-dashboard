import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { type Day, Event } from 'stores/models/calendar.model';
import { IconUnavailable } from 'icons/Icons/my-calender';
import styles from './HourGrid.module.scss';
import { InvitePopup } from '..';

export const HourGrid: React.FC<{
	hour: number;
	day: Day;
	events: Event[];
}> = (props) => {
	const { hour, day } = props;
	const [selectedHour, setSelectedHour] = useState<string>("");
	const [isHovering, setHoverState] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [position, setPosition] = useState({ top: 0, left: 0 });
	const slotRef = useRef<HTMLDivElement>(null);

	const updateSelectedHours = (hour: number, minutes: number) => {
		const formattedHour = hour.toString().padStart(2, '0');
		const formattedMinutes = minutes.toString().padStart(2, '0');
		setSelectedHour(`${formattedHour}:${formattedMinutes}`);
	};

	  useEffect(() => {
			if (slotRef.current) {
			const rect = slotRef.current.getBoundingClientRect();
			const modalWidth = 330;
			const modalHeight = 450;
			
			let left = rect.left;
			let top = rect.top + rect.height;
			
			// Check if the modal overflows on the right side
			if (rect.left + modalWidth > window.innerWidth) {
				left = window.innerWidth - modalWidth + 50;
			}
			
			// Check if the modal overflows at the bottom
			if (rect.top + rect.height + modalHeight > window.innerHeight) {
				top = window.innerHeight - modalHeight
			}

			setPosition({ top, left });
			}
 	 }, []);

	const formatHour = (hour: number, minutes: number) => {
		const formattedHour = hour.toString().padStart(2, '0');
		const formattedMinutes = minutes.toString().padStart(2, '0');
		return `${formattedHour}:${formattedMinutes}`;
	};

	const getEventsForSlot = useCallback(
		(hour: number, minute: number) => {
			return props.events.filter((event) => {
				const eventDate = new Date(event.startTime);
				return (
					eventDate.getHours() === hour && eventDate.getMinutes() >= minute && eventDate.getMinutes() < minute + 15
				);
			});
		},
		[props.events]
	);

	const renderPortal = () => {
		console.log("selectedHour", selectedHour)
		const modalContent = (
		<div className={styles.modal} style={{ top: position.top, left: position.left }}>
			<InvitePopup onClose={() => setShowModal(false)} date={new Date(day.date ?? "")} time={selectedHour} />
		</div>
		);

		if (showModal && position.top && position.left) {
			return createPortal(modalContent, document.body);
		}
		return null;
	};

	const renderEvent = (hour: number, interval: number, index: number) => {
		let eventsForSlot = getEventsForSlot(hour, interval * index);
		const formattedStr = `${formatHour(hour, interval * index)}`;

		if (eventsForSlot.length === 0 && isHovering && selectedHour === formattedStr) return <span>{formattedStr}</span>;
		if (eventsForSlot.length === 0) return null;
		const event = eventsForSlot[0];
		return <div className={styles['event']}>{event.name}</div>;
	};

	if (day.name === "Sunday") {
		return (
			<div key={`${hour}-${day.name}`} className={styles['hour-slot-unavailable']}>
				<IconUnavailable />
				<span>Unavailable</span>
			</div>
		);
	}

	return (
		<div ref={slotRef} key={`${hour}-${day.name}`} className={styles['hour-slot']}>
			{Array.from({ length: 4 }).map((_, index) => (
				<div
					onMouseEnter={() => {
						setHoverState(true);
						updateSelectedHours(hour, 15 * index);
					}}
					onMouseLeave={() => {
						setHoverState(false);
					}}
					onClick={() => {
						updateSelectedHours(hour, 15 * index);
						setShowModal(true);
					}}
					className={styles['slot-partition']}
					key={`${hour}-${day.name}-${index}`}
				>
					<div className={styles['event-container']}>
						{renderEvent(hour, 15, index)}
					</div>
				</div>
			))}
			{renderPortal()}
		</div>
	);
};

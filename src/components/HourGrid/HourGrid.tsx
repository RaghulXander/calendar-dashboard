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
	const [selectedHour, setSelectedHour] = useState<string | null>(null);
	const [showModal, setShowModal] = useState(false);
	const [position, setPosition] = useState({ top: 0, left: 0 });
	const slotRef = useRef<HTMLDivElement>(null);

	const handleHover = (hour: number, minutes: number) => {
		const formattedHour = hour.toString().padStart(2, '0');
		const formattedMinutes = minutes.toString().padStart(2, '0');
		setSelectedHour(`${formattedHour}:${formattedMinutes}`);
	};

	const handleClick = () => {
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
	};

	useEffect(() => {
		if (slotRef.current) {
			const rect = slotRef.current.getBoundingClientRect();
			setPosition({
				top: rect.top + rect.height,
				left: rect.left
			});
		}
	}, []);

	const formatHour = (hour: number, minutes: number) => {
		const formattedHour = hour.toString().padStart(2, '0');
		const formattedMinutes = minutes.toString().padStart(2, '0');
		return `${formattedHour}:${formattedMinutes}`;
	};

	const modalContent = (
		<div className={styles.modal} style={{ top: position.top, left: position.left }}>
			<InvitePopup onClose={handleCloseModal} />
		</div>
	);

	const renderPortal = () => {
		if (showModal && position.top && position.left) {
			return createPortal(modalContent, document.body);
		}
		return null;
	};

	const getEventsForSlot = useCallback(
		(hour: number, minute: number) => {
			return props.events.filter((event) => {
				const eventDate = new Date(event.startTime);
				console.log('getHours', eventDate, eventDate.getHours(), hour, minute);
				return (
					eventDate.getHours() === hour && eventDate.getMinutes() >= minute && eventDate.getMinutes() < minute + 15
				);
			});
		},
		[props.events]
	);

	const renderEvent = (hour: number, minute: number) => {
		let eventsForSlot = getEventsForSlot(hour, minute);
		console.log('eventsForSlot', eventsForSlot, props.events);
		if (eventsForSlot.length === 0) return null;
		const event = eventsForSlot[0];
		return <div className={styles['event']}>{event.name}</div>;
	};

	if (day.id === 0) {
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
						handleHover(hour, 15 * index);
					}}
					onMouseLeave={() => {
						setSelectedHour(null);
					}}
					onClick={handleClick}
					className={styles['slot-partition']}
					key={`${hour}-${day.name}-${index}`}
				>
					<div className={styles['event-container']}>
						{selectedHour === `${formatHour(hour, 15 * index)}` && <span>{formatHour(hour, 15 * index)}</span>}
						{renderEvent(hour, 15 * index)}
					</div>
				</div>
			))}
			{renderPortal()}
		</div>
	);
};

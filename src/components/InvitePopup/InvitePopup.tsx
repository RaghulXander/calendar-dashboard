import {
	IconEdit,
	IconDelete,
	IconCross,
	IconCalender,
	IconWatch,
	IconAttachment,
	IconClock,
	IconPrint
} from 'icons/Icons/my-calender';
import styles from './InvitePopup.module.scss';
import { useState } from 'react';
import { Months, Days } from 'helpers/calendar';
import { IconRgtArrow, IconLocation } from 'icons/Icons/my-calender';
import { useEventStore } from 'stores/events';
import { Event } from 'stores/models/calendar.model';
import { useEffect, useCallback } from 'react';

const emails = [{ email: 'abc@gmail.com' }, { email: 'xyz@gmail.com' }, { email: 'lmn@gmail.com' }];

export const InvitePopup: React.FC<{ event: Event | undefined; date: Date; time: string; onClose: () => void }> = ({
	event,
	time,
	date,
	onClose
}) => {
	const [, eventActions] = useEventStore();
	const [inputData, setInputData] = useState('Default Meeting');

	useEffect(() => {
		setInputData(event?.name ?? '');
	}, [event]);

	const getFormattedTime = useCallback(() => {
		if (date) {
			const day = Days[date.getDay()];
			const month = Months[date.getMonth()];
			return `${day} ${date.getDate()}, ${month} ${date.getFullYear()}`;
		}
		return '';
	}, [date]);

	const getTwoDatesWithGap = useCallback(
		(baseDate: Date) => {
			const [hours, minutes] = time.split(':').map(Number);
			const date1 = new Date(baseDate);
			date1.setHours(hours, minutes, 0, 0);

			const date2 = new Date(date1.getTime() + 15 * 60000);
			return [date1, date2];
		},
		[time]
	);

	const onSuccess = () => {
		eventActions.getEvents();
		onClose();
	};

	const onSave = async () => {
		const [start, end] = getTwoDatesWithGap(date);
		if (event?.id) {
			await eventActions.createEvent({ date, start, end, name: inputData }, onSuccess);
		} else {
			await eventActions.createEvent({ date, start, end, name: inputData }, onSuccess);
		}
	};

	const onDelete = async () => {
		await eventActions.deleteEvent(event?.id, onSuccess);
	};

	return (
		<div className={`${styles.mcalender_popup} ${styles.show_popup}`}>
			<div className={styles.top_option}>
				<span onClick={onDelete}>
					<IconDelete size={14} />
				</span>
				<span onClick={onClose}>
					<IconCross size={12} />
				</span>
			</div>
			<hr className={styles['modal-liner']} />
			<div className={styles['modal-content']}>
				<div className={styles['modal-content-header']}>
					<div className={styles['input-container']}>
						<input
							id="name"
							type="text"
							value={inputData}
							placeholder="Enter the meeting name"
							onChange={(event) => setInputData(event?.target.value)}
						/>
					</div>
					<hr className={styles['modal-liner']} />
					<div className={styles['content-details']}>
						<div className={styles['content-item']}>
							<IconCalender /> <span>{getFormattedTime()}</span>
						</div>
						<div className={styles['content-item']}>
							<IconWatch /> <span>{time} (15 min)</span>
						</div>
						<div className={styles['content-item']}>
							<IconLocation /> <span>Asia/Kolkata</span>
						</div>
						<div className={styles['content-item']}>
							<IconAttachment />
							<span>Zoom Platform</span>
						</div>
						<div className={styles['content-item']}>
							<IconClock /> <span>15 min before by Email</span>
						</div>
					</div>
				</div>
				<hr className={styles['modal-liner']} />
				<div className={styles['content-description']}>
					<div className={styles['label']}>Brief:</div>
					{event?.description ?? 'N/A'}
				</div>
				<hr className={styles['modal-liner']} />
				<div className={styles.attendees}>
					<strong>Attendees</strong>
					<div className={styles.attendeeList}>
						{(event?.attendees ?? emails).map((attendee) => (
							<div className={styles.attendee} key={attendee.email}>
								<IconRgtArrow size={12} />
								<strong>{attendee.email}</strong>
							</div>
						))}
					</div>
				</div>
			</div>
			<hr className={styles['modal-liner']} />
			<div className={styles['modal-actions']}>
				<button className={styles['save-action']} onClick={onSave}>
					{!event ? 'Save' : 'Update'}
				</button>
				<button className={styles['cancel-action']} onClick={onClose}>
					Cancel
				</button>
			</div>
		</div>
	);
};

export default InvitePopup;

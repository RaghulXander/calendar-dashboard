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
import { IconUnavailable, IconLocation } from 'icons/Icons/my-calender';
import { useEventStore } from 'stores/events';

const emails = ['abc@gmail.com', 'xyz@gmail.com', 'lmn@gmail.com'];

export const InvitePopup: React.FC<{ date: Date, time: string, onClose: () => void }> = ({ time, date, onClose }) => {
	const [inputData, setInputData] = useState("Default Meeting");
	const [{ state }, eventActions] = useEventStore();

	const getFormattedTime = () => {
		const day = Days[date.getDay()];
		const month = Months[date.getMonth()];
		return `${day} ${date.getDate()}, ${month} ${date.getFullYear()}`
	}

	function getTwoDatesWithGap(baseDate: Date, timeString: string) {
		const [hours, minutes] = timeString.split(':').map(Number);
		const date1 = new Date(baseDate);
		date1.setHours(hours, minutes, 0, 0);

		const date2 = new Date(date1.getTime() + 15 * 60000); // Adding 15 minutes in milliseconds
		return [date1, date2];
	}

	const onSuccess = () => {
		eventActions.getEvents();
		onClose();
	}

	const onSave = () => {
		const [start, end] = getTwoDatesWithGap(date, time)
		eventActions.createEvent({ date, start, end, name: inputData }, onSuccess)
	}

	return (
		<div className={`${styles.mcalender_popup} ${styles.show_popup}`}>
			<div className={styles.top_option}>
				<span><IconEdit size={14} /></span>
				<span><IconDelete size={14} /></span>
				<span onClick={onClose}>
					<IconCross size={12} />
				</span>
			</div>
			<hr className={styles["modal-liner"]} />
			<div className={styles["modal-content"]}>
				<div className={styles["modal-content-header"]}>
					<div className={styles["input-container"]}>
						<input id="name" type="text" value={inputData} placeholder='Enter the meeting name' onChange={(event) => setInputData(event?.target.value)} />
					</div>
					<hr className={styles["modal-liner"]} />
					<div className={styles["content-details"]}>
						<div className={styles["content-item"]}><IconCalender /> <span>{getFormattedTime()}</span></div>
						<div className={styles["content-item"]}><IconWatch /> <span>{time} (15 min)</span></div>
						<div className={styles["content-item"]}><IconLocation /> <span>Asia/Kolkata</span></div>
						<div className={styles["content-item"]}><IconAttachment /><span>Zoom Platform</span></div>
						<div className={styles["content-item"]}><IconClock /> <span>15 min before by Email</span></div>
					</div>
					<hr className={styles["modal-liner"]} />
				</div>
				<div className={styles.attendees}>
					<strong>
						Attendees
					</strong>
					<div className={styles.attendeeList}>
						{emails.map((email) => (
							<div className={styles.attendee}>
								<IconUnavailable />
								<strong>{email}</strong>
							</div>
						))}
					</div>
				</div>
			</div>
			<hr className={styles["modal-liner"]} />
			<div className={styles["modal-actions"]}>
				<button className={styles["save-action"]} onClick={onSave}>Save</button>
				<button className={styles["cancel-action"]} onClick={onClose}>Cancel</button>
			</div>
		</div>
	)	
};

export default InvitePopup;

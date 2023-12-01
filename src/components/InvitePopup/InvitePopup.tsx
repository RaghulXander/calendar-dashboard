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
import { IconAvailable, IconLocation } from 'icons/Icons/meetings-page';

const emails = ['abc@gmail.com', 'xyz@gmail.com', 'lmn@gmail.com'];

export const InvitePopup: React.FC<{ date: Date, time: string, onClose: () => void }> = ({ time, date, onClose }) => {
	const [inputData, setInputData] = useState("");

	const getFormattedTime = () => {
		const day = Days[date.getDay()];
		const month = Months[date.getMonth()];
		return `${day} ${date.getDate()}, ${month} ${date.getFullYear()}`
	}

	return (
		< div className={`${styles.mcalender_popup} ${styles.show_popup}`}>
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
								<IconAvailable />
								<strong>{email}</strong>
							</div>
						))}
					</div>
				</div>
			</div>
			<hr className={styles["modal-liner"]} />
			<div className={styles["modal-actions"]}>
				<button className={styles["save-action"]} onClick={onClose}>Save</button>
				<button className={styles["cancel-action"]} onClick={onClose}>Cancel</button>
			</div>
		</div>
	)	
};

export default InvitePopup;

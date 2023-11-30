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

const emails = ['abc@gmail.com', 'xyz@gmail.com', 'lmn@gmail.com'];

export const InvitePopup: React.FC<{ onClose: () => void }> = ({ onClose }) => (
	<div className={`${styles.mcalender_popup} ${styles.show_popup}`}>
		<div className={styles.top_option}>
			<IconEdit />
			<IconDelete />
			<div onClick={onClose}>
				<IconCross />
			</div>
		</div>
		<div className="modal-content">
			<div className="modal-content-header">
				<h2>Logo Designing Discussion</h2>
				<div className="modal-content-details">
					<IconCalender />
					<span>Wednesday, 12th October 2023</span>
					<IconWatch />
					<span>11:00 AM - 11:15 AM</span>
					<span>Asia/Kolkata</span>
				</div>
			</div>
			<div className="modal-content-icons">
				<IconPrint />
				<IconAttachment />
				<IconClock />
			</div>
			<div className={styles.attendees}>
				<div className={styles.bg_white}>
					<strong>
						<img src="..." alt="Icon" />
						Attendees
					</strong>
					<span>10</span>
					<div className={styles.attendees}>
						{emails.map((email) => (
							<div className={styles.attendee}>
								<IconPrint />
								<strong>{email}</strong>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	</div>
);

export default InvitePopup;

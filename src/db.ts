import Dexie, { Table } from 'dexie';
import eventsData from './mock/events2.json';
import { Event } from 'stores/models/calendar.model';

export class MySubClassedDexie extends Dexie {
	events!: Table<Event>;

	constructor() {
		super('myDatabase');
		this.version(1).stores({
			events: '++id, name, date'
		});
	}

	async syncEventsFromJSON() {
		const allEvents = await this.events.toArray();

		if (allEvents.length === 0) {
			await this.transaction('rw', this.events, async () => {
				await Promise.all(
					eventsData.map(async (event: Event) => {
						await this.events.add(event);
					})
				);
			});
		}
	}
}

export const db = new MySubClassedDexie();

async function getAllEvents(): Promise<Event[]> {
	try {
		const events: Event[] = await db.events.toArray();
		return events;
	} catch (error) {
		console.error('Error fetching events:', error);
		throw error;
	}
}

export { getAllEvents };

db.syncEventsFromJSON().then(() => {
	console.log('Events synced from JSON to the database');
});

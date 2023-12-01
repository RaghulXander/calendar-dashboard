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
		// Get all events from the database
		const allEvents = await this.events.toArray();

		// If there are no events in the database, add events from the JSON file
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
		// Open a transaction and get all events from the 'events' table
		const events: Event[] = await db.events.toArray();
		return events;
	} catch (error) {
		// Handle errors if any
		console.error('Error fetching events:', error);
		throw error;
	}
}

export { getAllEvents };

db.syncEventsFromJSON().then(() => {
	console.log('Events synced from JSON to the database');
});

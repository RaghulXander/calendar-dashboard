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
		// Open a transaction to add events from the JSON file to the database
		await this.transaction('rw', this.events, async () => {
			await Promise.all(
				eventsData.map(async (event: Event) => {
					// Check if the event already exists in the database
					const existingEvent = await this.events.where({ name: event.name, date: event.date }).first();

					if (!existingEvent) {
						await this.events.add(event);
					}
				})
			);
		});
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

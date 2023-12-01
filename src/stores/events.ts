import { createHook, type StoreActionApi, createStore } from 'react-sweet-state';
import { type StateContext, Event } from './models/calendar.model';
import { db, getAllEvents } from '../db';

type StateType = StateContext<{ events: Event[]; currentEvent?: Event }>;

const initialState = (): StateType => ({
	state: {
		events: []
	}
});

const actions = {
	getEvents:
		() =>
		async ({ setState }: StoreActionApi<StateType>) => {
			await getAllEvents()
				.then((events) => {
					setState({
						state: {
							events
						}
					});
				})
				.catch((error) => {
					// Handle error if fetching events fails
					console.error('Failed to get events:', error);
				});
		},
	createEvent:
		(data: { date: Date, start: Date, end: Date, name: string }, callback: () => void) =>
			async () => {
				const {date, name, start, end} = data
			function generateUniqueID() {
				return Math.floor(Math.random() * 9000) + 1000;
				}
				const id = generateUniqueID();
			const newEvent: Event = {
				id,
				name: name,
				status: 'confirmed',
				created: date.toISOString(),
				updated: date.toISOString(),
				summary: 'Meeting with team',
				description: 'Discuss project details',
				creator: { email: 'user@example.com', displayName: 'User', self: true },
				organizer: { email: 'user@example.com', displayName: 'User', self: true },
				attendees: [
					{ email: 'attendee1@example.com', displayName: 'Attendee 1', self: false },
					{ email: 'attendee2@example.com', displayName: 'Attendee 2', self: false }
				],
				startTime: new Date(start),
				endTime: new Date(end),
				date: date.toDateString()
			};
				const res = await db.events.add(newEvent, id);
				console.log("res", res);
			callback();
		},
	reset:
		() =>
		({ setState }: StoreActionApi<StateType>) => {
			setState(initialState());
		}
};

export const EventsStore = createStore<StateType, typeof actions>({
	name: 'events-store',
	initialState: initialState(),
	actions
});

export const useEventStore = createHook(EventsStore);

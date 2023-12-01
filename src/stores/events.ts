import { createHook, type StoreActionApi, createStore } from 'react-sweet-state';
import { type StateContext, Event } from './models/calendar.model';
import { db, getAllEvents } from '../db';

type StateType = StateContext<{ events: Event[] }> & {
	loading: boolean;
	currentEvent: Event | undefined;
};

const initialState = (): StateType => ({
	state: {
		events: []
	},
	currentEvent: undefined,
	loading: false
});

const actions = {
	getEvents:
		() =>
		async ({ setState, getState }: StoreActionApi<StateType>) => {
			setState({
				loading: true
			});
			await getAllEvents()
				.then((events) => {
					setState({
						state: {
							...getState().state,
							events
						},
						loading: false
					});
				})
				.catch((error) => {
					console.error('Failed to get events:', error);
				});
		},
	setEvent:
		(eventId: number | undefined) =>
		async ({ setState, getState }: StoreActionApi<StateType>) => {
			if (!eventId) return;
			setState({
				loading: true
			});
			try {
				const event = await db.events.get(eventId);
				if (event) {
					setState({
						currentEvent: { ...event },
						loading: false
					});
				} else {
					console.error(`Event with ID ${eventId} not found.`);
				}
			} catch (error) {
				console.error('Error retrieving event:', error);
			}
		},
	updateEvent:
		(data: Event) =>
		async ({ setState, getState }: StoreActionApi<StateType>) => {
			try {
				setState({
					loading: true
				});
				await db.events.update(data.id as number, data);
				setState({
					loading: false
				});
			} catch (error) {
				console.error('Error updating event:', error);
			}
		},
	deleteEvent:
		(eventId: number | undefined, callback: () => void) =>
		async ({ setState, getState }: StoreActionApi<StateType>) => {
			if (!eventId) return;
			setState({
				loading: true
			});
			try {
				await db.events.delete(eventId as number);
				callback();
				setState({
					loading: false,
					currentEvent: undefined
				});
			} catch (error) {
				console.error('Error updating event:', error);
			}
		},
	createEvent:
		(data: { date: Date; start: Date; end: Date; name: string }, callback: () => void) =>
		async ({ setState, getState }: StoreActionApi<StateType>) => {
			const { date, name, start, end } = data;
			setState({
				loading: true
			});
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
			setState({
				loading: false
			});
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

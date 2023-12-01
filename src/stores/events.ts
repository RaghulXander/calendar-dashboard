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
		({ setState, getState }: StoreActionApi<StateType>) => {
			getAllEvents()
				.then((events) => {
					console.log('All events:', events);
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
		(date: Date) =>
		async ({ setState, getState }: StoreActionApi<StateType>) => {
			const newEvent: Event = {
				name: 'Meeting',
				status: 'confirmed',
				created: '2018-09-27T16:13:39.000Z',
				updated: '2018-09-27T16:13:39.985Z',
				summary: 'Meeting with team',
				description: 'Discuss project details',
				creator: { email: 'user@example.com', displayName: 'User', self: true },
				organizer: { email: 'user@example.com', displayName: 'User', self: true },
				attendees: [
					{ email: 'attendee1@example.com', displayName: 'Attendee 1', self: false },
					{ email: 'attendee2@example.com', displayName: 'Attendee 2', self: false }
				],
				startTime: new Date(date),
				endTime: new Date(date),
				date: date.toISOString()
			};
			await db.events.add(newEvent);
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

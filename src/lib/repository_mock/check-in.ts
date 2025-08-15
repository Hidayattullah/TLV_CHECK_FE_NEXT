
import { mockEvents } from "@/lib/mock/check-in";
import type { CheckInEvent, Attendee } from "@/lib/api/types";

// This is the MOCK repository that simulates API calls for development.
// It uses the local mock data.

let events: CheckInEvent[] = JSON.parse(JSON.stringify(mockEvents));

const simulateApiDelay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export async function getCheckInEvents(): Promise<CheckInEvent[]> {
  await simulateApiDelay();
  console.log("Fetching mock check-in events...");
  return Promise.resolve(JSON.parse(JSON.stringify(events)));
}

export async function getCheckInEventById(id: string): Promise<CheckInEvent | null> {
    await simulateApiDelay(50); // Shorter delay for polling
    console.log(`Fetching mock check-in event by ID: ${id}`);
    const event = events.find(e => e.id === id);
    // Return a deep copy of the found event to ensure the caller gets the most current state
    return Promise.resolve(event ? JSON.parse(JSON.stringify(event)) : null);
}

export async function addAttendee(eventId: string, attendee: Attendee): Promise<CheckInEvent> {
    await simulateApiDelay(100);
    console.log(`Adding mock attendee to event ${eventId}`);
    
    const eventIndex = events.findIndex(event => event.id === eventId);

    if (eventIndex === -1) {
        return Promise.reject(new Error("Event not found"));
    }

    const eventToUpdate = events[eventIndex];

    // Ensure attendees is an array
    if (!Array.isArray(eventToUpdate.attendees)) {
        eventToUpdate.attendees = [];
    }

    // CRITICAL FIX: Check for duplicates before adding
    const alreadyExists = eventToUpdate.attendees.some(a => a.id === attendee.id);

    if (!alreadyExists) {
        console.log(`Attendee ${attendee.name} does not exist. Adding to event.`);
        eventToUpdate.attendees.push(attendee);
        events[eventIndex] = eventToUpdate;
    } else {
        console.log(`Attendee ${attendee.name} already exists. Not adding duplicate.`);
    }

    return Promise.resolve(JSON.parse(JSON.stringify(eventToUpdate)));
}


export async function addCheckInEvent(data: Pick<CheckInEvent, "eventName" | "eventDate">): Promise<CheckInEvent> {
    await simulateApiDelay();
    console.log("Adding mock check-in event...");
    const newEvent: CheckInEvent = {
        ...data,
        id: `evt-${Date.now()}`,
        isActive: true,
        attendees: [],
        activationType: 'manual',
    };
    events = [newEvent, ...events];
    return Promise.resolve(JSON.parse(JSON.stringify(newEvent)));
}

export async function updateCheckInEvent(id: string, data: Pick<CheckInEvent, "eventName" | "eventDate">): Promise<CheckInEvent> {
    await simulateApiDelay();
    console.log(`Updating mock check-in event ${id}...`);
    let eventToUpdate: CheckInEvent | undefined;
    events = events.map(event => {
        if (event.id === id) {
            eventToUpdate = { ...event, ...data };
            return eventToUpdate;
        }
        return event;
    });
    if (eventToUpdate) {
        return Promise.resolve(JSON.parse(JSON.stringify(eventToUpdate)));
    } else {
        return Promise.reject(new Error("Event not found"));
    }
}

export async function deleteCheckInEvent(id: string): Promise<void> {
    await simulateApiDelay();
    console.log(`Deleting mock check-in event ${id}...`);
    const initialLength = events.length;
    events = events.filter(event => event.id !== id);
    if (events.length < initialLength) {
        return Promise.resolve();
    } else {
        return Promise.reject(new Error("Event not found for deletion"));
    }
}

export async function updateCheckInEventStatus(id: string, isActive: boolean): Promise<CheckInEvent> {
    await simulateApiDelay(100);
    console.log(`Updating mock check-in event status ${id}...`);
    let eventToUpdate: CheckInEvent | undefined;
    events = events.map(event => {
        if (event.id === id) {
            if (event.deactivationTimer) {
                clearTimeout(event.deactivationTimer);
            }
            eventToUpdate = { 
                ...event, 
                isActive, 
                deactivationTimer: undefined, 
                activationType: isActive ? 'manual' : undefined, 
                timerEndsAt: undefined 
            };
            return eventToUpdate;
        }
        return event;
    });
    if (eventToUpdate) {
        return Promise.resolve(JSON.parse(JSON.stringify(eventToUpdate)));
    } else {
        return Promise.reject(new Error("Event not found"));
    }
}

export async function setCheckInEventTimer(id: string, hours: number, onTimerEnd: (id: string, status: boolean) => void): Promise<CheckInEvent> {
    await simulateApiDelay(100);
    console.log(`Setting timer for mock check-in event ${id}...`);
    let eventToUpdate: CheckInEvent | undefined;
    const durationMs = hours * 60 * 60 * 1000;
    const endsAt = Date.now() + durationMs;

    const newTimer = setTimeout(() => {
        onTimerEnd(id, false);
    }, durationMs);

    events = events.map(event => {
        if (event.id === id) {
            if (event.deactivationTimer) {
                clearTimeout(event.deactivationTimer);
            }
            eventToUpdate = {
                ...event,
                isActive: true,
                deactivationTimer: newTimer,
                activationType: 'timer' as const,
                timerEndsAt: endsAt
            };
            return eventToUpdate;
        }
        return event;
    });
    if (eventToUpdate) {
        return Promise.resolve(JSON.parse(JSON.stringify(eventToUpdate)));
    } else {
        clearTimeout(newTimer);
        return Promise.reject(new Error("Event not found"));
    }
}

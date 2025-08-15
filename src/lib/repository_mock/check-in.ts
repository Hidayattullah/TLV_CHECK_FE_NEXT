
import { mockEvents } from "@/lib/mock/check-in";
import type { CheckInEvent, Attendee } from "@/lib/api/types";

// This is the MOCK repository that simulates API calls for development.
// It uses localStorage to persist data and simulate a shared backend state.

const LOCAL_STORAGE_KEY = 'checkin_events_mock';

const getEventsFromStorage = (): CheckInEvent[] => {
  if (typeof window === 'undefined') {
    return JSON.parse(JSON.stringify(mockEvents));
  }
  const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (storedData) {
    try {
      const parsed = JSON.parse(storedData);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (e) {
       localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }
  // If no valid data, initialize from mock and save
  const initialData = JSON.parse(JSON.stringify(mockEvents));
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialData));
  return initialData;
};

const saveEventsToStorage = (events: CheckInEvent[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(events));
  }
};


const simulateApiDelay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export async function getCheckInEvents(): Promise<CheckInEvent[]> {
  await simulateApiDelay();
  console.log("Fetching mock check-in events...");
  const events = getEventsFromStorage();
  return Promise.resolve(JSON.parse(JSON.stringify(events)));
}

export async function getCheckInEventById(id: string): Promise<CheckInEvent | null> {
    await simulateApiDelay(50); 
    console.log(`Fetching mock check-in event by ID: ${id}`);
    const events = getEventsFromStorage();
    const event = events.find(e => e.id === id);
    return Promise.resolve(event ? JSON.parse(JSON.stringify(event)) : null);
}

export async function addAttendee(eventId: string, attendee: Attendee): Promise<CheckInEvent> {
    await simulateApiDelay(100);
    let events = getEventsFromStorage();
    const eventIndex = events.findIndex(event => event.id === eventId);

    if (eventIndex === -1) {
        return Promise.reject(new Error("Event not found"));
    }

    const eventToUpdate = { ...events[eventIndex] };

    if (!Array.isArray(eventToUpdate.attendees)) {
        eventToUpdate.attendees = [];
    }

    const alreadyExists = eventToUpdate.attendees.some(a => a.id === attendee.id);

    if (!alreadyExists) {
        eventToUpdate.attendees.push(attendee);
        events[eventIndex] = eventToUpdate;
        saveEventsToStorage(events);
    }

    return Promise.resolve(JSON.parse(JSON.stringify(eventToUpdate)));
}


export async function addCheckInEvent(data: Pick<CheckInEvent, "eventName" | "eventDate">): Promise<CheckInEvent> {
    await simulateApiDelay();
    console.log("Adding mock check-in event...");
    let events = getEventsFromStorage();
    const newEvent: CheckInEvent = {
        ...data,
        id: `evt-${Date.now()}`,
        isActive: true, // New events should be active by default
        attendees: [],
        activationType: 'manual',
    };
    events.unshift(newEvent);
    saveEventsToStorage(events);
    return Promise.resolve(JSON.parse(JSON.stringify(newEvent)));
}

export async function updateCheckInEvent(id: string, data: Pick<CheckInEvent, "eventName" | "eventDate">): Promise<CheckInEvent> {
    await simulateApiDelay();
    console.log(`Updating mock check-in event ${id}...`);
    let events = getEventsFromStorage();
    let eventToUpdate: CheckInEvent | undefined;
    events = events.map(event => {
        if (event.id === id) {
            eventToUpdate = { ...event, ...data };
            return eventToUpdate;
        }
        return event;
    });
    if (eventToUpdate) {
        saveEventsToStorage(events);
        return Promise.resolve(JSON.parse(JSON.stringify(eventToUpdate)));
    } else {
        return Promise.reject(new Error("Event not found"));
    }
}

export async function deleteCheckInEvent(id: string): Promise<void> {
    await simulateApiDelay();
    console.log(`Deleting mock check-in event ${id}...`);
    let events = getEventsFromStorage();
    const initialLength = events.length;
    events = events.filter(event => event.id !== id);
    if (events.length < initialLength) {
        saveEventsToStorage(events);
        return Promise.resolve();
    } else {
        return Promise.reject(new Error("Event not found for deletion"));
    }
}

export async function updateCheckInEventStatus(id: string, isActive: boolean): Promise<CheckInEvent> {
    await simulateApiDelay(100);
    console.log(`Updating mock check-in event status for ${id} to ${isActive}`);
    let events = getEventsFromStorage();
    let eventToUpdate: CheckInEvent | undefined;
    const eventIndex = events.findIndex(e => e.id === id);
    
    if (eventIndex === -1) {
        return Promise.reject(new Error("Event not found"));
    }
    
    const currentEvent = events[eventIndex];
    
    eventToUpdate = { 
        ...currentEvent, 
        isActive, 
        deactivationTimer: undefined, 
        activationType: 'manual', 
        timerEndsAt: undefined 
    };
    
    events[eventIndex] = eventToUpdate;
    saveEventsToStorage(events);

    if (eventToUpdate) {
        return Promise.resolve(JSON.parse(JSON.stringify(eventToUpdate)));
    } else {
        return Promise.reject(new Error("Event not found"));
    }
}

export async function setCheckInEventTimer(id: string, hours: number, onTimerEnd: (id: string, status: boolean) => void): Promise<CheckInEvent> {
    await simulateApiDelay(100);
    console.log(`Setting timer for mock check-in event ${id}...`);
    let events = getEventsFromStorage();
    let eventToUpdate: CheckInEvent | undefined;
    const durationMs = hours * 60 * 60 * 1000;
    const endsAt = Date.now() + durationMs;

    const eventIndex = events.findIndex(e => e.id === id);

    if (eventIndex === -1) {
       return Promise.reject(new Error("Event not found"));
    }
    
    const currentEvent = events[eventIndex];
    eventToUpdate = {
      ...currentEvent,
      isActive: true,
      activationType: 'timer' as const,
      timerEndsAt: endsAt
    };
    events[eventIndex] = eventToUpdate;
    saveEventsToStorage(events);

    if (eventToUpdate) {
        return Promise.resolve(JSON.parse(JSON.stringify(eventToUpdate)));
    } else {
        return Promise.reject(new Error("Event not found"));
    }
}

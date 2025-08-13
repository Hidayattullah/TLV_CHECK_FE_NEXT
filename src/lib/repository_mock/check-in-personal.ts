import { mockEvents } from "@/lib/mock/check-in";
import type { PersonalCheckInRecord } from "@/lib/api/types";

// This is the MOCK repository that simulates API calls for a user's personal check-in history.
// It uses the local mock data and transforms it for the personal view.

const simulateApiDelay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export async function getPersonalCheckInHistory(userName: string): Promise<PersonalCheckInRecord[]> {
  await simulateApiDelay();
  console.log(`Fetching mock personal check-in history for ${userName}...`);

  const personalHistory: PersonalCheckInRecord[] = [];

  mockEvents.forEach(event => {
    event.attendees.forEach(attendee => {
      if (attendee.name === userName) {
        personalHistory.push({
          id: `${event.id}-${attendee.id}`,
          service: event.eventName,
          checkinDate: `${event.eventDate} ${attendee.checkinTime}`,
          checkinMethod: attendee.checkinMethod,
        });
      }
    });
  });
  
  // Sort by date descending
  personalHistory.sort((a, b) => new Date(b.checkinDate).getTime() - new Date(a.checkinDate).getTime());

  return Promise.resolve(personalHistory);
}

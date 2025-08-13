import customFetch from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { CheckInEvent } from "@/lib/api/types";

// This is the REAL repository that will be used in production.
// It will make real API calls to the backend.

export async function getCheckInEvents(): Promise<CheckInEvent[]> {
  console.log("Fetching real check-in events data...");
  return customFetch<CheckInEvent[]>(API_ENDPOINTS.GET_CHECK_IN_EVENTS);
}

export async function addCheckInEvent(data: Pick<CheckInEvent, "eventName" | "eventDate">): Promise<CheckInEvent> {
  console.log("Adding new check-in event via API...");
  return customFetch<CheckInEvent>(API_ENDPOINTS.ADD_CHECK_IN_EVENT, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCheckInEvent(id: string, data: Pick<CheckInEvent, "eventName" | "eventDate">): Promise<CheckInEvent> {
  console.log(`Updating check-in event ${id} via API...`);
  return customFetch<CheckInEvent>(API_ENDPOINTS.UPDATE_CHECK_IN_EVENT(id), {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteCheckInEvent(id: string): Promise<void> {
  console.log(`Deleting check-in event ${id} via API...`);
  await customFetch<void>(API_ENDPOINTS.DELETE_CHECK_IN_EVENT(id), {
    method: 'DELETE',
  });
}

export async function updateCheckInEventStatus(id: string, isActive: boolean): Promise<CheckInEvent> {
  console.log(`Updating check-in event status ${id} via API...`);
  return customFetch<CheckInEvent>(API_ENDPOINTS.UPDATE_CHECK_IN_EVENT_STATUS(id), {
    method: 'PATCH',
    body: JSON.stringify({ isActive }),
  });
}

export async function setCheckInEventTimer(id: string, hours: number): Promise<CheckInEvent> {
    console.log(`Setting timer for check-in event ${id} via API...`);
    return customFetch<CheckInEvent>(API_ENDPOINTS.SET_CHECK_IN_EVENT_TIMER(id), {
        method: 'POST',
        body: JSON.stringify({ hours }),
    });
}

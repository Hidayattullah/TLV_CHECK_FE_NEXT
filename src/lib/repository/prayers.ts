import customFetch from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { PrayerRequest } from "@/lib/api/types";

// This is the REAL repository that will be used in production.
// It will make real API calls to the backend.

export async function getPrayerRequests(): Promise<PrayerRequest[]> {
  console.log("Fetching real prayer requests data...");
  return customFetch<PrayerRequest[]>(API_ENDPOINTS.GET_PRAYER_REQUESTS);
}

export async function respondToPrayerRequest(
  prayerId: string,
  responseText: string,
  responderName: string
): Promise<PrayerRequest> {
  console.log(`Responding to prayer request ${prayerId} via API...`);
  return customFetch<PrayerRequest>(API_ENDPOINTS.RESPOND_TO_PRAYER_REQUEST(prayerId), {
    method: 'POST',
    body: JSON.stringify({ responseText, responderName }),
  });
}

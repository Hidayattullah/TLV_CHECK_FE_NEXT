import { mockPrayers } from "@/lib/mock/prayers";
import type { PrayerRequest } from "@/lib/api/types";

let prayers: PrayerRequest[] = [...mockPrayers];

const simulateApiDelay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export async function getPrayerRequests(): Promise<PrayerRequest[]> {
  await simulateApiDelay();
  console.log("Fetching mock prayer requests...");
  return Promise.resolve([...prayers]);
}

export async function respondToPrayerRequest(
  prayerId: string,
  responseText: string,
  responderName: string
): Promise<PrayerRequest> {
  await simulateApiDelay();
  console.log(`Responding to mock prayer request ${prayerId}...`);
  let updatedPrayer: PrayerRequest | undefined;
  prayers = prayers.map(p => {
    if (p.id === prayerId) {
      updatedPrayer = {
        ...p,
        isResponded: true,
        responseText,
        lastResponseBy: responderName,
      };
      return updatedPrayer;
    }
    return p;
  });

  if (updatedPrayer) {
    return Promise.resolve(updatedPrayer);
  } else {
    return Promise.reject(new Error("Prayer request not found"));
  }
}

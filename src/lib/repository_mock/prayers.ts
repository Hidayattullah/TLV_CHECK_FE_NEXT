
import { mockPrayers } from "@/lib/mock/prayers";
import type { PrayerRequest } from "@/lib/api/types";

let prayers: PrayerRequest[] = [...mockPrayers];
const ARCHIVE_AFTER_DAYS = 7;
const DELETE_AFTER_DAYS = 14;

const simulateApiDelay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate cron job for archiving and deleting
const processPrayers = () => {
  const now = new Date();
  prayers = prayers
    .map(p => {
      const submittedDate = new Date(p.submittedDate);
      const diffDays = (now.getTime() - submittedDate.getTime()) / (1000 * 3600 * 24);
      
      if (!p.isArchived && diffDays > ARCHIVE_AFTER_DAYS) {
        return { ...p, isArchived: true, archivedDate: now.toISOString() };
      }
      return p;
    })
    .filter(p => {
        if (p.isArchived && p.archivedDate) {
            const archivedDate = new Date(p.archivedDate);
            const diffDays = (now.getTime() - archivedDate.getTime()) / (1000 * 3600 * 24);
            return diffDays <= ARCHIVE_AFTER_DAYS;
        }
        return true;
    });
};

export async function getPrayerRequests(): Promise<PrayerRequest[]> {
  await simulateApiDelay();
  processPrayers(); // Run processing before returning data
  console.log("Fetching mock prayer requests...");
  return Promise.resolve([...prayers]);
}

export async function addPrayerRequest(data: { userName: string; requestText: string; isAnonymous: boolean, submittedBy: string, avatarUrl?: string }): Promise<PrayerRequest> {
  await simulateApiDelay();
  console.log("Adding mock prayer request...");
  const newPrayer: PrayerRequest = {
    ...data,
    id: `p-${Date.now()}`,
    submittedDate: new Date().toISOString(),
    isResponded: false,
    isArchived: false,
  };
  prayers = [newPrayer, ...prayers];
  return Promise.resolve(newPrayer);
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

export async function deletePrayers(ids: string[]): Promise<void> {
    await simulateApiDelay(500);
    console.log(`Deleting mock prayers: ${ids.join(', ')}`);
    const initialLength = prayers.length;
    prayers = prayers.filter(p => !ids.includes(p.id));
    if (prayers.length < initialLength) {
        return Promise.resolve();
    } else {
        return Promise.reject(new Error("Some prayers not found for deletion"));
    }
}

export async function archivePrayer(prayerId: string): Promise<PrayerRequest> {
  await simulateApiDelay();
  console.log(`Archiving mock prayer ${prayerId}...`);
  let archivedPrayer: PrayerRequest | undefined;
  prayers = prayers.map(p => {
    if (p.id === prayerId) {
      archivedPrayer = {
        ...p,
        isArchived: true,
        archivedDate: new Date().toISOString(),
      };
      return archivedPrayer;
    }
    return p;
  });

  if (archivedPrayer) {
    return Promise.resolve(archivedPrayer);
  } else {
    return Promise.reject(new Error("Prayer request not found for archiving"));
  }
}

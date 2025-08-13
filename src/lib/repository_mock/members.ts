import { initialMembers } from "@/lib/mock/members";
import type { Member, NewMember } from "@/lib/api/types";

// This is the MOCK repository that simulates API calls for development.
// It uses the local mock data.

let members: Member[] = [...initialMembers];

const simulateApiDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export async function getMembers(): Promise<Member[]> {
  await simulateApiDelay();
  console.log("Fetching mock members data...");
  return Promise.resolve([...members]);
}

export async function addMember(newMemberData: Omit<NewMember, "password">): Promise<Member> {
  await simulateApiDelay();
  console.log("Adding mock member...");
  const newMember: Member = {
    ...newMemberData,
    id: `member-${Date.now()}`,
    joinedDate: new Date().toISOString().split("T")[0],
    isActive: true,
    isVerified: true, // Auto-verified for mock
    avatarUrl: "",
    permissions: { members: [], checkin: [], prayers: [], questions: [] },
    rfid: { id: null, type: null },
  };
  members = [newMember, ...members];
  return Promise.resolve(newMember);
}

export async function updateMember(id: string, updatedData: Partial<Member>): Promise<Member> {
  await simulateApiDelay();
  console.log(`Updating mock member ${id}...`);
  let memberToUpdate: Member | undefined;
  members = members.map(member => {
    if (member.id === id) {
      memberToUpdate = { ...member, ...updatedData };
      return memberToUpdate;
    }
    return member;
  });

  if (memberToUpdate) {
    return Promise.resolve(memberToUpdate);
  } else {
    return Promise.reject(new Error("Member not found"));
  }
}

export async function deleteMember(id: string): Promise<void> {
  await simulateApiDelay(800);
  console.log(`Deleting mock member ${id}...`);
  const initialLength = members.length;
  members = members.filter(member => member.id !== id);
  if (members.length < initialLength) {
    return Promise.resolve();
  } else {
    return Promise.reject(new Error("Member not found for deletion"));
  }
}

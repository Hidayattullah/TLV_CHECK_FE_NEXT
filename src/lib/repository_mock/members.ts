
import { initialMembers } from "@/lib/mock/members";
import type { Member, NewMember } from "@/lib/api/types";

// This is the MOCK repository that simulates API calls for development.
// It uses the local mock data.

let members: Member[] = [...initialMembers];

// Hardcoded passwords for mock users. In a real app, this would be hashed in a DB.
const memberPasswords: Record<string, string> = {
  "1": "password123", // Tubagus Rifan
  "2": "password123", // Jane Doe
  "3": "adminpass",   // Admin Gereja
  "4": "password123", // Sarah Connor
  "5": "password123", // John Smith
  "6": "password123", // Michael Bay
  "7": "password123", // Ellen Ripley
};


const simulateApiDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Creates a mock JWT.
 * In a real app, this would be done by the backend.
 */
const createMockJwt = (payload: object): string => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  // In a real JWT, the signature would be a cryptographic hash. Here, it's just a placeholder.
  const signature = 'mockSignature';
  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

export async function login(phoneNumber: string, password: string): Promise<{ token: string; member: Member }> {
  await simulateApiDelay();
  console.log(`Attempting mock login for phone number: ${phoneNumber}`);
  
  const member = members.find(m => m.phoneNumber === phoneNumber);
  
  if (!member) {
    throw new Error("Nomor telepon tidak ditemukan.");
  }
  
  // Check if the provided password matches the hardcoded password for that member
  if (memberPasswords[member.id] !== password) {
    throw new Error("Password salah.");
  }

  // Create a mock JWT with the user's ID in the 'sub' (subject) claim
  const token = createMockJwt({ sub: member.id });
  
  return Promise.resolve({ token, member });
}

export async function getMembers(): Promise<Member[]> {
  await simulateApiDelay();
  console.log("Fetching mock members data...");
  return Promise.resolve([...members]);
}

export async function getMemberById(id: string): Promise<Member> {
  await simulateApiDelay();
  console.log(`Fetching mock member data for id: ${id}...`);
  const member = members.find(m => m.id === id);
  if (member) {
    return Promise.resolve(member);
  } else {
    return Promise.reject(new Error("Member not found"));
  }
}

export async function getMemberByPhoneNumber(phoneNumber: string): Promise<Member | null> {
  await simulateApiDelay();
  console.log(`Fetching mock member data for phone: ${phoneNumber}...`);
  const member = members.find(m => m.phoneNumber === phoneNumber);
  return Promise.resolve(member || null);
}

export async function addMember(newMemberData: NewMember): Promise<Member> {
  await simulateApiDelay();
  console.log("Adding mock member...");

  const existingMember = await getMemberByPhoneNumber(newMemberData.phoneNumber);
  if (existingMember) {
    return Promise.reject(new Error("Phone number already registered."));
  }

  const newMember: Member = {
    ...newMemberData,
    email: newMemberData.email || `${newMemberData.name.toLowerCase().replace(/\s/g, '.')}@generated.com`,
    id: `member-${Date.now()}`,
    joinedDate: new Date().toISOString().split("T")[0],
    isActive: true,
    isVerified: true, // Auto-verified for mock
    avatarUrl: "",
    permissions: { members: [], checkin: [], prayers: [], questions: [] },
    rfid: { id: null, type: null },
  };
  
  // Add password for the new member
  if(newMemberData.password){
    memberPasswords[newMember.id] = newMemberData.password;
  }

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

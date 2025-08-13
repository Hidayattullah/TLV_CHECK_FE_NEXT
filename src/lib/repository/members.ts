import customFetch from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { Member, NewMember } from "@/lib/api/types";

// This is the REAL repository that will be used in production.
// It will make real API calls to the backend.

export async function getMembers(): Promise<Member[]> {
  console.log("Fetching real members data...");
  return customFetch<Member[]>(API_ENDPOINTS.GET_MEMBERS);
}

export async function addMember(newMemberData: Omit<NewMember, "password">): Promise<Member> {
  console.log("Adding new member via API...");
  return customFetch<Member>(API_ENDPOINTS.ADD_MEMBER, {
    method: 'POST',
    body: JSON.stringify(newMemberData),
  });
}

export async function updateMember(id: string, updatedData: Partial<Member>): Promise<Member> {
  console.log(`Updating member ${id} via API...`);
  return customFetch<Member>(API_ENDPOINTS.UPDATE_MEMBER(id), {
    method: 'PATCH',
    body: JSON.stringify(updatedData),
  });
}

export async function deleteMember(id: string): Promise<void> {
  console.log(`Deleting member ${id} via API...`);
  await customFetch<void>(API_ENDPOINTS.DELETE_MEMBER(id), {
    method: 'DELETE',
  });
}

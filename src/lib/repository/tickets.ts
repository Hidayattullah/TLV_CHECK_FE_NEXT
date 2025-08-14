import customFetch from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { SupportTicket, TicketStatus } from "@/lib/api/types";

// This is the REAL repository that will be used in production.
// It will make real API calls to the backend.

export async function createSupportTicket(data: { userName: string; phoneNumber: string; description: string }): Promise<SupportTicket> {
  console.log("Creating new support ticket via API...");
  return customFetch<SupportTicket>(API_ENDPOINTS.CREATE_SUPPORT_TICKET, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getAllSupportTickets(): Promise<SupportTicket[]> {
  console.log("Fetching all support tickets via API...");
  return customFetch<SupportTicket[]>(API_ENDPOINTS.GET_ALL_SUPPORT_TICKETS);
}

export async function getSupportTicketById(ticketId: string): Promise<SupportTicket | null> {
  console.log(`Fetching support ticket ${ticketId} via API...`);
  // Assuming the API returns a 404 which customFetch will handle, 
  // but we might need to add specific error handling if we need to return null instead of throwing.
  try {
    return await customFetch<SupportTicket>(API_ENDPOINTS.GET_SUPPORT_TICKET_BY_ID(ticketId));
  } catch (error) {
    // A simple check for a 'Not Found' style error. This might need adjustment
    // based on the actual API error response format.
    if (error instanceof Error && error.message.toLowerCase().includes('not found')) {
      return null;
    }
    // Re-throw other errors
    throw error;
  }
}

export async function updateSupportTicket(
  ticketId: string,
  updateData: { status: TicketStatus; response?: string; resolvedBy?: string }
): Promise<SupportTicket> {
  console.log(`Updating support ticket ${ticketId} via API...`);
  return customFetch<SupportTicket>(API_ENDPOINTS.UPDATE_SUPPORT_TICKET(ticketId), {
    method: 'PATCH',
    body: JSON.stringify(updateData),
  });
}

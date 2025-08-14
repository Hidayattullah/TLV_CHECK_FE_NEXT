
import { mockTickets } from "@/lib/mock/tickets";
import type { SupportTicket } from "@/lib/api/types";

let tickets: SupportTicket[] = [...mockTickets];

const simulateApiDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export async function createSupportTicket(data: { userName: string; phoneNumber: string; description: string }): Promise<SupportTicket> {
  await simulateApiDelay();
  console.log("Creating new mock support ticket...");
  
  const newTicket: SupportTicket = {
    ...data,
    id: `TICKET-${Date.now()}`,
    submittedDate: new Date().toISOString(),
    isResolved: false,
  };

  tickets.unshift(newTicket);
  return Promise.resolve(newTicket);
}

export async function getSupportTicketById(ticketId: string): Promise<SupportTicket | null> {
  await simulateApiDelay();
  console.log(`Fetching mock support ticket with ID: ${ticketId}`);
  
  const ticket = tickets.find(t => t.id.toLowerCase() === ticketId.toLowerCase());
  
  return Promise.resolve(ticket || null);
}

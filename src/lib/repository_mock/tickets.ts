
import { mockTickets } from "@/lib/mock/tickets";
import type { SupportTicket, TicketStatus } from "@/lib/api/types";

let tickets: SupportTicket[] = [...mockTickets];
const DELETE_AFTER_DAYS = 3;

const simulateApiDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate cron job for auto-deleting old tickets
const processTickets = () => {
    const now = new Date();
    tickets = tickets.filter(ticket => {
        if ((ticket.status === 'Selesai' || ticket.status === 'Ditolak') && ticket.resolvedDate) {
            const resolvedDate = new Date(ticket.resolvedDate);
            const diffDays = (now.getTime() - resolvedDate.getTime()) / (1000 * 3600 * 24);
            return diffDays <= DELETE_AFTER_DAYS;
        }
        return true;
    });
};

export async function createSupportTicket(data: { userName: string; phoneNumber: string; description: string }): Promise<SupportTicket> {
  await simulateApiDelay();
  console.log("Creating new mock support ticket...");
  
  const newTicket: SupportTicket = {
    ...data,
    id: `TICKET-${Date.now()}`,
    submittedDate: new Date().toISOString(),
    status: "Proses",
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

export async function getAllSupportTickets(): Promise<SupportTicket[]> {
  await simulateApiDelay();
  processTickets(); // Simulate cleanup before fetching
  console.log("Fetching all mock support tickets...");
  // sort by date descending
  const sortedTickets = [...tickets].sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime());
  return Promise.resolve(sortedTickets);
}

export async function updateSupportTicket(
  ticketId: string,
  updateData: { status?: TicketStatus; response?: string; resolvedBy?: string }
): Promise<SupportTicket> {
    await simulateApiDelay();
    console.log(`Updating mock support ticket with ID: ${ticketId}`);

    let updatedTicket: SupportTicket | undefined;

    tickets = tickets.map(ticket => {
        if (ticket.id === ticketId) {
            updatedTicket = { ...ticket, ...updateData };
            if (updateData.status && (updateData.status === "Selesai" || updateData.status === "Ditolak")) {
                updatedTicket.resolvedDate = new Date().toISOString();
                updatedTicket.resolvedBy = updateData.resolvedBy;
            }
             if (updateData.status && updateData.status === "Proses") {
                updatedTicket.resolvedDate = undefined;
                updatedTicket.resolvedBy = undefined;
                updatedTicket.response = ""; // Clear response if moved back to progress
            }
            return updatedTicket;
        }
        return ticket;
    });

    if (updatedTicket) {
        return Promise.resolve(updatedTicket);
    } else {
        return Promise.reject(new Error("Ticket not found"));
    }
}

export async function deleteTickets(ids: string[]): Promise<void> {
    await simulateApiDelay(500);
    console.log(`Deleting mock tickets: ${ids.join(', ')}`);
    const initialLength = tickets.length;
    tickets = tickets.filter(t => !ids.includes(t.id));
    if (tickets.length < initialLength) {
        return Promise.resolve();
    } else {
        return Promise.reject(new Error("Some tickets not found for deletion"));
    }
}

import type { CheckInEvent } from "@/lib/api/types";

export const mockEvents: CheckInEvent[] = [
  {
    id: "evt-001",
    eventName: "Ibadah Raya 1",
    eventDate: "2024-07-28",
    isActive: true,
    activationType: 'manual',
    attendees: [
      { id: "1", name: "Tubagus Rifan", checkinTime: "09:05", checkinMethod: "Barcode" },
      { id: "4", name: "Sarah Connor", checkinTime: "09:02", checkinMethod: "RFID" },
      { id: "user-a", name: "John Doe", checkinTime: "09:03", checkinMethod: "Barcode" },
      { id: "user-b", name: "Peter Parker", checkinTime: "09:04", checkinMethod: "RFID" },
      { id: "user-c", name: "Bruce Wayne", checkinTime: "09:06", checkinMethod: "Barcode" },
      { id: "user-d", name: "Clark Kent", checkinTime: "09:07", checkinMethod: "RFID" },
    ],
  },
  {
    id: "evt-002",
    eventName: "Ibadah Raya 2",
    eventDate: "2024-07-28",
    isActive: true,
    activationType: 'manual',
    attendees: [
      { id: "2", name: "Jane Doe", checkinTime: "17:02", checkinMethod: "RFID" },
    ],
  },
  {
    id: "evt-003",
    eventName: "Ibadah Dewasa Muda",
    eventDate: "2024-07-27",
    isActive: false,
    attendees: [
      { id: "6", name: "Michael Bay", checkinTime: "18:30", checkinMethod: "Barcode" },
      { id: "3", name: "Admin Gereja", checkinTime: "18:25", checkinMethod: "RFID" },
    ],
  },
  {
    id: "evt-004",
    eventName: "Ibadah Youth",
    eventDate: "2024-07-26",
    isActive: false,
    attendees: [],
  },
];

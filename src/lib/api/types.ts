export type Permission = "create" | "read" | "update" | "delete" | "write";
export type Module = "members" | "checkin" | "prayers" | "questions" | "tickets";
export type RfidType = "Card" | "Tag" | "Stiker";
export type Gender = "Laki-laki" | "Perempuan";

export type Member = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  joinedDate: string;
  isActive: boolean;
  phoneNumber: string;
  isVerified: boolean;
  address: string;
  dateOfBirth: string;
  gender: Gender;
  password?: string; // Optional for security, might not be sent to client
  permissions: Record<Module, Permission[]>;
  rfid: {
    id: string | null;
    type: RfidType | null;
  };
};

// Type for adding a new member from registration form
export type NewMember = Omit<Member, "id" | "joinedDate" | "isActive" | "isVerified" | "avatarUrl" | "permissions" | "rfid">;

// Check-in types
export type Attendee = {
  id: string;
  name: string;
  checkinTime: string;
  checkinMethod: "Barcode" | "RFID";
};

export type CheckInEvent = {
  id: string;
  eventName: string;
  eventDate: string;
  isActive: boolean;
  attendees: Attendee[];
  activationType?: 'manual' | 'timer';
  deactivationTimer?: ReturnType<typeof setTimeout>;
  timerEndsAt?: number;
};

export type PersonalCheckInRecord = {
  id: string;
  service: string;
  checkinDate: string;
  checkinMethod: "Barcode" | "RFID";
};


// Prayer Request types
export type PrayerRequest = {
  id: string;
  userName: string;
  avatarUrl?: string;
  requestText: string;
  submittedDate: string;
  isAnonymous: boolean;
  submittedBy?: string; // To track owner of anonymous requests
  isResponded?: boolean;
  lastResponseBy?: string;
  responseText?: string;
  isArchived?: boolean;
  archivedDate?: string;
};

// Question types
export type Question = {
  id: string;
  userName: string;
  avatarUrl?: string;
  questionText: string;
  submittedDate: string;
  isResponded?: boolean;
  responseBy?: string;
  responseText?: string;
  isArchived?: boolean;
  archivedDate?: string;
};

// Support Ticket types
export type TicketStatus = "Proses" | "Selesai" | "Ditolak";

export type SupportTicket = {
  id: string;
  userName: string;
  phoneNumber: string;
  description: string;
  submittedDate: string;
  status: TicketStatus;
  response?: string;
  resolvedBy?: string;
  resolvedDate?: string;
};
